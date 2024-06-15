import { cn } from "@/lib/utils";
import { FaHeart } from "react-icons/fa";

const LikedIcon = ({
  iconClassName,
  divClassName,
}: {
  iconClassName: string;
  divClassName: string;
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-[#4303F5] to-[#BFEAD8] shadow-xl flex items-center justify-center rounded-md",
        divClassName
      )}
    >
      <FaHeart className={cn("text-white", iconClassName)} />
    </div>
  );
};

export default LikedIcon;
