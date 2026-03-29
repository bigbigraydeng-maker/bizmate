"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(100%,16rem)] p-0" showCloseButton>
        <SheetTitle className="sr-only">BizMate</SheetTitle>
        <Sidebar
          className="w-full border-0 bg-popover"
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
