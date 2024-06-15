import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ImageColor {
  profile: string;
  playlist: string;
  audio: string;
  setProfile: (playlist: string) => void;
  setAudio: (audio: string) => void;
  setPlaylist: (mobileSidebar: string) => void;
}

export const useImageColor = create(
  persist<ImageColor>(
    (set) => ({
      profile: "",
      playlist: "",
      audio: "",
      setProfile: (profile: string) => set(() => ({ profile: profile })),
      setAudio: (audio: string) => set(() => ({ audio: audio })),
      setPlaylist: (playlist: string) => set(() => ({ playlist: playlist })),
    }),
    {
      name: "imageColor",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
