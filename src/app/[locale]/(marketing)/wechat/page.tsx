import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { MessageCircle, ArrowRight, Bell, Plane, Newspaper, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wechat" });
  return { title: t("pageTitle") };
}

const FEATURES = [
  { key: "news", icon: Newspaper },
  { key: "tax", icon: Bell },
  { key: "flights", icon: Plane },
  { key: "community", icon: Users },
] as const;

export default async function WeChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "wechat" });

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-16 text-center">
      <MessageCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold tracking-tight">{t("heading")}</h1>
      <p className="text-muted-foreground text-lg">{t("subtitle")}</p>

      {/* QR code placeholder */}
      <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30">
        <p className="text-muted-foreground text-sm">{t("qrPlaceholder")}</p>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ key, icon: Icon }) => (
          <Card key={key}>
            <CardContent className="flex items-start gap-3 pt-5 pb-5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <div className="text-left">
                <p className="font-medium">{t(`feature_${key}_title`)}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">{t(`feature_${key}_desc`)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-4">
        <p className="text-muted-foreground mb-3 text-sm">{t("orWeb")}</p>
        <Link href="/register">
          <Button>
            {t("ctaRegister")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
