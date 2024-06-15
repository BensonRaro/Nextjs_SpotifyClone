"use client";

import Image from "next/image";
import { IoMdPlay } from "react-icons/io";
import Link from "next/link";
import { PiMusicNotesPlusLight } from "react-icons/pi";

import { Button } from "@/components/ui/button";

const Card = ({
  imageUrl,
  name,
  by,
  HandlePlay,
  PushTo,
  userId,
  audio,
}: {
  imageUrl: string;
  name: string;
  by: string;
  HandlePlay: () => void;
  PushTo: string;
  userId: string;
  audio?: string[];
}) => {
  //   console.log(imageUrl);
  return (
    <div className="relative flex flex-col items-center justify-center p-3 overflow-hidden transition-all rounded-md cursor-pointer group gap-x-4 bg-neutral-400/5 hover:bg-neutral-400/10">
      <Link
        href={PushTo}
        className="relative size-full overflow-hidden rounded-md aspect-square"
      >
        {imageUrl ? (
          <Image src={imageUrl} fill alt="Image" className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-cover rounded-md bg-neutral-800">
            <PiMusicNotesPlusLight className="size-16" />
          </div>
        )}
      </Link>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate">{name}</p>
        <Link
          href={`/user/${userId}`}
          className="pb-4 text-sm truncate text-neutral-400 hover:underline"
        >
          By {by}
        </Link>
      </div>
      {audio?.length !== 0 && (
        <div className="absolute hidden bottom-24 right-5 group-hover:block">
          <Button variant={"play"} size={"play"} onClick={HandlePlay}>
            <IoMdPlay className="text-black w-7 h-7" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;
