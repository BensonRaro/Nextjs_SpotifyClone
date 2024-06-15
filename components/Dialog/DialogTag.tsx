import { useState, useEffect } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogTagProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}

const DialogTag = ({ children, open, setOpen, className }: DialogTagProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("border-none dark:bg-neutral-900", className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogTag;
