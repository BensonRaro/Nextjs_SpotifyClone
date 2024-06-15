import Header from "@/components/Header";
import SearchClient from "@/components/SearchClient";
import { db } from "@/lib/db";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const audios = await db.audio.findMany();
  const users = await db.user.findMany();
  const playlists = await db.playlist.findMany({
    where: {
      Visibility: "Public",
    },
  });
  // console.log(searchParams.q);
  return (
    <>
      <Header className="bg-neutral-900" />
      <div className="ml-2 space-y-4">
        <SearchClient
          audios={audios}
          playlists={playlists}
          query={searchParams.q}
          users={users}
        />
      </div>
    </>
  );
};

export default SearchPage;
