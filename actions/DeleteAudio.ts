"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const DeleteAudio = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  try {
    const newAudio = await db.audio.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/", "layout");
    return newAudio;
  } catch (error) {
    console.log(error);
  }
};
