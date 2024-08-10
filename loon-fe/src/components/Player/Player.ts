import { API_URL } from "@/apiUrl";
import { getTrackById } from "@/common/AppContextProvider";
import {
  type PlaybackState,
  usePlayerStore,
} from "@/common/PlayerContextProvider";
import {
  type PlaybackDirection,
  setSelectedTrackId,
  useUserStore,
} from "@/common/UserContextProvider";
import { useEffect, useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { getMaxSafeGain, scaleVolume, scrollIntoView } from "./playerUtils";
import renderSpectrumFrame from "./spectrum";
import { getNewTrackId } from "./trackDeterminationUtils";

const Player = () => {
  const userState = useUserStore((state) => state);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(
    null,
  );
  const fadeGainNodeRef = useRef<GainNode | null>(null); // fade out/in for pause/resume
  const trackGainNodeRef = useRef<GainNode | null>(null); // apply replaygain
  const userGainNodeRef = useRef<GainNode | null>(null); // apply user-controlled gain
  const bandsRef = useRef<BiquadFilterNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = forcedElapsedTime;
    }
  }, [forcedElapsedTime]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    function initAudio() {
      const audio = new Audio();
      audio.crossOrigin = "";
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

    // create objects
    const audio = initAudio();
    const audioCtx = new AudioContext();
    const audioBufferSourceNode = new MediaElementAudioSourceNode(audioCtx, {
      mediaElement: audio,
    });

    const fadeGainNode = new GainNode(audioCtx);
    const trackGainNode = new GainNode(audioCtx);
    const userGainNode = new GainNode(audioCtx, {
      gain: scaleVolume(userState.volume),
    });

    const eqBands = userState.eqBands.map(
      (band) =>
        new BiquadFilterNode(audioCtx, {
          type: band.type,
          frequency: band.frequency,
          gain: band.gain,
        }),
    );

    const analyser = new AnalyserNode(audioCtx, { fftSize: 4096 });

    // connect nodes
    audioBufferSourceNode.connect(fadeGainNode);
    fadeGainNode.connect(userGainNode);
    userGainNode.connect(trackGainNode);
    trackGainNode.connect(eqBands[0]);

    eqBands.slice(0, eqBands.length - 1).forEach((_, i) => {
      eqBands[i].connect(eqBands[i + 1]);
    });
    eqBands[eqBands.length - 1].connect(analyser);

    analyser.connect(audioCtx.destination);

    // setup refs
    audioRef.current = audio;
    audioCtxRef.current = audioCtx;
    audioBufferSourceNodeRef.current = audioBufferSourceNode;
    fadeGainNodeRef.current = fadeGainNode;
    trackGainNodeRef.current = trackGainNode;
    userGainNodeRef.current = userGainNode;
    bandsRef.current = eqBands;
    analyserRef.current = analyser;

    scrollIntoView(userState.selectedTrackId);

    setAudioCtx(audioCtxRef);
    setAnalyser(analyserRef);
  }, []);

  const documentRef = useRef<Document>(document);

  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement | null;
      if (target?.tagName === "INPUT") return;

      if (e.key === " ")
        setPlaybackState(playbackState === "playing" ? "paused" : "playing");
      if (e.key === "ArrowRight") changeTrack("next");
      if (e.key === "ArrowLeft") changeTrack("prev");
    },
    documentRef,
  );

  const renders = useRef(0);

  // handle track change
  useEffect(() => {
    if (renders.current === 0) {
      renders.current = renders.current + 1;
      return;
    }

    const handleTrackChange = (newTrackId: string) => {
      console.log(`handleTrackChange(${newTrackId})`);
      initAudioSource();
    };

    handleTrackChange(userState.selectedTrackId);
  }, [userState.selectedTrackId]);

  useEffect(() => {
    if (userGainNodeRef.current)
      userGainNodeRef.current.gain.value = scaleVolume(userState.volume);
  }, [userState.volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = userState.muted;
  }, [userState.muted]);

  useEffect(() => {
    userState.eqBands.forEach((band, i) => {
      bandsRef.current[i].type = band.type;
      bandsRef.current[i].frequency.value = band.frequency;
      bandsRef.current[i].gain.value = band.gain;
    });
  }, [userState.eqBands]);

  const changeTrack = (direction: PlaybackDirection) => {
    setSelectedTrackId(getNewTrackId(direction));
  };

  useEffect(() => {
    const handlePlaybackStateChange = (playbackState: PlaybackState) => {
      const audioCtx = audioCtxRef.current;
      const audio = audioRef.current;
      const fadeGainNode = fadeGainNodeRef.current;

      if (playbackState === "paused") {
        fade(audioCtx, fadeGainNode, "out", () => audioCtx?.suspend());
        return;
      }

      if (
        playbackState === "playing" &&
        audio?.currentSrc &&
        audioCtx?.state === "suspended"
      ) {
        fade(audioCtx, fadeGainNode, "in", () => {
          audio?.play();
          audioCtx?.resume();
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
    if (audioRef.current) {
      audioRef.current.src = `${API_URL}/media?id=${track.id}`;

      if (trackGainNodeRef.current) {
        const gain = getMaxSafeGain(
          Number(track.trackGainLinear),
          Number(track.trackPeak),
        );
        trackGainNodeRef.current.gain.value = gain;
      }

      if (playbackState === "playing") {
        fade(audioCtxRef.current, fadeGainNodeRef.current, "in", () =>
          audioRef.current?.play(),
        );
      }

      if (playbackState !== "playing") {
        fade(audioCtxRef.current, fadeGainNodeRef.current, "out", () =>
          audioCtxRef.current?.suspend(),
        );
      }

      scrollIntoView(track.id);
    }
  };

  return null;
};

function fade(
  audioCtx: AudioContext | null,
  gainNode: GainNode | null,
  mode: "in" | "out",
  callback: () => void,
) {
  if (!audioCtx || !gainNode) {
    return;
  }

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
