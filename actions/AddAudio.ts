"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { playlist } from "@prisma/client";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const AddAudio = async (
  playlists: playlist[] | undefined,
  playlistId: string,
  audio: string | undefined
) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  const AudioList = playlists
    ?.filter((playlist) => playlist.id === playlistId)
    .flatMap((a) => a.audio)
    .concat(audio || []);

  try {
    const newPlaylist = await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        audio: AudioList,
      },
    });
    revalidatePath("/", "layout");
    return newPlaylist;
  } catch (error) {
    console.log(error);
  }
};
