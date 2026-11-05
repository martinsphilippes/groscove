import { useId } from "react";

export const BRAND_NAME = "GROSCOVE ULTRA";

/**
 * Logo GROSCOVE ULTRA (branco) + triângulo laranja.
 * O reflexo é um único retângulo que atravessa o logo inteiro (texto e triângulo),
 * recortado pelo desenho do logo. Em "reduzir movimento" o reflexo não aparece.
 *
 * TODO(ultra-hero): trocar o <text> pelos caminhos de `brand-paths.ts` do Ultra-hero
 * para ficar idêntico ao desenho original.
 */
export function LaunchLogo({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const clip = `logo-clip-${id}`;
  const grad = `logo-shine-${id}`;

  const shapes = (
    <>
      <text x="0" y="52" className="launch-logo__word" textLength="430" lengthAdjust="spacingAndGlyphs">
        GROSCOVE
      </text>
      <text x="0" y="104" className="launch-logo__word launch-logo__word--ultra" textLength="250" lengthAdjust="spacingAndGlyphs">
        ULTRA
      </text>
      <polygon points="270,104 330,104 300,62" />
    </>
  );

  return (
    <svg viewBox="0 0 440 112" className={["launch-logo", className].filter(Boolean).join(" ")} role="img" aria-label={BRAND_NAME}>
      <defs>
        <clipPath id={clip}>{shapes}</clipPath>
        <linearGradient id={grad} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="launch-logo__base">
        <text x="0" y="52" className="launch-logo__word" fill="#fff" textLength="430" lengthAdjust="spacingAndGlyphs">
          GROSCOVE
        </text>
        <text
          x="0"
          y="104"
          className="launch-logo__word launch-logo__word--ultra"
          fill="#fff"
          textLength="250"
          lengthAdjust="spacingAndGlyphs"
        >
          ULTRA
        </text>
        <polygon points="270,104 330,104 300,62" fill="var(--brand-orange)" />
      </g>
      <g clipPath={`url(#${clip})`} aria-hidden="true">
        <rect className="launch-logo__shine" x="-160" y="-20" width="140" height="160" fill={`url(#${grad})`} />
      </g>
    </svg>
  );
}
