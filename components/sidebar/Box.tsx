import { cn } from "@/lib/utils";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div className={cn("bg-neutral-900 rounded-lg h-fit w-full", className)}>
      {children}
    </div>
  );
};

export default Box;
