"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export const UpdateCreateAudio = async (
  Audio: {
    duration: number;
    Title: string;
    Author: string;
    Category: string;
    Thumbnail: string;
    AudioUrl: string;
  },
  update: boolean,
  audioId?: string | undefined
) => {
  const user = await currentUser();
  console.log(audioId);

  if (!user) {
    return redirect("/sign-up");
  }

  try {
    if (update) {
      const newPlaylist = await db.audio.update({
        where: {
          id: audioId,
        },
        data: {
          Author: Audio.Author,
          Category: Audio.Category,
          Thumbnail: Audio.Thumbnail,
          Title: Audio.Title,
        },
      });
      revalidatePath("/", "layout");
      return newPlaylist;
    } else {
      const newPlaylist = await db.audio.create({
        data: {
          userId: user?.id,
          AudioUrl: Audio.AudioUrl,
          Author: Audio.Author,
          Category: Audio.Category,
          Duration: Audio.duration,
          Thumbnail: Audio.Thumbnail,
          Title: Audio.Title,
        },
      });
      revalidatePath("/", "layout");
      return newPlaylist;
    }
  } catch (error) {
    console.log(error);
  }
};
