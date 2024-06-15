"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export const EditBanner = async (Banner: string) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-up");
  }

  const updatedUser = await db.user.update({
    where: {
      userId: user?.id,
    },
    data: {
      Banner: Banner,
    },
  });

  revalidatePath("/", "layout");
  return updatedUser;
};
