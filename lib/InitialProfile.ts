import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const InitialProfile = async () => {
  const user = await currentUser();

  if (user) {
    const profile = await db.user.findUnique({
      where: { userId: user.id },
    });
    if (!profile) {
      const newProfile = await db.user.create({
        data: {
          userId: user.id,
          name: `${user.fullName}`,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
          Banner: "",
        },
      });
      return newProfile;
    } else {
      if (
        profile.email !== user.emailAddresses[0].emailAddress ||
        profile.imageUrl !== user.imageUrl ||
        profile.name !== `${user.fullName}`
      ) {
        const updatedProfile = await db.user.update({
          where: { userId: user.id },
          data: {
            name: `${user.fullName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
          },
        });

        return updatedProfile;
      }
    }
  }
};
