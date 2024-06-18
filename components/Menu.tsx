import { useTransition } from "react";
import { audio, playlist } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { VscPassFilled } from "react-icons/vsc";
import { FiPlus } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";
import { PiListPlus } from "react-icons/pi";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CreatePlaylist } from "@/actions/CreatePlaylist";
import { AddAudio } from "@/actions/AddAudio";
import { RemoveAudio } from "@/actions/RemoveAudio";
import LikedIcon from "@/components/LikedIcon";
import { DeleteAudio } from "@/actions/DeleteAudio";
import { useEdgeStore } from "@/lib/edgestore";

interface MenuProps {
  children: React.ReactNode;
  isLiked: boolean | undefined;
  AddToLiked: () => void;
  playlist: playlist[] | undefined;
  audio: audio;
  likedPlaylistId: string | undefined;
  setOpen?: (open: boolean) => void;
}
const Menu = ({
  setOpen,
  AddToLiked,
  children,
  isLiked,
  playlist,
  audio,
  likedPlaylistId,
}: MenuProps) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  const { edgestore } = useEdgeStore();
  const FilteredPlaylist = playlist?.filter(
    (list) => list.folderId !== "Liked Songs" && list.userId === user?.id
  );

  // create playlist
  const Create = () => {
    startTransition(async () => {
      await CreatePlaylist(audio.Title, "", audio.Thumbnail, audio.id)
        .then(() => {
          toast(`Playlist ${audio.Title} created`);
        })
        .catch((error) => {
          toast("Something went wrong");
          console.log(error);
        });
    });
  };

  // add to playlist
  const AddAudioToPlaylist = (
    id: string,
    name: string,
    playlistAudio: string[]
  ) => {
    const IsAdded = playlistAudio.includes(audio.id);
    if (IsAdded) {
      toast(`Audio ${audio.Title} already added to ${name}`);
    } else {
      startTransition(async () => {
        await AddAudio(playlist, id, audio.id)
          .then(() => {
            toast(`${audio.Title} Added to ${name}`);
          })
          .catch((error) => {
            toast("Something went wrong");
            console.log(error);
          });
      });
    }
  };

  // unlike
  const Unlike = () => {
    startTransition(async () => {
      await RemoveAudio(playlist, likedPlaylistId, audio.id)
        .then(() => {
          toast(
            <div className="flex items-center gap-4">
              <LikedIcon iconClassName="size-4" divClassName="size-10" />
              Removed from Liked Songs
            </div>
          );
        })
        .catch((error) => {
          toast("Something went wrong");
          console.log(error);
        });
    });
  };

  // delete Audio
  const Delete = () => {
    startTransition(async () => {
      for (const playlistItem of playlist!) {
        const IsAdded = playlistItem.audio.includes(audio.id);
        if (IsAdded) {
          await RemoveAudio(playlist, playlistItem.id, audio.id);
        }
      }
      await edgestore.publicFiles
        .delete({
          url: audio.Thumbnail,
        })
        .catch((error: any) => {
          console.log(error);
        });
      await edgestore.publicFiles
        .delete({
          url: audio.AudioUrl,
        })
        .catch((error: any) => {
          console.log(error);
        });
      await DeleteAudio(audio.id)
        .then(() => {
          toast(`${audio.Title} Deleted Successfully`);
        })
        .catch((error) => {
          toast("Something went wrong");
          console.log(error);
        });
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] dark:bg-[#282828]">
        {user && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FiPlus className="size-7 mr-2" />
                Add to Playlist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="dark:bg-[#282828]">
                  <Command className="dark:bg-[#282828]">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <DropdownMenuItem disabled={isPending} onClick={Create}>
                        <FiPlus className="size-7 mr-2" />
                        New Playlist
                      </DropdownMenuItem>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {FilteredPlaylist?.map((list) => (
                          <div
                            className="w-full cursor-pointer hover:bg-lightDark"
                            onClick={() =>
                              AddAudioToPlaylist(list.id, list.name, list.audio)
                            }
                            key={list.id}
                          >
                            <CommandItem disabled={isPending}>
                              {list.name}
                            </CommandItem>
                          </div>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {isLiked ? (
              <DropdownMenuItem disabled={isPending} onClick={Unlike}>
                <VscPassFilled className="size-5 mr-2 text-primary" />
                Remove from your Liked Songs
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled={isPending} onClick={AddToLiked}>
                <IoAddCircleOutline className="size-5 mr-2 text-primary" />
                Save to your Liked Songs
              </DropdownMenuItem>
            )}
            {user.id === audio.userId && (
              <>
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={() => setOpen && setOpen(true)}
                >
                  <AiTwotoneEdit className="mr-2 size-7" />
                  Edit Audio
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isPending} onClick={Delete}>
                  <MdDelete className="mr-2 size-7 text-red-500" />
                  Delete Audio
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
        <DropdownMenuItem disabled={isPending}>
          <PiListPlus className="mr-2 size-7" />
          Add To Queue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
