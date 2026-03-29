"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { dashboardNav } from "./nav-config";

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside
      className={cn(
        "bg-muted/30 flex w-60 shrink-0 flex-col border-r border-border",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link
          href="/"
          className="text-primary font-semibold tracking-tight"
          onClick={onNavigate}
        >
          BizMate
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {dashboardNav.map(({ href, messageKey, Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {t(messageKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
