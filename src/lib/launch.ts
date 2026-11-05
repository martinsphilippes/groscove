/** 01/01/2027 00:00 em America/Sao_Paulo (UTC-3, sem horário de verão). */
export const DEFAULT_LAUNCH_AT = "2027-01-01T03:00:00Z";

export function getLaunchAt(): Date {
  const raw = process.env.LAUNCH_AT?.trim();
  const date = new Date(raw || DEFAULT_LAUNCH_AT);
  return Number.isNaN(date.getTime()) ? new Date(DEFAULT_LAUNCH_AT) : date;
}

export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

export function computeCountdown(targetMs: number, nowMs: number): Countdown {
  const diff = Math.max(0, targetMs - nowMs);
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: diff === 0,
  };
}
