"use client";

import { audio } from "@prisma/client";
import Image from "next/image";
import { IoMdPlay } from "react-icons/io";

import { useImageColor } from "@/store/useImageColor";
import { usePlayQueue } from "@/store/usePlayQueue";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const AudioClient = ({
  Lyrics,
  audio,
}: {
  Lyrics: string;
  audio: audio | null;
}) => {
  const { audio: audioTheme } = useImageColor();
  const { setPlay, playQueue, setPlayQueue } = usePlayQueue();

  const PlaySong = () => {
    if (audio) {
      const IsInQueue = playQueue.includes(audio.id);

      if (IsInQueue) {
        const Index = playQueue.findIndex((item) => item === audio.id);
        setPlay(Index);
      } else {
        setPlayQueue([...playQueue, audio.id]);
        setPlay(playQueue.length);
      }
    }
  };

  return (
    <>
      {audio && (
        <>
          <div
            className="relative bg-fixed h-[360px]"
            style={{
              background: `linear-gradient(to bottom, ${audioTheme}, transparent)`,
            }}
          >
            <div className="relative h-[360px]">
              <div className="ml-6 space-y-6 absolute z-30 bottom-16 flex gap-4 cursor-pointer">
                <Image
                  src={audio?.Thumbnail}
                  alt="Audio Thumbnail"
                  height={100}
                  width={100}
                  className="size-52 rounded-md shadow-xl"
                />
                <div className="flex flex-col pt-28">
                  <p className="font-bold md:font-extrabold text-xl sm:text-3xl md:text-6xl">
                    {audio.Title}
                  </p>
                  <p>{audio.Author}</p>
                </div>
              </div>
            </div>
          </div>
          <Header className="-mt-[360px]" />
          <div className="mt-[290px] ml-4 pt-8">
            <Button variant={"play"} size={"play"} onClick={PlaySong}>
              <IoMdPlay className="text-black w-7 h-7" />
            </Button>
            <p className="mt-8 mb-4 text-xl font-extrabold ml-4">Lyrics</p>
            <p className="w-full lg:w-[65%] lg:ml-6 pb-4">
              {!Lyrics ||
                (audio.Category === "Podcast" && (
                  <h1 className="flex justify-center items-center text-xl font-extrabold">
                    No Lyrics
                  </h1>
                ))}
              {Lyrics.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default AudioClient;
