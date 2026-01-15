import { useMemo } from "react";
import type { AttrKey } from "../../types/types";

interface HPByClass {
  base: number;
  porNivel: number;
}

const HP_POR_CLASSE: Record<string, HPByClass> = {
  arcanista: { base: 8, porNivel: 2 },
  barbaro: { base: 24, porNivel: 6 },
  bardo: { base: 12, porNivel: 3 },
  bucaneiro: { base: 16, porNivel: 4 },
  cacador: { base: 16, porNivel: 4 },
  cavaleiro: { base: 20, porNivel: 5 },
  clerigo: { base: 16, porNivel: 4 },
  druida: { base: 16, porNivel: 4 },
  frade: { base: 16, porNivel: 4 },
  guerreiro: { base: 20, porNivel: 5 },
  inventor: { base: 12, porNivel: 3 },
  ladino: { base: 12, porNivel: 3 },
  lutador: { base: 20, porNivel: 5 },
  nobre: { base: 16, porNivel: 4 },
  paladino: { base: 20, porNivel: 5 },
  pajem: { base: 12, porNivel: 3 },
};

export function useHP(
  selectedClass: string,
  nivel: number,
  attrs: Record<AttrKey, number>
) {
  return useMemo(() => {
    const classe = HP_POR_CLASSE[selectedClass];
    if (!classe) return 0;

    const modCon = Number(attrs.con) || 0;
    const nivelValido = Math.max(nivel, 1);

    return (
      classe.base +
      modCon +
      (nivelValido - 1) * (classe.porNivel + modCon)
    );
  }, [selectedClass, nivel, attrs.con]);
}
