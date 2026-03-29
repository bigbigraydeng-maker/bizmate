"use client";

import { useState } from "react";

import { DashboardHeader } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen w-full">
      <Sidebar className="hidden md:flex" />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
