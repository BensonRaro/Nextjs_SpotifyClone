import { playlist } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PiMusicNotesPlusLight } from "react-icons/pi";

import { cn } from "@/lib/utils";
import LikedIcon from "@/components/LikedIcon";

const PlaylistCard = ({ playlist }: { playlist: playlist }) => {
  const params = useParams<{ playlistId: string }>();
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className={cn(
        "flex gap-3 hover:bg-neutral-800/65 rounded-md px-2 py-2",
        params.playlistId === playlist.id && "bg-neutral-800/65"
      )}
    >
      {playlist.folderId === "Liked Songs" ? (
        <LikedIcon divClassName="size-14" iconClassName="size-5" />
      ) : (
        <>
          {playlist.imageUrl ? (
            <Image
              src={playlist.imageUrl}
              alt={playlist.name}
              height={100}
              width={100}
              className="size-14 rounded-md"
            />
          ) : (
            <div className="flex justify-center items-center bg-neutral-800 rounded-md size-14">
              <PiMusicNotesPlusLight className="size-7" />
            </div>
          )}
        </>
      )}
      <div className="space-y-1 py-1 hidden md:block">
        <p className="font-semibold">{playlist.name}</p>
        <p className="flex items-center text-neutral-400">
          {playlist.audio.length} song{playlist.audio.length !== 1 && "s"}
        </p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
