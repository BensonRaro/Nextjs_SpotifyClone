import Box from "@/components/sidebar/Box";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarSkeleton = () => {
  return (
    <div className="hidden md:flex flex-col gap-y-2 bg-black h-[90vh] w-[300px] p-2">
      <Box>
        <div className="flex flex-col px-2 py-4 gap-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton className="h-10" key={i} />
          ))}
        </div>
      </Box>
      <Box>
        <div className="px-2 pt-2 space-y-2">
          <Skeleton className="h-10" />
          {[...Array(8)].map((_, i) => (
            <Skeleton className="h-16" key={i} />
          ))}
        </div>
      </Box>
    </div>
  );
};

export default SidebarSkeleton;
