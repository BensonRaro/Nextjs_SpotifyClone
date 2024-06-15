"use client";

import { useImageColor } from "@/store/useImageColor";
import { useEffect, useRef } from "react";

const ImageBackgroundDetector = ({
  imageUrl,
  rendering,
}: {
  imageUrl: string | undefined;
  rendering: "user" | "playlist" | "audio";
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { setPlaylist, setProfile, setAudio } = useImageColor();

  // Helper function to convert RGB values to hex code
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;

  useEffect(() => {
    if (imageUrl) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");

        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageUrl;

        image.onload = () => {
          if (ctx) {
            ctx.drawImage(image, 0, 0);

            const pixelData = ctx.getImageData(0, 0, 1, 1).data;

            const pixelArray = Array.from(pixelData);

            const [red, green, blue] = pixelArray;

            const HexCode = rgbToHex(red, green, blue);

            if (rendering === "user") {
              setProfile(HexCode);
            }
            if (rendering === "playlist") {
              setPlaylist(HexCode);
            }
            if (rendering) {
              setAudio(HexCode);
            }

            // console.log(HexCode);
          }
        };
      }
    } else {
      setProfile("");
      setPlaylist("");
      setAudio("");
    }
  }, []);

  return <canvas ref={canvasRef} className="hidden" />;
};

export default ImageBackgroundDetector;
