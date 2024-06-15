import { ImagePlus } from "lucide-react";
import { PiFileAudio } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import ProgressBar from "@/components/ProgressBar";

interface MediaUploaderProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  setDuration?: (value: number) => void;
  duration?: number;
  value: string;
  type: "Image" | "Audio";
}

const MediaUplaoder = ({
  disabled,
  onChange,
  onRemove,
  setDuration,
  duration,
  value,
  type,
}: MediaUploaderProps) => {
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [url, seturl] = useState(value ? value : "");
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("");
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const { edgestore } = useEdgeStore();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveType(type);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFileName(file.name);
      setSize(file.size);

      if (file) {
        setLoading(true);
        try {
          startTransition(async () => {
            await edgestore.publicFiles
              .upload({
                file,
                onProgressChange: (progress: number) => {
                  setProgress(progress);
                },
              })
              .then((result) => {
                onChange(result.url);
                seturl(result.url);
                setLoading(false);
                setActiveType("");
                toast("File uploaded successfully");
              })
              .catch((error) => {
                toast("Something Went Wrong");
                console.error(error);
                setLoading(false);
                setActiveType("");
              });
          });
        } catch (error) {
          toast("Something Went Wrong");
          console.error(error);
          setLoading(false);
          setActiveType("");
        }
      }
    }
  };

  const HandleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    const target = event.target as HTMLAudioElement;
    const audioDuration = target.duration;
    console.log(audioDuration);
    setDuration?.(audioDuration);
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
          toast("File deleted successfully");
        })
        .catch((error) => {
          console.log(error);
          toast("Something Went Wrong");
        });
    });
  };
  return (
    <div className="w-full">
      {loading ? (
        <ProgressBar
          fileName={fileName}
          progress={progress}
          size={size}
          type={type}
        />
      ) : (
        <>
          {activeType === "" && (
            <>
              {url === "" ? (
                <Button
                  type="button"
                  disabled={disabled}
                  className="w-full text-lg dark:bg-lightDark dark:hover:bg-stone-800 dark:text-white"
                  onClick={() => filePickerRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={filePickerRef}
                    hidden
                    accept={type === "Image" ? "image/*" : "audio/*"}
                    onChange={onUpload}
                  />
                  {type === "Image" ? (
                    <ImagePlus className="mr-2 size-7" />
                  ) : (
                    <PiFileAudio className="mr-2 size-7" />
                  )}
                  Upload {type}
                </Button>
              ) : (
                <>
                  {type === "Audio" ? (
                    <div className="flex items-center gap-2">
                      <audio
                        src={url}
                        ref={audioRef}
                        onLoadedMetadata={HandleLoadedMetadata}
                        controls
                        className="w-full"
                      />
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        type="button"
                        disabled={disabled || isPending}
                        onClick={onDelete}
                      >
                        <MdDelete className="size-7" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative overflow-hidden rounded-md">
                        <div className="absolute z-10 top-2 right-2">
                          <Button
                            size={"icon"}
                            variant={"destructive"}
                            type="button"
                            disabled={disabled || isPending}
                            onClick={onDelete}
                          >
                            <MdDelete className="size-7" />
                          </Button>
                        </div>
                        <div className="w-[200px] h-[200px] dark:bg-lightDark">
                          <Image
                            fill
                            className="object-contain rounded-md"
                            alt={fileName}
                            src={url}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MediaUplaoder;
