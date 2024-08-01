import { API_URL } from "@/apiUrl";
import { getTrackById } from "@/common/AppContextProvider";
import {
  type PlaybackState,
  usePlayerStore,
} from "@/common/PlayerContextProvider";
import { setSelectedTrackId, useUserStore } from "@/common/UserContextProvider";
import { useEffect, useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { getMaxSafeGain, scaleVolume, scrollIntoView } from "./playerUtils";
import renderSpectrumFrame from "./spectrum";
import { getNewTrackId } from "./trackDeterminationUtils";

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

  const audio = useRef<HTMLAudioElement | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const fadeGainNode = useRef<GainNode | null>(null); // fade out/in for pause/resume
  const trackGainNode = useRef<GainNode | null>(null); // apply replaygain
  const userGainNode = useRef<GainNode | null>(null); // apply user-controlled gain
  const band1 = useRef<BiquadFilterNode | null>(null);
  const band2 = useRef<BiquadFilterNode | null>(null);
  const band3 = useRef<BiquadFilterNode | null>(null);
  const band4 = useRef<BiquadFilterNode | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const audioBufferSourceNode = useRef<MediaElementAudioSourceNode | null>(
    null,
  );

  useEffect(() => {
    if (audio.current) {
      audio.current.currentTime = forcedElapsedTime;
    }
  }, [forcedElapsedTime]);

  useEffect(() => {
    function initAudio() {
      const audio = new Audio();
      audio.crossOrigin = "use-credentials";
      audio.controls = false;
      audio.autoplay = false;
      audio.onended = () => changeTrack("next");
      audio.ondurationchange = () => setDuration(audio.duration);
      audio.onerror = () => console.log(audio.error);
      audio.onplaying = () => renderSpectrumFrame();
      audio.onpause = (e) => console.log(e);
      audio.ontimeupdate = () => setElapsedTime(audio.currentTime);
      document.body.appendChild(audio);
      return audio;
    }
    audio.current = initAudio();

    audioCtx.current = new window.AudioContext();
    audioBufferSourceNode.current = audioCtx.current.createMediaElementSource(
      audio.current,
    );
    fadeGainNode.current = audioCtx.current.createGain();
    fadeGainNode.current.gain.setValueAtTime(0, audioCtx.current.currentTime);
    trackGainNode.current = audioCtx.current.createGain();
    userGainNode.current = audioCtx.current.createGain();
    userGainNode.current.gain.value = scaleVolume(userState.volume);
    band1.current = audioCtx.current.createBiquadFilter();
    band1.current.type = "lowshelf";
    band1.current.frequency.value = userState.eq1Frequency;
    band1.current.gain.value = userState.eq1Gain;
    band2.current = audioCtx.current.createBiquadFilter();
    band2.current.type = "peaking";
    band2.current.frequency.value = userState.eq2Frequency;
    band2.current.gain.value = userState.eq2Gain;
    band3.current = audioCtx.current.createBiquadFilter();
    band3.current.type = "peaking";
    band3.current.frequency.value = userState.eq3Frequency;
    band3.current.gain.value = userState.eq3Gain;
    band4.current = audioCtx.current.createBiquadFilter();
    band4.current.type = "highshelf";
    band4.current.frequency.value = userState.eq4Frequency;
    band4.current.gain.value = userState.eq4Gain;
    analyser.current = audioCtx.current.createAnalyser();
    analyser.current.fftSize = 4096;

    audioBufferSourceNode.current.connect(fadeGainNode.current);
    fadeGainNode.current.connect(userGainNode.current);
    userGainNode.current.connect(trackGainNode.current);
    trackGainNode.current.connect(band1.current);
    band1.current.connect(band2.current);
    band2.current.connect(band3.current);
    band3.current.connect(band4.current);
    band4.current.connect(analyser.current);
    analyser.current.connect(audioCtx.current.destination);

    scrollIntoView(userState.selectedTrackId);

    setAudioCtx(audioCtx);
    setAnalyser(analyser);
  }, []);

  useEventListener(
    "keydown",
    (e) => {
      if (e.target.tagName === "INPUT") return;

      if (e.key === " ")
        setPlaybackState(playbackState === "playing" ? "paused" : "playing");
      if (e.key === "ArrowRight") changeTrack("next");
      if (e.key === "ArrowLeft") changeTrack("prev");
    },
    document,
  );

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
    if (userGainNode.current)
      userGainNode.current.gain.value = scaleVolume(userState.volume);
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
    const handlePlaybackStateChange = async (
      newPlaybackState: PlaybackState,
    ) => {
      // pause
      if (newPlaybackState === "paused") {
        fade(audioCtx.current, fadeGainNode.current, "out", () =>
          audioCtx.current?.suspend(),
        );
        return;
      }

      // resume
      if (
        newPlaybackState === "playing" &&
        audio.current.currentSrc &&
        audioCtx.current.state === "suspended"
      ) {
        fade(audioCtx.current, fadeGainNode.current, "in", () => {
          audio.current.play();
          audioCtx.current.resume();
        });
        return;
      }
    };

    handlePlaybackStateChange(playbackState);
  }, [playbackState]);

  const initAudioSource = async () => {
    setElapsedTime(0);

    const track = getTrackById(userState.selectedTrackId);
    if (!track || track.missingFile) {
      if (!track) console.log("no track found...");
      else if (track.missingFile) console.log("track is missing file...");
      changeTrack("next");
      return;
    }

    // set new audio source
    if (audio.current) {
      audio.current.src = `${API_URL}/media?id=${track.id}`;

      if (trackGainNode.current) {
        const gain = getMaxSafeGain(track.trackGainLinear, track.trackPeak);
        trackGainNode.current.gain.value = gain;
      }

      if (playbackState === "playing") {
        fade(audioCtx.current, fadeGainNode.current, "in", () =>
          audio.current.play(),
        );
      }

      if (playbackState !== "playing") {
        fade(audioCtx.current, fadeGainNode.current, "out", () =>
          audioCtx.current?.suspend(),
        );
      }

      scrollIntoView(track.id);
    }
  };

  return null;
};

function fade(
  audioCtx: AudioContext,
  gainNode: GainNode,
  mode: "in" | "out",
  callback: () => void,
) {
  const { currentTime } = audioCtx;
  const duration = 50;
  const nearZero = 0.0001;

  const from = mode === "in" ? nearZero : gainNode.gain.value;
  gainNode.gain.setValueAtTime(from, currentTime);

  const to = mode === "in" ? 1 : nearZero;
  gainNode.gain.exponentialRampToValueAtTime(to, currentTime + duration / 1000);

  setTimeout(callback, duration);
}

export default Player;
