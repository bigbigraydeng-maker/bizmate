"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export function Footer() {
  const t = useTranslations("landing");

  return (
    <footer className="border-t bg-muted/30 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-primary">BizMate</span>
          <LocaleSwitcher />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/wechat" className="flex items-center gap-1 hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4" />
            {t("followWechat")}
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">{t("privacy")}</Link>
          <Link href="#" className="hover:text-primary transition-colors">{t("terms")}</Link>
        </div>
        <p className="text-xs text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}
