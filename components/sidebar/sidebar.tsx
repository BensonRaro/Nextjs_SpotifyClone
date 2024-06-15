"use client";

import Link from "next/link";
import { FaSpotify } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useMemo, useTransition } from "react";
import { usePathname } from "next/navigation";
import { MdOutlinePlaylistAdd, MdOutlineCreateNewFolder } from "react-icons/md";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { playlist } from "@prisma/client";

import Box from "@/components/sidebar/Box";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { Button } from "@/components/ui/button";
import { CreatePlaylist } from "@/actions/CreatePlaylist";
import Library from "@/components/sidebar/Library";

const Sidebar = ({ playlists }: { playlists: playlist[] }) => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const userPlaylists = playlists.filter(
    (playlist) => playlist.userId === user?.id
  );

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        href: "/search",
        active: pathname === "/search",
      },
    ],
    [pathname]
  );

  const Create = () => {
    const name = `My playlist #${userPlaylists.length + 1}`;

    startTransition(async () => {
      await CreatePlaylist(name, "", "")
        .then(() => {
          toast(`Playlist ${name} created`);
        })
        .catch((error) => {
          toast("Something went wrong");
          console.log(error);
        });
    });
  };

  return (
    <div className="flex flex-col gap-y-2 bg-black h-full w-[90px] md:w-[280px] p-2">
      <Box>
        <div className="flex flex-col px-5 py-4 gap-4">
          <Link href={"/"} className="flex gap-2 items-center">
            <FaSpotify size={30} />
            <p className="hidden md:block">Spotify</p>
          </Link>
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              label={route.label}
              active={route.active}
            />
          ))}
        </div>
      </Box>
      <Box className="h-full overflow-y-auto">
        {userPlaylists.length > 0 ? (
          <Library Create={Create} playlists={userPlaylists} />
        ) : (
          <div className="pt-4 space-y-2 md:space-y-4 shadow-md p-2">
            <div className="md:p-4 md:space-y-4 rounded-md md:bg-lightDark flex flex-col items-center justify-center md:block">
              <p className="hidden md:block font-semibold">
                Create your first playlist
              </p>
              <p className="hidden md:block text-xs">
                It&apos;s easy, we&apos;ll help you
              </p>
              <Button
                className="px-2 md:size-full"
                onClick={Create}
                disabled={isPending || !user}
              >
                <MdOutlinePlaylistAdd className="md:hidden block size-10" />
                <p className="hidden md:block">Create Playlist</p>
              </Button>
            </div>

            <div className="md:p-4 md:space-y-4 rounded-md md:bg-lightDark flex flex-col items-center justify-center md:block">
              <p className="hidden md:block font-semibold">
                Let&apos;s find some podcasts to follow
              </p>
              <p className="hidden md:block text-xs">
                We&apos;ll keep you updated on new episodes
              </p>
              <Button className="px-2 md:size-full">
                <MdOutlineCreateNewFolder className="md:hidden block size-10" />
                <p className="hidden md:block">Browse podcasts</p>
              </Button>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Sidebar;
