import { MdVerified } from "react-icons/md";
import { currentUser } from "@clerk/nextjs/server";

import Header from "@/components/Header";
import { db } from "@/lib/db";
import BannerButtons from "@/components/BannerButtons";
import ImageBackgroundDetector from "@/components/ImageBackgroundDetector";
import AuthorAudio from "@/components/AuthorAudio";

const UserPage = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const ClerkUser = await currentUser();
  const user = await db.user.findUnique({
    where: {
      userId: params.userId,
    },
    include: {
      audio: true,
    },
  });
  const playlists = await db.playlist.findMany();

  return (
    <>
      <div
        className="relative bg-fixed h-[360px]"
        style={
          user?.Banner
            ? { backgroundImage: `url(${user.Banner})` }
            : { background: "linear-gradient(to bottom,#555555, transparent )" }
        }
      >
        <ImageBackgroundDetector imageUrl={user?.Banner} rendering="user" />
        <div className="absolute z-30 ml-6 space-y-2 bottom-16">
          <p className="flex items-center gap-2">
            <MdVerified className="size-8 text-blue-500" />
            <span className="text-sm font-semibold">Verified Artist</span>
          </p>
          <h1 className="text-6xl font-extrabold lg:text-8xl md:text-7xl">
            {user?.name}
          </h1>
        </div>
        {/* edgestoreButtons */}
        {params.userId === ClerkUser?.id && (
          <BannerButtons banner={user?.Banner} />
        )}
      </div>
      <Header className="bg-transparent -mt-[360px]" />
      <div className="mt-[296px]">
        <AuthorAudio
          userId={params.userId}
          audio={user?.audio}
          playlists={playlists}
        />
      </div>
    </>
  );
};

export default UserPage;
