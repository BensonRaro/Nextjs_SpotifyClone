import { BiSolidPlaylist } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { audio, playlist } from "@prisma/client";
import { Reorder } from "framer-motion";
import { LiaTimesSolid } from "react-icons/lia";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { usePlayQueue } from "@/store/usePlayQueue";
import Hint from "@/components/Hint";
import AudioCardFlex from "@/components/AudioCardFlex";

const ReorderPlaylist = ({
  audio,
  playlist,
}: {
  audio: audio[];
  playlist: playlist[];
}) => {
  const { playQueue, setPlayQueue, audioPlaying, setPlay } = usePlayQueue();

  const HandleReorder = (newPlayQueue: string[]) => {
    const CurrentAudioIndex = newPlayQueue.findIndex(
      (item) => item === audioPlaying
    );
    setPlayQueue(newPlayQueue);
    setPlay(CurrentAudioIndex);
  };

  const RemoveFromQueue = (id: string, Title: string | undefined) => {
    setPlayQueue(playQueue.filter((item) => item !== id));
    const CurrentAudioIndex = playQueue.findIndex(
      (item) => item === audioPlaying
    );

    if (CurrentAudioIndex < 0 || CurrentAudioIndex >= 0) {
      setPlay(0);
    }

    toast(`Removed ${Title} from queue`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="icon" variant="link">
          <BiSolidPlaylist className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full mr-10">
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-primary">Play Queue</p>
          <Button
            variant="destructive"
            size="icon"
            disabled={playQueue.length === 0}
            onClick={() => setPlayQueue([])}
          >
            <MdDelete className="size-5" />
          </Button>
        </div>
        {playQueue.length === 0 ? (
          <h1 className="flex items-center justify-center text-xl font-bold pt-2">
            Play Queue is Empty
          </h1>
        ) : (
          <>
            <h1 className="text-lg font-semibold pt-2">
              Drag and drop audio to reorder queue
            </h1>
            <Reorder.Group
              axis="y"
              values={playQueue}
              onReorder={HandleReorder}
            >
              {playQueue.map((id, i) => {
                const FetchedAudio = audio.find((item) => item.id === id);
                return (
                  <Reorder.Item key={id} value={id} className="flex gap-2">
                    <Hint label={`${FetchedAudio?.Title} Removed From Queue`}>
                      <LiaTimesSolid
                        className="size-5 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => RemoveFromQueue(id, FetchedAudio?.Title)}
                      />
                    </Hint>
                    <AudioCardFlex
                      count={i}
                      playlists={playlist}
                      audio={FetchedAudio!}
                    />
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ReorderPlaylist;
