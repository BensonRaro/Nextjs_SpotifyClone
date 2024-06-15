import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { playlist } from "@prisma/client";

import DialogTag from "@/components/Dialog/DialogTag";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UpdateCreateAudio } from "@/actions/UpdateCreateAudio";
import PlaylistMedia from "@/components/PlaylistMedia";
import { EditPlaylist } from "@/actions/EditPlaylist";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name required" })
    .max(100, { message: "More Than 100 words" }),
  imageUrl: z.string().optional(),
  Visibility: z.enum(["Public", "Private"]),
});

const UpdatePlaylist = ({
  open,
  setOpen,
  initialPlaylist,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialPlaylist: playlist | null;
}) => {
  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    name: initialPlaylist?.name,
    imageUrl: initialPlaylist?.imageUrl,
    Visibility: initialPlaylist?.Visibility,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      await EditPlaylist(
        initialPlaylist?.id!,
        values.name,
        values.imageUrl ? values.imageUrl : "",
        values.Visibility
      )
        .then(() => {
          toast("Audio Created Successfully");
          form.reset();
          setOpen(false);
        })
        .catch((error) => {
          toast("Something went wrong");
          console.log(error);
        });
    });
    // console.log(values);
  };

  return (
    <DialogTag open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>Edit Playlist</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PlaylistMedia
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onRemove={() => field.onChange("")}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Required)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      disabled={isPending}
                      className="border-none dark:bg-lightDark"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility (Required)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger className="dark:bg-lightDark">
                        <SelectValue placeholder="Select Catgory" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-lightDark">
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="dark:bg-primary dark:hover:bg-green-500 w-full text-lg"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </DialogTag>
  );
};

export default UpdatePlaylist;
