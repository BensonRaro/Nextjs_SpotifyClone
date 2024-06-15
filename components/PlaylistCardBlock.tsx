"use client";

import { playlist } from "@prisma/client";

import Card from "@/components/Card";
import { usePlayQueue } from "@/store/usePlayQueue";

const PlaylistCardBlock = ({
  playlist,
  userName,
  userId,
}: {
  playlist: playlist;
  userName: string | undefined;
  userId: string | undefined;
}) => {
  const { setPlayQueue } = usePlayQueue();

  const handlePlayAll = () => {
    setPlayQueue(playlist?.audio!);
  };

  return (
    <Card
      key={playlist.id}
      by={userName ? userName : "Unknown"}
      imageUrl={playlist.imageUrl}
      name={playlist.name}
      HandlePlay={handlePlayAll}
      PushTo={`/playlist/${playlist.id}`}
      userId={userId!}
      audio={playlist.audio}
    />
  );
};

export default PlaylistCardBlock;
