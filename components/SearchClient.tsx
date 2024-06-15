"use client";

import { audio, playlist, user } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import AudioCardBlock from "@/components/AudioCardBlock";
import PlaylistCardBlock from "@/components/PlaylistCardBlock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchClient = ({
  playlists,
  audios,
  users,
  query,
}: {
  audios: audio[];
  playlists: playlist[];
  users: user[];
  query: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q");
  const [value, setValue] = useState<string>(searchValue ? searchValue : "");

  const HandleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value) {
      router.push(`/search?q=${value}`);
    }
  };

  let FilteredPlaylists, FilteredAudios;

  if (!query) {
    FilteredPlaylists = playlists;
    FilteredAudios = audios;
  } else {
    FilteredPlaylists = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(query.toLowerCase())
    );
    FilteredAudios = audios.filter(
      (audio) =>
        audio.Title.toLowerCase().includes(query.toLowerCase()) ||
        audio.Author.toLowerCase().includes(query.toLowerCase())
    );
  }
  return (
    <div className="mt-4">
      <form onSubmit={HandleSearch} className="flex items-center w-1/2 gap-2">
        <Input
          placeholder="Search here"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-1/2 h-12 border-none dark:bg-lightDark"
        />
        <Button
          type="submit"
          className="h-12 text-lg font-semibold"
          disabled={!value}
        >
          Search
        </Button>
      </form>
      {/* playlist */}
      <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary">
        Playlists For You
      </h1>
      {FilteredPlaylists.length === 0 ? (
        <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
          No Playlist Available
        </h1>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4 ml-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
          {FilteredPlaylists.map((playlist) => {
            const user = users.find((user) => user.userId === playlist.userId);
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
      {FilteredAudios.length === 0 ? (
        <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
          No Song or Podcast Available
        </h1>
      ) : (
        <AudioCardBlock audios={FilteredAudios} />
      )}
    </div>
  );
};

export default SearchClient;
