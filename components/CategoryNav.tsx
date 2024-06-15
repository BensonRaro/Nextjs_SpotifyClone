import { Category } from "@/constant/Cat";
import { cn } from "@/lib/utils";

const CategoryNav = ({
  setCategory,
  category,
}: {
  setCategory: (category: string) => void;
  category: string;
}) => {
  return (
    <div className="flex gap-4 mt-2">
      {Category.map((item, index) => (
        <div
          key={index}
          className={cn(
            "p-2 px-3 rounded-lg cursor-pointer transition-all h-fit font-semibold",
            item === category && "dark:bg-neutral-800"
          )}
          onClick={() => setCategory(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default CategoryNav;
