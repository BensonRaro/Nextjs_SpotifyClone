"use client";

import { audio } from "@prisma/client";
import { useState } from "react";

import { usePlayQueue } from "@/store/usePlayQueue";
import CategoryNav from "@/components/CategoryNav";
import Card from "@/components/Card";

const AudioCardBlock = ({ audios }: { audios: audio[] }) => {
  const [category, setCategory] = useState("All");
  const { setPlay, playQueue, setPlayQueue } = usePlayQueue();

  const FilteredAudios = audios.filter((audio) => audio.Category === category);

  const HandlePlay = (id: string) => {
    // console.log(audio.id);
    const isInQueue = playQueue.includes(id);
    if (isInQueue) {
      const index = playQueue.findIndex((id) => id === id);
      setPlay(index);
    } else {
      // console.log(playQueue);
      setPlayQueue([...playQueue, id]);
      // console.log(PlayQueueLength);
      setPlay(playQueue.length);
    }
  };

  return (
    <>
      <CategoryNav category={category} setCategory={setCategory} />
      {audios.length === 0 ? (
        <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
          No Audio Available
        </h1>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4 ml-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
          {category === "All" ? (
            <>
              {audios.map((audio) => (
                <Card
                  key={audio.id}
                  by={audio.Author}
                  imageUrl={audio.Thumbnail}
                  name={audio.Title}
                  HandlePlay={() => HandlePlay(audio.id)}
                  PushTo={`/song/${audio.id}`}
                  userId={audio.userId}
                />
              ))}
            </>
          ) : (
            <>
              {FilteredAudios.length === 0 && (
                <h1 className="mt-4 text-xl font-bold md:text-2xl text-primary justify-center items-center flex">
                  No Audio for {category} Available
                </h1>
              )}
              {FilteredAudios.map((audio) => (
                <Card
                  key={audio.id}
                  by={audio.Author}
                  imageUrl={audio.Thumbnail}
                  name={audio.Title}
                  HandlePlay={() => HandlePlay(audio.id)}
                  PushTo={`/song/${audio.id}`}
                  userId={audio.userId}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AudioCardBlock;
