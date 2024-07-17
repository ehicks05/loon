import { useEffect, useRef } from "react";
import {
  useUserStore,
  setSelectedTrackId,
} from "../../../common/UserContextProvider";
import { getTrackById } from "../../../common/AppContextProvider";
import { scaleVolume, getMaxSafeGain, scrollIntoView } from "./playerUtils";
import { usePlayerStore } from "../../../common/PlayerContextProvider";
import { getNewTrackId } from "./trackDeterminationUtils";
import renderSpectrumFrame from "./spectrum";
import apiUrl from "../../../apiUrl";

const Player = () => {
  const userState = useUserStore((state) => state.userState);
  const {
    setElapsedTime,
    setDuration,
    playbackState,
    setPlaybackState,
    forcedElapsedTime,
    setAudioCtx,
    setAnalyser,
  } = usePlayerStore((state) => ({
    setElapsedTime: state.setElapsedTime,
    setDuration: state.setDuration,
    playbackState: state.playbackState,
    setPlaybackState: state.setPlaybackState,
    forcedElapsedTime: state.forcedElapsedTime,
    setAudioCtx: state.setAudioCtx,
    setAnalyser: state.setAnalyser,
  }));

  let audio = useRef({});
  let audioCtx = useRef({});
  let trackGainNode = useRef({});
  let gainNode = useRef({});
  let band1 = useRef({});
  let band2 = useRef({});
  let band3 = useRef({});
  let band4 = useRef({});
  let analyser = useRef({});
  let audioBufferSourceNode = useRef({});

  useEffect(() => {
    if (audio) audio.current.currentTime = forcedElapsedTime;
  }, [forcedElapsedTime]);

  useEffect(() => {
    function initAudio() {
      const audio = new Audio();
      audio.crossOrigin = "use-credentials";
      audio.controls = false;
      audio.autoplay = false;
      audio.onended = () => {
        changeTrack("next");
      };
      audio.ondurationchange = () => {
        setDuration(audio.duration);
      };
      audio.onerror = () => {
        console.log(audio.error);
      };
      audio.onplaying = () => {
        renderSpectrumFrame();
      };
      audio.onpause = (e) => {
        console.log(e);
      };
      audio.ontimeupdate = () => {
        setElapsedTime(audio.currentTime);
      };
      document.body.appendChild(audio);
      return audio;
    }
    audio.current = initAudio();

    audioCtx.current = new window.AudioContext();
    trackGainNode.current = audioCtx.current.createGain();
    gainNode.current = audioCtx.current.createGain();
    band1.current = audioCtx.current.createBiquadFilter();
    band2.current = audioCtx.current.createBiquadFilter();
    band3.current = audioCtx.current.createBiquadFilter();
    band4.current = audioCtx.current.createBiquadFilter();
    analyser.current = audioCtx.current.createAnalyser();

    gainNode.current.gain.value = scaleVolume(userState.volume);
    gainNode.current.connect(trackGainNode.current);

    band1.current.type = "lowshelf";
    band1.current.frequency.value = userState.eq1Frequency;
    band1.current.gain.value = userState.eq1Gain;
    band2.current.type = "peaking";
    band2.current.frequency.value = userState.eq2Frequency;
    band2.current.gain.value = userState.eq2Gain;
    band3.current.type = "peaking";
    band3.current.frequency.value = userState.eq3Frequency;
    band3.current.gain.value = userState.eq3Gain;
    band4.current.type = "highshelf";
    band4.current.frequency.value = userState.eq4Frequency;
    band4.current.gain.value = userState.eq4Gain;

    analyser.current.fftSize = 4096;

    trackGainNode.current.connect(band1.current);
    band1.current.connect(band2.current);
    band2.current.connect(band3.current);
    band3.current.connect(band4.current);
    band4.current.connect(analyser.current);

    analyser.current.connect(audioCtx.current.destination);

    audioBufferSourceNode.current = audioCtx.current.createMediaElementSource(
      audio.current
    );
    audioBufferSourceNode.current.connect(gainNode.current);

    scrollIntoView(userState.selectedTrackId);

    function initKeyboardShortcuts() {
      document.body.addEventListener("keypress", (e) => {
        if (e.target.tagName === "INPUT") return;

        if (e.key === " ")
          setPlaybackState(playbackState === "playing" ? "paused" : "playing");
        if (e.key === "ArrowRight") changeTrack("next");
        if (e.key === "ArrowLeft") changeTrack("prev");
      });
    }
    initKeyboardShortcuts();

    setAudioCtx(audioCtx);
    setAnalyser(analyser);
  }, []);

  const renders = useRef(0);

  // handle track change
  useEffect(() => {
    if (renders.current === 0) {
      renders.current = renders.current + 1;
      return;
    }

    const handleTrackChange = (newTrackId) => {
      console.log(`handleTrackChange(${newTrackId})`);
      initAudioSource();
    };

    handleTrackChange(userState.selectedTrackId);
  }, [userState.selectedTrackId]);

  useEffect(() => {
    if (gainNode.current)
      gainNode.current.gain.value = scaleVolume(userState.volume);
  }, [userState.volume]);

  useEffect(() => {
    if (!audio.current) return;

    audio.current.muted = userState.muted;
    band1.current.frequency.value = userState.eq1Frequency;
    band1.current.gain.value = userState.eq1Gain;
    band2.current.frequency.value = userState.eq2Frequency;
    band2.current.gain.value = userState.eq2Gain;
    band3.current.frequency.value = userState.eq3Frequency;
    band3.current.gain.value = userState.eq3Gain;
    band4.current.frequency.value = userState.eq4Frequency;
    band4.current.gain.value = userState.eq4Gain;
  }, [userState]);

  const changeTrack = (direction) => {
    setSelectedTrackId(getNewTrackId(direction));
  };

  useEffect(() => {
    const handlePlaybackStateChange = async (newPlaybackState) => {
      // pause
      if (newPlaybackState === "paused") {
        audioCtx.current.suspend();
        return;
      }

      // resume
      if (
        newPlaybackState === "playing" &&
        audio.current.currentSrc &&
        audioCtx.current.state === "suspended"
      ) {
        audio.current.play();
        audioCtx.current.resume();
        return;
      }

      // resume if suspended because of Autoplay Policy
      if (
        newPlaybackState === "playing" &&
        audioCtx.current.state === "suspended"
      ) {
        audioCtx.current.resume();
        initAudioSource();
      }
    };

    handlePlaybackStateChange(playbackState);
  }, [playbackState]);

  const initAudioSource = () => {
    setElapsedTime(0);

    const track = getTrackById(userState.selectedTrackId);
    if (!track || track.missingFile) {
      if (!track) console.log("no track found...");
      if (track.missingFile) console.log("track is missing file...");
      changeTrack("next");
      return;
    }

    // set new audio source
    if (audio.current) {
      audio.current.volume = 0;
      audio.current.src = apiUrl + "/media?id=" + track.id;

      if (trackGainNode.current) {
        const gain = getMaxSafeGain(track.trackGainLinear, track.trackPeak);
        trackGainNode.current.gain.value = gain;
      }

      audio.current
        .play()
        .then(() => {
          audio.current.volume = 1;

          // Track changed while paused. Go to new track and pause.
          if (playbackState !== "playing") audioCtx.current.suspend();
        })
        .catch((e) => {
          console.log(e);
        });

      scrollIntoView(track.id);
    }
  };

  return null;
};

export default Player;
