"use client";

import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { TbSettingsAutomation } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Header = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user } = useUser();
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full p-2 sticky top-0 z-30",
        className
      )}
    >
      <div className="items-center space-x-2">
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
          onClick={() => router.back()}
        >
          <RxCaretLeft size={35} />
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
          onClick={() => router.forward()}
        >
          <RxCaretRight size={35} />
        </Button>
      </div>
      <div className="flex items-center justify-between gap-x-4">
        {!user && (
          <>
            <SignUpButton>
              <div className="font-medium cursor-pointer hover:font-bold hover:text-lg text-neutral-300">
                Sign Up
              </div>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button className="p-6 text-lg text-black bg-white hover:bg-white rounded-full">
                Log in
              </Button>
            </SignInButton>
          </>
        )}
        {!!user && (
          <div className="flex items-center gap-x-2">
            <Button
              variant={"outline"}
              onClick={() => router.push(`/user/${user?.id}`)}
              className="px-2 md:size-full"
            >
              <TbSettingsAutomation className="size-6 md:mr-2" />
              <p className="hidden md:block">Author Dashboard</p>
            </Button>
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
