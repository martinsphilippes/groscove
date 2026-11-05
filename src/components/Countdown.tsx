"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { computeCountdown } from "@/lib/launch";

function FlipUnit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flip-unit">
      <div className="flip-unit__digits" aria-hidden="true">
        {text.split("").map((digit, i) => (
          // A chave muda com o dígito e reinicia a animação de virar.
          <span key={`${i}-${digit}`} className="flip-digit">
            {digit}
          </span>
        ))}
      </div>
      <span className="flip-unit__label">{label}</span>
    </div>
  );
}

export function Countdown({ targetIso, initialNow }: { targetIso: string; initialNow: number }) {
  const t = useTranslations("teaser.countdown");
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const c = computeCountdown(target, now);
  const spoken = `${c.days} ${t("days")}, ${c.hours} ${t("hours")}, ${c.minutes} ${t("minutes")}`;

  return (
    <div className="countdown" role="timer" aria-label={t("label")}>
      <span className="sr-only" aria-live="off">
        {spoken}
      </span>
      <FlipUnit value={c.days} label={t("days")} />
      <span className="countdown__sep" aria-hidden="true">:</span>
      <FlipUnit value={c.hours} label={t("hours")} />
      <span className="countdown__sep" aria-hidden="true">:</span>
      <FlipUnit value={c.minutes} label={t("minutes")} />
      <span className="countdown__sep" aria-hidden="true">:</span>
      <FlipUnit value={c.seconds} label={t("seconds")} />
    </div>
  );
}
