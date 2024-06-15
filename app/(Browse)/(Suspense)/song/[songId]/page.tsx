// @ts-ignore
import { getLyrics } from "genius-lyrics-api";

import { db } from "@/lib/db";
import ImageBackgroundDetector from "@/components/ImageBackgroundDetector";
import AudioClient from "@/components/AudioClient";

const SongPage = async ({ params }: { params: { songId: string } }) => {
  const audio = await db.audio.findUnique({
    where: {
      id: params.songId,
    },
  });

  const options = {
    apiKey: process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN,
    title: audio?.Title,
    artist: audio?.Author,
    optimizeQuery: true,
  };

  const Lyrics = await getLyrics(options);

  // console.log(Lyrics);

  // NEXT_PUBLIC_GENIUS_ACCESS_TOKEN
  return (
    <>
      <ImageBackgroundDetector imageUrl={audio?.Thumbnail} rendering="audio" />
      <AudioClient Lyrics={Lyrics} audio={audio} />
    </>
  );
};

export default SongPage;
