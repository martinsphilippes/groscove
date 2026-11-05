import { BRAND_ORANGE, LOGO_A_PATH, LOGO_GROSCOVE_PATH, LOGO_ULTR_PATH, LOGO_VIEWBOX } from "./brand-paths";

export const BRAND_NAME = "Groscove Ultra";

/** Nome sempre em branco nítido, triângulo no laranja oficial (cores fixas no SVG). */
const LETTERS_FILL = "#f2efea";

function LogoShapes({ letters, mark }: { letters: string; mark: string }) {
  return (
    <>
      <path d={LOGO_GROSCOVE_PATH} fill={letters} />
      <path d={LOGO_ULTR_PATH} fill={letters} />
      <path d={LOGO_A_PATH} fill={mark} />
    </>
  );
}

/**
 * Logo oficial (desenho de brand-paths.ts, copiado do Ultra-hero).
 * Brilho: duas cópias decorativas empilhadas sobre o logo e mascaradas pela MESMA faixa
 * inclinada (teaser.css), então a luz atravessa GROSCOVE, ULTR e o triângulo juntos:
 * - halo (atrás): cópia desfocada, faz o clarão suave em volta das formas;
 * - reflexo (na frente): letras em branco e triângulo em laranja claro.
 * As cópias só aparecem sem "reduzir movimento". Leitor de tela lê uma imagem só.
 */
export function LaunchLogo({ className, shine = true }: { className?: string; shine?: boolean }) {
  return (
    <span className={["launch-logo", className].filter(Boolean).join(" ")}>
      {shine && (
        <span aria-hidden="true" className="launch-logo__shine launch-logo__shine--halo">
          <svg viewBox={LOGO_VIEWBOX} focusable="false">
            <LogoShapes letters="#ffe2d2" mark="#ff7a3d" />
          </svg>
        </span>
      )}
      <svg viewBox={LOGO_VIEWBOX} role="img" aria-label={BRAND_NAME} className="launch-logo__svg">
        <LogoShapes letters={LETTERS_FILL} mark={BRAND_ORANGE} />
      </svg>
      {shine && (
        <span aria-hidden="true" className="launch-logo__shine launch-logo__shine--gloss">
          <svg viewBox={LOGO_VIEWBOX} focusable="false">
            <LogoShapes letters="#fff6ef" mark="#ffb994" />
          </svg>
        </span>
      )}
    </span>
  );
}
