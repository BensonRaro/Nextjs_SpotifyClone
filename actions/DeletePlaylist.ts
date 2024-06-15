"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const DeletePlaylist = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  try {
    const newPlaylist = await db.playlist.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
    return newPlaylist;
  } catch (error) {
    console.log(error);
  }
};
