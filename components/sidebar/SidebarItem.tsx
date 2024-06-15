import Link from "next/link";
import { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, active, href }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-row h-auto items-center w-full gap-x-4 text-base font-medium text-neutral-400 hover:text-white transition",
        active && "text-white"
      )}
    >
      <Icon size={26} />
      <p className="hidden md:block">{label}</p>
    </Link>
  );
};

export default SidebarItem;
