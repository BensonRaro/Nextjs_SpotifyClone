import AudioCardBlock from "@/components/AudioCardBlock";
import Header from "@/components/Header";
import PlaylistCardBlock from "@/components/PlaylistCardBlock";
import { db } from "@/lib/db";

export default async function Home() {
  const audios = await db.audio.findMany();
  const playlists = await db.playlist.findMany({
    where: {
      Visibility: "Public",
    },
  });

  return (
    <>
      <Header className="bg-neutral-900" />
      <div className="ml-2 space-y-4">
        {/* playlist */}
        <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary">
          Playlists For You
        </h1>
        {playlists.length === 0 ? (
          <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
            No Playlist Available
          </h1>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4 ml-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
            {playlists.map(async (playlist) => {
              const user = await db.user.findUnique({
                where: {
                  userId: playlist.userId,
                },
              });
              return (
                <PlaylistCardBlock
                  playlist={playlist}
                  key={playlist.id}
                  userId={playlist.userId}
                  userName={user?.name}
                />
              );
            })}
          </div>
        )}
        <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary">
          Trending Songs and PodCast For You
        </h1>
        {audios.length === 0 ? (
          <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
            No Song or Podcast Available
          </h1>
        ) : (
          <AudioCardBlock audios={audios} />
        )}
      </div>
    </>
  );
}
