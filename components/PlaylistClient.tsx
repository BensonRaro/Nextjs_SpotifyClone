"use client";

import { audio, playlist } from "@prisma/client";
import { PiMusicNotesPlusLight } from "react-icons/pi";
import Image from "next/image";
import { IoMdPlay } from "react-icons/io";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MdDelete } from "react-icons/md";

import Header from "@/components/Header";
import ImageBackgroundDetector from "@/components/ImageBackgroundDetector";
import { useImageColor } from "@/store/useImageColor";
import LikedIcon from "@/components/LikedIcon";
import AudioCardFlex from "@/components/AudioCardFlex";
import { Button } from "@/components/ui/button";
import { DeletePlaylist } from "@/actions/DeletePlaylist";
import { usePlayQueue } from "@/store/usePlayQueue";
import { cn } from "@/lib/utils";
import UpdatePlaylist from "@/components/Dialog/UpdatePlaylist";

const PlaylistClient = ({
  playlist,
  playlists,
  audio,
}: {
  playlist: playlist | null;
  playlists: playlist[];
  audio: audio[];
}) => {
  const [open, setOpen] = useState(false);
  const { playlist: playlistTheme } = useImageColor();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setPlayQueue } = usePlayQueue();

  const OpenDialog = () => {
    //   TODO:Fix this
    if (
      playlist?.Visibility === "Private" &&
      user?.id === playlist?.userId &&
      playlist?.folderId !== "Liked Songs"
    ) {
      setOpen(true);
    }
  };

  const HandlePlay = () => {
    setPlayQueue(playlist?.audio!);
  };

  const Delete = () => {
    startTransition(async () => {
      await DeletePlaylist(playlist?.id!)
        .then(() => {
          toast("Playlist deleted");
          router.push("/");
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    });
  };
  return (
    <>
      <div
        className="relative bg-fixed h-[360px]"
        style={
          playlist?.folderId === "Liked Songs"
            ? {
                background: "linear-gradient(to bottom, #7661E9, transparent)",
              }
            : playlist?.imageUrl
            ? {
                background: `linear-gradient(to bottom, ${playlistTheme}, transparent)`,
              }
            : { background: "linear-gradient(to bottom, #555555, transparent)" }
        }
      >
        <ImageBackgroundDetector
          rendering="playlist"
          imageUrl={playlist?.imageUrl}
        />
        <div
          className="absolute z-30 flex gap-4 ml-6 space-y-2 cursor-pointer bottom-16 pt-28"
          onClick={OpenDialog}
        >
          <div className="mt-16">
            {playlist?.folderId ? (
              <LikedIcon
                divClassName="size-48 md:size-52 shadow-xl"
                iconClassName="size-20 md:size-24"
              />
            ) : (
              <>
                {playlist?.imageUrl ? (
                  <Image
                    src={playlist.imageUrl}
                    alt="Playlist Image"
                    height={100}
                    width={100}
                    className="rounded-md shadow-xl size-48 md:size-52"
                  />
                ) : (
                  <div className="flex items-center justify-center rounded-md shadow-xl bg-neutral-800 size-48 md:size-52">
                    <PiMusicNotesPlusLight className="size-20 md:size-24" />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col pt-40">
            <p className="text-xl sm:text-3xl md:text-6xl font-bold md:font-extrabold">
              {playlist?.name}
            </p>
            <p>
              {playlist?.audio.length} song{playlist?.audio.length !== 1 && "s"}
            </p>
          </div>
        </div>
      </div>
      <Header
        className={cn(
          "-mt-[360px]",
          playlist?.folderId === "Liked Songs"
            ? "bg-[#7661E9]"
            : playlist?.imageUrl
            ? `bg-[${playlistTheme}]`
            : "bg-[#555555]"
        )}
      />
      <div className="mt-[290px] ml-4 pt-8">
        {playlist?.audio.length !== 0 && (
          <Button
            variant="play"
            size="play"
            disabled={isPending}
            onClick={HandlePlay}
          >
            <IoMdPlay className="text-black size-7" />
          </Button>
        )}
        {user?.id === playlist?.userId && (
          <Button
            className="ml-4"
            size="icon"
            variant="destructive"
            disabled={isPending}
            onClick={Delete}
          >
            <MdDelete className="size-7" />
          </Button>
        )}
        <p className="mt-8 mb-4 ml-4 text-xl font-extrabold">Playlist</p>
        {playlist?.audio.length === 0 && (
          <h1 className="flex items-center justify-center text-xl font-bold">
            Empty Playlist
          </h1>
        )}
        {playlist?.audio.map((item, i) => {
          const fetchAudio = audio.find(
            (singleAudio) => singleAudio.id === item
          );
          return (
            <div className="w-full pr-2 lg:pr-0 lg:w-[65%] lg:ml-6" key={i}>
              <ol className="ml-2">
                <AudioCardFlex
                  audio={fetchAudio!}
                  count={i}
                  playlists={playlists}
                />
              </ol>
            </div>
          );
        })}
      </div>
      <UpdatePlaylist
        open={open}
        setOpen={setOpen}
        initialPlaylist={playlist}
      />
    </>
  );
};

export default PlaylistClient;
