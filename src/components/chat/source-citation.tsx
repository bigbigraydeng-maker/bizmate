"use client";

import { useTranslations } from "next-intl";

import type { SourceCitation } from "@/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  sources: SourceCitation[];
};

export function SourceCitationList({ sources }: Props) {
  const t = useTranslations("chat");

  if (!sources.length) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-muted-foreground text-xs font-medium">{t("sourcesHeading")}</p>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={`${s.title}-${i}`}>
            <Card className="border-border/80 bg-background/60">
              <CardHeader className="space-y-1 p-3 pb-0">
                <CardTitle className="text-sm font-medium leading-snug">
                  {s.source_url ? (
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </CardTitle>
                <p className="text-muted-foreground text-xs">{s.source}</p>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <p className="text-muted-foreground line-clamp-4 text-xs leading-relaxed">
                  {s.snippet}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
