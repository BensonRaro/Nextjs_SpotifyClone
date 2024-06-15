import { MdSkipNext, MdSkipPrevious, MdLyrics } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";
import { BiSolidPlaylist } from "react-icons/bi";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AudioPlayerSkeleton = () => {
  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[90px] px-4 flex justify-between">
      <div className="flex items-center w-full gap-2">
        <Skeleton className="rounded-md size-16" />
        <div className="flex flex-col gap-y-2">
          <Skeleton className="rounded-md w-20 h-2" />
          <Skeleton className="rounded-md w-10 h-2" />
        </div>
      </div>
      <div className="flex flex-col w-full space-y-1">
        <span className="flex items-center justify-center gap-4">
          <Button size="icon" variant="link" disabled>
            <MdSkipPrevious className="size-8" />
          </Button>
          <Button className="items-center w-12 h-12 rounded-full" disabled>
            <FaPlay className="size-8" />
          </Button>
          <Button size="icon" variant="link" disabled>
            <MdSkipNext className="size-8" />
          </Button>
        </span>
        <span className="flex items-center justify-center gap-2 text-neutral-400">
          <span>0:00</span>
          <Progress value={0} className="w-full h-[4.5px]" />
          <span>0:00</span>
        </span>
        <span className="flex items-center justify-center gap-2 text-neutral-400">
          <Skeleton className="rounded-md w-full" />
        </span>
      </div>
      <div className="w-[70%] flex items-center">
        <span className="flex w-full gap-2 place-content-end">
          <Button size="icon" variant="link">
            <BiSolidPlaylist className="size-5" />
          </Button>
          <Button size="icon" variant="link">
            <MdLyrics className="size-5" />
          </Button>
          <Button size="icon" variant="link">
            <FaVolumeXmark className="size-5" />
          </Button>
          <Slider
            defaultValue={[1]}
            step={0.1}
            aria-label="Volume"
            min={0}
            max={100}
            disabled
            className="w-[30%] cursor-pointer"
          />
        </span>
      </div>
    </div>
  );
};

export default AudioPlayerSkeleton;
