"use client";

import { IoMdPlay } from "react-icons/io";
import { useUser } from "@clerk/nextjs";
import { MdCloudUpload } from "react-icons/md";
import { useState } from "react";
import { audio, playlist } from "@prisma/client";

import { useImageColor } from "@/store/useImageColor";
import { Button } from "@/components/ui/button";
import UploadAudio from "@/components/Dialog/UploadAudio";
import AudioCardFlex from "@/components/AudioCardFlex";
import { usePlayQueue } from "@/store/usePlayQueue";

const AuthorAudio = ({
  userId,
  audio,
  playlists,
}: {
  userId: string;
  audio: audio[] | undefined;
  playlists: playlist[] | undefined;
}) => {
  const { profile } = useImageColor();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { setPlayQueue } = usePlayQueue();

  const HandlePlayAll = () => {
    const AudioIds = audio?.map((audio) => audio.id);
    if (AudioIds) {
      setPlayQueue(AudioIds);
    }
  };

  return (
    <div
      style={{
        background:
          profile && `linear-gradient(to bottom, ${profile}, transparent)`,
      }}
    >
      <div className="pt-6">
        <div className="flex items-center gap-4 ml-6">
          <Button variant={"play"} size={"play"} onClick={HandlePlayAll}>
            <IoMdPlay className="size-7 text-black" />
          </Button>
          {userId === user?.id && (
            <Button
              className="border rounded-full dark:bg-transparent dark:hover:bg-transparent dark:text-slate-300 dark:hover:text-white border-slate-300 hover:border-white"
              onClick={() => setOpen(true)}
            >
              <MdCloudUpload className="mr-2 size-7" />
              Upload
            </Button>
          )}
        </div>
        {/* collection */}
        <div className="bg-gradient-to-t from-neutral-900/30">
          <div className="w-full pr-2 lg:pr-0 lg:w-[65%] lg:ml-6">
            <p className="mt-8 mb-4 ml-4 text-xl font-extrabold lg:ml-0">
              Collection
            </p>
            {/* audios */}
            <ol className="ml-2">
              {audio?.length === 0 && (
                <div className="text-neutral-400">No Songs or Podcasts</div>
              )}
              {audio?.map((a, i) => (
                <AudioCardFlex
                  key={a.id}
                  count={i}
                  audio={a}
                  playlists={playlists}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
      {/* Upload Dialog */}
      <UploadAudio open={open} setOpen={setOpen} />
    </div>
  );
};

export default AuthorAudio;
