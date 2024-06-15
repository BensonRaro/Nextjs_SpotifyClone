"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import { EditBanner } from "@/actions/EditBanner";

const BannerButtons = ({ banner }: { banner: string | undefined }) => {
  const FilePickerRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const { edgestore } = useEdgeStore();

  // upload ftn
  const Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (file) {
        startTransition(async () => {
          if (!banner) {
            await edgestore.publicFiles
              .upload({
                file,
              })
              .then(async (result) => {
                await EditBanner(result.url);
                toast("Banner Added");
              })
              .catch((error) => {
                toast.error("Something went wrong");
                console.log(error);
              });
          } else {
            await edgestore.publicFiles
              .upload({
                file,
                options: {
                  replaceTargetUrl: banner,
                },
              })
              .then(async (result) => {
                await EditBanner(result.url);
                toast("Banner Changed");
              })
              .catch((error) => {
                toast.error("Something went wrong");
                console.log(error);
              });
          }
        });
      }
    }
  };

  // Remove ftn
  const RemoveBanner = () => {
    startTransition(async () => {
      await edgestore.publicFiles
        .delete({
          url: banner!,
        })
        .then(() => {
          EditBanner("");
          toast("Banner Removed");
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
        });
    });
  };

  return (
    <div className="absolute z-30 bottom-2 right-2 space-y-2 space-x-4">
      <Button
        type="button"
        disabled={isPending}
        onClick={() => FilePickerRef.current?.click()}
      >
        <input
          type="file"
          ref={FilePickerRef}
          accept="image/*"
          hidden
          onChange={Upload}
        />
        {banner ? "Change Banner" : "Add Banner"}
      </Button>

      {banner && (
        <Button onClick={RemoveBanner} disabled={isPending}>
          Remove Banner
        </Button>
      )}
    </div>
  );
};

export default BannerButtons;
