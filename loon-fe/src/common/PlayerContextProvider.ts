import create from "zustand";

export type PlaybackState = "stopped" | "playing" | "paused";

interface PlayerStore {
  elapsedTime: number;
  forcedElapsedTime: number;
  duration: number;
  playbackState: PlaybackState;
  audioCtx?: React.RefObject<AudioContext>;
  analyser?: React.RefObject<AnalyserNode>;

  setElapsedTime: (elapsedTime: number) => void;
  setForcedElapsedTime: (forcedElapsedTime: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackState: (playbackState: PlaybackState) => void;
  setAudioCtx: (audioCtx: React.RefObject<AudioContext>) => void;
  setAnalyser: (analyser: React.RefObject<AnalyserNode>) => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
  elapsedTime: 0,
  forcedElapsedTime: 0,
  duration: 0,
  playbackState: "stopped",
  audioCtx: undefined,
  analyser: undefined,

  setElapsedTime: (elapsedTime: number) => set({ elapsedTime }),
  setForcedElapsedTime: (forcedElapsedTime: number) =>
    set({ forcedElapsedTime }),
  setDuration: (duration: number) => set({ duration }),
  setPlaybackState: (playbackState: PlaybackState) => set({ playbackState }),
  setAudioCtx: (audioCtx: React.RefObject<AudioContext>) => set({ audioCtx }),
  setAnalyser: (analyser: React.RefObject<AnalyserNode>) => set({ analyser }),
}));

export { usePlayerStore };
