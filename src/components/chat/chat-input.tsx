"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  onSend: (text: string) => void;
  disabled: boolean;
  streaming: boolean;
  showSuggestions: boolean;
};

export function ChatInput({ onSend, disabled, streaming, showSuggestions }: Props) {
  const t = useTranslations("chat");
  const [value, setValue] = useState("");

  const suggestions = [t("suggestion1"), t("suggestion2"), t("suggestion3")];

  function submit() {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  }

  return (
    <div className="space-y-3 border-t border-border bg-background p-4">
      {showSuggestions ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled}
              onClick={() => {
                onSend(s);
                setValue("");
              }}
              className="bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full border border-border px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t("inputPlaceholder")}
          disabled={disabled}
          rows={2}
          className="min-h-[52px] resize-none pr-12"
        />
        <Button
          type="button"
          size="icon"
          className="absolute bottom-2 right-2 shrink-0"
          disabled={disabled || !value.trim()}
          onClick={submit}
          aria-label={t("send")}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
      {streaming ? (
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="inline-flex gap-0.5">
            <span className="bg-primary inline-block size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
            <span className="bg-primary inline-block size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
            <span className="bg-primary inline-block size-1.5 animate-bounce rounded-full" />
          </span>
          {t("thinking")}
        </p>
      ) : null}
    </div>
  );
}
