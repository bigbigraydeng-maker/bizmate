"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

import { dashboardNav } from "./nav-config";

type HeaderProps = {
  onOpenMobileMenu: () => void;
};

function useHeaderTitle() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const td = useTranslations("dashboard");
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (
    first &&
    ["jobs", "documents", "onboarding"].includes(first)
  ) {
    return t(first as "jobs" | "documents" | "onboarding");
  }

  const match = dashboardNav.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (match) return t(match.messageKey);

  return td("defaultPageTitle");
}

export function DashboardHeader({ onOpenMobileMenu }: HeaderProps) {
  const title = useHeaderTitle();
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const { user, loading } = useUser();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials =
    user?.email?.slice(0, 2).toUpperCase() ??
    (user?.user_metadata?.full_name as string | undefined)
      ?.slice(0, 2)
      ?.toUpperCase() ??
    "?";

  return (
    <header className="bg-background flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-3 md:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMobileMenu}
          aria-label={t("menu")}
        >
          <Menu className="size-5" />
        </Button>
        <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <LocaleSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-full outline-none"
            disabled={loading}
          >
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-transparent hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {loading ? "…" : initials}
                </AvatarFallback>
              </Avatar>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <span className="text-muted-foreground truncate text-xs">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/settings");
              }}
            >
              {tNav("settings")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => void handleLogout()}
            >
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
