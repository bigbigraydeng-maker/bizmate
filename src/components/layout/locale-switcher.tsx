"use client";

import { useLocale } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
      <Link
        href="/"
        locale="zh"
        className={cn(
          buttonVariants({
            variant: locale === "zh" ? "default" : "ghost",
            size: "sm",
          }),
          "h-8 px-2 text-xs",
        )}
      >
        中
      </Link>
      <Link
        href="/"
        locale="en"
        className={cn(
          buttonVariants({
            variant: locale === "en" ? "default" : "ghost",
            size: "sm",
          }),
          "h-8 px-2 text-xs",
        )}
      >
        EN
      </Link>
    </div>
  );
}
