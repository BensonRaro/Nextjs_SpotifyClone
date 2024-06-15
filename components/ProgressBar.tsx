import { VscPassFilled } from "react-icons/vsc";
import { FcAudioFile } from "react-icons/fc";
import { FcImageFile } from "react-icons/fc";
import { formatFileSize } from "@edgestore/react/utils";

const ProgressBar = ({
  progress,
  type,
  size,
  fileName,
}: {
  progress: number;
  type: string;
  size: number;
  fileName: string;
}) => {
  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <span className="size-10 flex justify-center items-center border rounded-lg dark:border-neutral-700">
            {type === "Image" ? (
              <FcImageFile className="size-7 flex-shrink-0" />
            ) : (
              <FcAudioFile className="size-7 flex-shrink-0" />
            )}
          </span>
          <div>
            <p className="text-sm font-medium dark:text-white">{fileName}</p>
            <p className="text-xs dark:text-gray-300">{formatFileSize(size)}</p>
          </div>
        </div>
        {progress === 100 && (
          <div className="inline-flex items-center gap-x-2">
            <VscPassFilled className="size-7 dark:text-green-500" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-3 whitespace-nowrap">
        <div
          className="flex w-full h-2 rounded-full overflow-hidden bg-gray-700"
          role="progress-bar"
        >
          <div
            className="flex flex-col justify-center rounded-full overflow-hidden bg-primary transition duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="w-6 text-end">
          <span className="text-sm dark:text-white">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
