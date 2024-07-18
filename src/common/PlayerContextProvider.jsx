import create from "zustand";

const usePlayerStore = create((set) => ({
  elapsedTime: 0,
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),

  duration: 0,
  setDuration: (duration) => set({ duration }),

  playbackState: "stopped",
  setPlaybackState: (playbackState) => set({ playbackState }),

  audioCtx: undefined,
  setAudioCtx: (audioCtx) => set({ audioCtx }),

  analyser: undefined,
  setAnalyser: (analyser) => set({ analyser }),

  forcedElapsedTime: 0,
  setForcedElapsedTime: (forcedElapsedTime) => set({ forcedElapsedTime }),
}));

export { usePlayerStore };
