import { DurationConverter, cn } from "@/lib/utils";
import { audio, playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { BiDotsHorizontal } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { useUser } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { VscPassFilled } from "react-icons/vsc";

import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import LikedIcon from "@/components/LikedIcon";
import { CreatePlaylist } from "@/actions/CreatePlaylist";
import { AddAudio } from "@/actions/AddAudio";
import Menu from "@/components/Menu";
import UploadAudio from "@/components/Dialog/UploadAudio";
import { usePlayQueue } from "@/store/usePlayQueue";

const AudioCardFlex = ({
  count,
  audio,
  playlists,
}: {
  count: number;
  audio: audio;
  playlists: playlist[] | undefined;
}) => {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { playQueue, setPlayQueue, setPlay, audioPlaying } = usePlayQueue();

  const LikedPlaylist = playlists?.find(
    (likedPlaylist) =>
      likedPlaylist.folderId === "Liked Songs" &&
      likedPlaylist.userId === user?.id
  );

  const IsLiked = playlists
    ?.filter(
      (likedPlaylist) =>
        likedPlaylist.folderId === "Liked Songs" &&
        likedPlaylist.userId === user?.id
    )
    .some((likedAudio) => likedAudio.audio.includes(audio.id));

  const AddToLikedAudio = () => {
    startTransition(async () => {
      if (!LikedPlaylist) {
        await CreatePlaylist("Liked Songs", "Liked Songs", "", audio.id)
          .then(() => {
            toast(
              <div className="flex items-center gap-4">
                <LikedIcon iconClassName="size-4" divClassName="size-10" />
                Added to Liked Songs
              </div>
            );
          })
          .catch((error) => {
            toast.error("Something Went Wrong");
            console.log(error);
          });
      } else {
        await AddAudio(playlists, LikedPlaylist.id, audio.id)
          .then(() => {
            toast(
              <div className="flex items-center gap-4">
                <LikedIcon iconClassName="size-4" divClassName="size-10" />
                Added to Liked Songs
              </div>
            );
          })
          .catch((error) => {
            toast.error("Something Went Wrong");
            console.log(error);
          });
      }
    });
  };

  // handlePlay
  const HandlePlay = () => {
    const IsInQueue = playQueue.includes(audio.id);

    if (IsInQueue) {
      const Index = playQueue.findIndex((item) => item === audio.id);
      setPlay(Index);
    } else {
      setPlayQueue([...playQueue, audio.id]);
      setPlay(playQueue.length);
    }
  };

  return (
    <li className="text-lg hover:bg-[#424141] rounded-lg p-2 cursor-pointer group w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 flex flex-col justify-center items-center">
            {audioPlaying === audio.id ? (
              <Image
                src={"/audioWave.gif"}
                height={30}
                width={30}
                unoptimized
                alt="audiowave"
              />
            ) : (
              <>
                <span className="group-hover:hidden">{count + 1}</span>
                <Hint label={`Play ${audio.Title} by ${audio.Author}`}>
                  <span
                    className="hidden group-hover:block"
                    onClick={HandlePlay}
                  >
                    <FaPlay className="size-4" />
                  </span>
                </Hint>
              </>
            )}
          </div>
          <Link href={`/song/${audio.id}`} className="relative size-14">
            <Image
              src={audio.Thumbnail}
              fill
              alt={audio.Title}
              className="object-center rounded-md size-14"
            />
          </Link>
          <p className="flex flex-col line-clamp-1">
            <Link
              href={`/song/${audio.id}`}
              className={cn(
                "hover:underline",
                audioPlaying === audio.id && "text-primary"
              )}
            >
              {audio.Title}
            </Link>
            <Link
              href={`/user/${audio.userId}`}
              className="text-neutral-400 line-clamp-1 hover:underline"
            >
              {audio.Author}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!!user && (
            <Hint
              label={`${IsLiked ? "Add To Playlist" : "Add To Liked Songs"}`}
            >
              <Button
                className="opacity-0 group-hover:opacity-100 dark:hover:text-white dark:text-neutral-400 disabled:text-neutral-500"
                size={"icon"}
                variant={"link"}
                disabled={isPending}
              >
                {IsLiked ? (
                  <Menu
                    AddToLiked={AddToLikedAudio}
                    audio={audio}
                    isLiked={IsLiked}
                    likedPlaylistId={LikedPlaylist?.id}
                    playlist={playlists}
                    setOpen={setOpen}
                  >
                    <VscPassFilled className="size-5 text-primary" />
                  </Menu>
                ) : (
                  <IoAddCircleOutline
                    className="size-5"
                    onClick={AddToLikedAudio}
                  />
                )}
              </Button>
            </Hint>
          )}
          <p className={cn("", audioPlaying === audio.id && "text-primary")}>
            {DurationConverter(audio.Duration)}
          </p>
          {!!user && (
            <Menu
              AddToLiked={AddToLikedAudio}
              audio={audio}
              isLiked={IsLiked}
              likedPlaylistId={LikedPlaylist?.id}
              playlist={playlists}
              setOpen={setOpen}
            >
              <Hint
                label={`More Options for ${audio.Title} by ${audio.Author}`}
              >
                <BiDotsHorizontal className="size-5 opacity-0 group-hover:opacity-100 hover:text-white text-neutral-400" />
              </Hint>
            </Menu>
          )}
        </div>
      </div>
      <UploadAudio setOpen={setOpen} open={open} initialAudio={audio} />
    </li>
  );
};

export default AudioCardFlex;
