import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { audio } from "@prisma/client";

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
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaUplaoder from "@/components/MediaUplaoder";
import { UpdateCreateAudio } from "@/actions/UpdateCreateAudio";

const formSchema = z.object({
  Title: z
    .string()
    .min(1, { message: "Title required" })
    .max(100, { message: "Not More Than 100 words" }),
  Author: z
    .string()
    .min(1, { message: "Author Required" })
    .max(500, { message: "Not More than 500 words" }),
  Category: z.string().min(1, { message: "Please select category" }),
  Thumbnail: z.string().min(10, { message: "Thumbnail Required" }),
  AudioUrl: z.string().min(10, { message: "Audio Required" }),
});

const UploadAudio = ({
  open,
  setOpen,
  initialAudio,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialAudio?: audio;
}) => {
  const [duration, setDuration] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {}, [initialAudio]);

  const defaultValues = initialAudio
    ? initialAudio
    : {
        Title: "",
        Author: "",
        Category: "",
        Thumbnail: "",
        AudioUrl: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const finalValues = {
      ...values,
      duration,
    };

    startTransition(async () => {
      if (!initialAudio) {
        await UpdateCreateAudio(finalValues, false)
          .then(() => {
            toast("Audio Created Successfully");
            form.reset();
            setOpen(false);
          })
          .catch((error) => {
            toast("Something went wrong");
            console.log(error);
          });
      } else {
        await UpdateCreateAudio(finalValues, true, initialAudio.id)
          .then(() => {
            toast(`${values.Title} Updated Successfully`);
            form.reset();
            setOpen(false);
          })
          .catch((error) => {
            toast("Something went wrong");
            console.log(error);
          });
      }
    });
    // console.log(values);
  };

  return (
    <DialogTag open={open} setOpen={setOpen}>
      <DialogHeader>
        <DialogTitle>{initialAudio ? "Update Audio" : "Add Audio"}</DialogTitle>
        <DialogDescription>
          You can either upload podcast or a song.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Required)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      disabled={isPending}
                      {...field}
                      className="border-none dark:bg-lightDark"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author (Required)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Author"
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
              name="Category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Required)</FormLabel>
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
                        <SelectItem value="Song">Song</SelectItem>
                        <SelectItem value="Podcast">Podcast</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/*uploading the thumbnail  */}
            <FormField
              control={form.control}
              name="Thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail (Required)</FormLabel>
                  <FormControl>
                    <MediaUplaoder
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onRemove={() => field.onChange("")}
                      type="Image"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/*uploading the audio  */}
            {!initialAudio && (
              <FormField
                control={form.control}
                name="AudioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio (Required)</FormLabel>
                    <FormControl>
                      <MediaUplaoder
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onRemove={() => field.onChange("")}
                        type="Audio"
                        setDuration={setDuration}
                        duration={duration}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            )}
            {/* MediaUplaod */}
            <Button
              type="submit"
              disabled={isPending}
              className="dark:bg-primary dark:hover:bg-green-500 w-full text-lg"
            >
              {initialAudio ? "Update Audio" : "Add Audio"}
            </Button>
          </form>
        </Form>
      </div>
    </DialogTag>
  );
};

export default UploadAudio;
