import { playlist } from "@prisma/client";
import { MdOutlineFolder } from "react-icons/md";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { PiMusicNotesPlusLight } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PlaylistCard from "@/components/sidebar/PlaylistCard";

const Library = ({
  Create,
  playlists,
}: {
  Create: () => void;
  playlists: playlist[];
}) => {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-30 flex justify-between px-4 pt-4 shadow-md bg-neutral-900 rounded-md">
        <div className="items-center gap-x-2 hidden md:inline-flex text-neutral-400">
          <TbPlaylist size={26} />
          <p className="font-medium text-base">Your Library</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              size="icon"
              variant="ghost"
              className="transition text-neutral-400 hover:text-white"
            >
              <AiOutlinePlus size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[280px] dark:bg-[#282828]">
            <DropdownMenuItem onClick={Create}>
              <PiMusicNotesPlusLight className="mr-2 size-6" />
              Create Playlist
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MdOutlineFolder className="mr-2 size-6" />
              Create Folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col px-1 md:px-3 mt-4 gap-y-1 pb-2">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default Library;
