import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface usePlayQueueProps {
  audioPlaying: string;
  play: number | null;
  playQueue: string[];
  setPlay: (play: number | null) => void;
  setPlayQueue: (playQueue: string[]) => void;
  setAudioPlaying: (audioPlaying: string) => void;
}

export const usePlayQueue = create(
  persist<usePlayQueueProps>(
    (set) => ({
      audioPlaying: "",
      play: null,
      playQueue: [],
      setPlay: (play) => set(() => ({ play: play })),
      setPlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
      setAudioPlaying: (audioPlaying) =>
        set(() => ({ audioPlaying: audioPlaying })),
    }),
    {
      name: "usePlayQueue-Store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
