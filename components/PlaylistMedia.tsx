import Image from "next/image";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiMusicNotesPlusLight } from "react-icons/pi";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { PiImageLight } from "react-icons/pi";
import { MdDelete } from "react-icons/md";

import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PlaylistMedia = ({
  disabled,
  onChange,
  onRemove,
  value,
}: {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value?: string;
}) => {
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [url, seturl] = useState(value ? value : "");
  const { edgestore } = useEdgeStore();

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file) {
        try {
          if (value) {
            onDelete();
          } else {
            startTransition(async () => {
              await edgestore.publicFiles
                .upload({
                  file,
                })
                .then((result) => {
                  onChange(result.url);
                  seturl(result.url);
                  toast("Image uploaded successfully");
                })
                .catch((error) => {
                  toast("Something Went Wrong");
                  console.error(error);
                });
            });
          }
        } catch (error) {
          console.log(error);
          toast("Something Went Wrong");
        }
      }
    }
  };

  const onDelete = () => {
    startTransition(async () => {
      await edgestore.publicFiles
        .delete({
          url: url,
        })
        .then(() => {
          seturl("");
          onRemove(url);
          toast("Image deleted successfully");
        })
        .catch((error) => {
          console.log(error);
          toast("Something Went Wrong");
        });
    });
  };

  return (
    <div className="relative overflow-hidden rounded-md group cursor-pointer">
      <div className="absolute z-10 top-4 right-2">
        <Popover>
          <PopoverTrigger>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isPending || disabled}
              className="opacity-0 group-hover:opacity-100"
            >
              <HiOutlineDotsHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="dark:bg-[#282828] space-y-2 py-2 w-fit dark:text-white/50">
            <div
              onClick={() => filePickerRef.current?.click()}
              className="flex w-full hover:dark:text-white cursor-pointer"
            >
              <input
                type="file"
                ref={filePickerRef}
                accept={"image/*"}
                hidden
                onChange={onUpload}
              />
              <PiImageLight className="size-6 mr-2" />
              {value ? "Change Image" : "Add Image"}
            </div>
            {value && (
              <div
                className="flex w-full hover:dark:text-white cursor-pointer"
                onClick={onDelete}
              >
                <MdDelete className="size-6 mr-2" />
                Remove Image
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-[200px] h-[220px] bg-lightDark flex justify-center items-center">
        {value ? (
          <Image
            fill
            alt="Playlist Image"
            src={url}
            className="object-contain rounded-md"
          />
        ) : (
          <PiMusicNotesPlusLight className="size-24" />
        )}
      </div>
    </div>
  );
};

export default PlaylistMedia;
