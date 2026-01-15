import { useMemo } from "react";
import type { AttrKey } from "../../types/types";

interface ManaByClass {
  porNivel: number;
  modAtributo?: AttrKey;
}

const MANA_POR_CLASSE: Record<string, ManaByClass> = {
  arcanista: { porNivel: 6, modAtributo: "int" },
  barbaro: { porNivel: 6 },
  bardo: { porNivel: 3, modAtributo: "car" },
  bucaneiro: { porNivel: 4 },
  cacador: { porNivel: 4 },
  cavaleiro: { porNivel: 5 },
  clerigo: { porNivel: 4, modAtributo: "sab" },
  druida: { porNivel: 4 },
  frade: { porNivel: 4 },
  guerreiro: { porNivel: 5 },
  inventor: { porNivel: 3 },
  ladino: { porNivel: 3 },
  lutador: { porNivel: 5 },
  nobre: { porNivel: 4 },
  paladino: { porNivel: 5 },
  pajem: { porNivel: 3 },
};

export function useMana(
  selectedClass: string,
  nivel: number,
  attrs: Record<AttrKey, number>
) {
  return useMemo(() => {
    const classe = MANA_POR_CLASSE[selectedClass];
    if (!classe) return 0;

    const nivelValido = Math.max(nivel, 1);
    const modAtributo = classe.modAtributo
      ? Number(attrs[classe.modAtributo]) || 0
      : 0;

    return classe.porNivel * nivelValido + modAtributo;
  }, [selectedClass, nivel, attrs]);
}
