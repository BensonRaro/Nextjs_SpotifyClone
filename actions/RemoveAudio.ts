"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { playlist } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export const RemoveAudio = async (
  playlist: playlist[] | undefined,
  playlistId: string | undefined,
  audioId: string
) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  const AudioList = playlist
    ?.filter((list) => list.id === playlistId)
    .flatMap((a) =>
      a.audio.filter((playlistAudio) => playlistAudio !== audioId)
    );

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
