"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { audio, playlist } from "@prisma/client";
import { IoAddCircleOutline } from "react-icons/io5";
import { VscPassFilled } from "react-icons/vsc";
import { toast } from "sonner";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { MdLyrics, MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { useUser } from "@clerk/nextjs";
import { FaPause, FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

import { usePlayQueue } from "@/store/usePlayQueue";
import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import Menu from "@/components/Menu";
import LikedIcon from "@/components/LikedIcon";
import { CreatePlaylist } from "@/actions/CreatePlaylist";
import { AddAudio } from "@/actions/AddAudio";
import { DurationConverter } from "@/lib/utils";
import ReorderPlaylist from "@/components/ReorderPlaylist"

const initialData = {
  id: "",
  AudioUrl: "",
  Title: "",
  Thumbnail: "",
  Duration: 0,
  Category: "",
  Author: "",
  userId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
const AudioPlayer = ({
  audio,
  playlist,
}: {
  audio: audio[];
  playlist: playlist[];
}) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const { playQueue, play, setPlay, setAudioPlaying } = usePlayQueue();

  const [currentAudio, setCurrentAudio] = useState<audio>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muteVolume, setMuteVolume] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  //   console.log(playQueue);

  useEffect(() => {
    if (play !== null) {
      const currentAudio = audio.find((item) => item.id === playQueue[play]);
      if (currentAudio) {
        setCurrentAudio(currentAudio);
        setAudioPlaying(playQueue[play]);
      }
    } else {
      const currentAudio = audio.find(
        (item) => item.id === playQueue[currentIndex]
      );
      if (currentAudio) {
        setCurrentAudio(currentAudio);
        setAudioPlaying(playQueue[currentIndex]);
      }
    }
    if (playQueue.length === 0) {
      if (audioRef.current) {
        setCurrentIndex(0); // Reset currentIndex
        setTimeProgress(0); // Reset time progress
        setPlay(null); // Clear the play state
        setAudioPlaying(""); // Reset playingAudioId
        setCurrentAudio(initialData);
        audioRef.current.pause(); // Pause the audio
        audioRef.current.currentTime = 0; // Reset audio playback to start
      }
    }
  }, [play, playQueue, currentIndex]);

  useEffect(() => {
    // play & pause
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else {
      audioRef.current?.pause();
    }

    // volume
    if (audioRef && audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
      audioRef.current.onplaying = () => setIsPlaying(true);
    }
  }, [isPlaying, volume, muteVolume, audioRef]);

  useEffect(() => {
    const UpdateTime = () => {
      if (audioRef && audioRef.current?.currentTime) {
        setTimeProgress(audioRef.current.currentTime);
      }
    };

    const HandleTimeUpdate = () => {
      setTimeProgress(audioRef?.current?.currentTime || 0);
    };

    audioRef.current?.addEventListener("timeupdate", UpdateTime);
    audioRef.current?.addEventListener("timeupdate", HandleTimeUpdate);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", UpdateTime);
      audioRef.current?.removeEventListener("timeupdate", HandleTimeUpdate);
    };
  }, []);

  //   console.log(currentAudio);

  const HandleNext = () => {
    if (currentIndex === playQueue.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    setPlay(null);
  };
  const HandlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const HandlePlay = () => {
    setIsPlaying((prev) => !prev);
  };
  const HandleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
  };

  const LikedPlaylist = playlist?.find(
    (likedPlaylist) =>
      likedPlaylist.folderId === "Liked Songs" &&
      likedPlaylist.userId === user?.id
  );

  const IsLiked = playlist
    ?.filter(
      (likedPlaylist) =>
        likedPlaylist.folderId === "Liked Songs" &&
        likedPlaylist.userId === user?.id
    )
    .some((likedAudio) => likedAudio.audio.includes(currentAudio.id));

  const AddToLikedAudio = () => {
    startTransition(async () => {
      if (!LikedPlaylist) {
        await CreatePlaylist("Liked Songs", "Liked Songs", "", currentAudio.id)
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
        await AddAudio(playlist, LikedPlaylist.id, currentAudio.id)
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

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 px-4 h-[90px] flex justify-between">
      <div className="items-center flex w-full gap-2">
        {playQueue.length > 0 && (
          <>
            <Link href={`/song/${currentAudio.id}`}>
              <Image
                src={currentAudio.Thumbnail}
                width={100}
                height={100}
                alt={currentAudio.Title}
                className="rounded-md object-cover size-16"
              />
            </Link>
            <div className="flex items-center gap-2">
              <span className="flex-col line-clamp-1 hidden md:flex">
                <p>{currentAudio.Title}</p>
                <p className="text-neutral-400">{currentAudio.Author}</p>
              </span>
              {!!user && (
                <Hint
                  label={`${
                    IsLiked ? "Add To Playlist" : "Add To Liked Songs"
                  }`}
                >
                  <Button
                    className="dark:hover:text-white dark:text-neutral-400 disabled:text-neutral-500"
                    size={"icon"}
                    variant={"link"}
                    disabled={isPending}
                  >
                    {IsLiked ? (
                      <Menu
                        AddToLiked={AddToLikedAudio}
                        audio={currentAudio}
                        isLiked={IsLiked}
                        likedPlaylistId={LikedPlaylist?.id}
                        playlist={playlist}
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
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col w-full space-y-1">
        <span className="flex items-center justify-center gap-2 md:gap-4">
          <Button
            size="icon"
            variant="link"
            onClick={HandlePrevious}
            disabled={currentIndex === 0 || playQueue.length === 0}
          >
            <MdSkipPrevious className="size-8" />
          </Button>
          <Button
            className="items-center w-12 h-12 rounded-full"
            onClick={HandlePlay}
            disabled={playQueue.length === 0}
          >
            {isPlaying ? (
              <FaPause className="size-8" />
            ) : (
              <FaPlay className="size-8" />
            )}
          </Button>
          <Button
            size="icon"
            variant="link"
            onClick={HandleNext}
            disabled={playQueue.length === 0}
          >
            <MdSkipNext className="size-8" />
          </Button>
        </span>
        <audio
          //   src={""}
          src={currentAudio.AudioUrl}
          ref={audioRef}
          autoPlay
          onEnded={() => {}}
        />
        <span className="flex items-center justify-center gap-2 text-neutral-400">
          <span>{DurationConverter(timeProgress)}</span>
          <Progress
            value={(timeProgress / (currentAudio?.Duration || 1)) * 100}
            className="w-full h-[4.5px]"
          />
          <span>{DurationConverter(currentAudio?.Duration!)}</span>
        </span>
      </div>
      <div className="w-[50%] md:w-[70%] flex items-center">
        <span className="flex w-full gap-2 place-content-end">
          <ReorderPlaylist
          audio={audio}
          playlist={playlist}
          />
          <Button
            size="icon"
            variant="link"
            disabled={currentAudio === initialData}
          >
            <Link href={`/song/${currentAudio.id}`}>
              <MdLyrics className="size-5" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="link"
            onClick={() => setMuteVolume((prev) => !prev)}
          >
            {muteVolume ? (
              <FaVolumeXmark className="size-5" />
            ) : (
              <FaVolumeHigh className="size-5" />
            )}
          </Button>
          <Slider
            defaultValue={[1]}
            step={0.1}
            aria-label="Volume"
            min={0}
            max={100}
            value={[volume]}
            onValueChange={HandleVolumeChange}
            className="w-[10%] md:w-[30%] cursor-pointer"
          />
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
