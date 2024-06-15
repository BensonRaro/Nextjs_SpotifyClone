"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Visibility } from "@prisma/client";

import { db } from "@/lib/db";

export const EditPlaylist = async (
  id: string,
  name: string,
  imageUrl: string,
  Visibility: Visibility
) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-up");
  }

  const updatedPlaylist = await db.playlist.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      imageUrl: imageUrl,
      Visibility: Visibility,
    },
  });

  revalidatePath("/", "layout");
  return updatedPlaylist;
};
