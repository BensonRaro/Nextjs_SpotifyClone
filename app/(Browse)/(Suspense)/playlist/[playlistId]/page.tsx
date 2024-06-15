import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import PlaylistClient from "@/components/PlaylistClient";

const PlaylistPage = async ({ params }: { params: { playlistId: string } }) => {
  // console.log(params.playlistId);
  const user = await currentUser();
  const playlist = await db.playlist.findUnique({
    where: {
      id: params.playlistId,
    },
  });
  const playlists = await db.playlist.findMany();
  const audio = await db.audio.findMany();

  if (playlist?.Visibility === "Private" && user?.id !== playlist?.userId) {
    return redirect("/");
  }

  return (
    <PlaylistClient playlist={playlist} playlists={playlists} audio={audio} />
  );
};

export default PlaylistPage;
