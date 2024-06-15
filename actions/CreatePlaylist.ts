"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const CreatePlaylist = async (
  name: string,
  forderId: string,
  imageUrl: string,
  audio?: string
) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  try {
    const newPlaylist = await db.playlist.create({
      data: {
        userId: user?.id,
        folderId: forderId,
        name: name,
        audio: audio ? [audio] : [],
        imageUrl: imageUrl,
      },
    });
    revalidatePath("/", "layout");
    return newPlaylist;
  } catch (error) {
    console.log(error);
  }
};
