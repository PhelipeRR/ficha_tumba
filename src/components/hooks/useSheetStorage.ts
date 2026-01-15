import { useEffect } from "react";
import type { AttrKey, SkillBase } from "../../types/types";

const STORAGE_KEY = "rpgsheet:v1";

export function useSheetStorage(params: {
  attrs: Record<AttrKey, number>;
  nivel: number;
  nome: string;
  selectedClass: string;
  selectedDeus: string;
  skills: (SkillBase & { trained: boolean })[];
}) {
  const {
    attrs,
    nivel,
    nome,
    selectedClass,
    selectedDeus,
    skills,
  } = params;

  useEffect(() => {
    try {
      const payload = {
        attrs,
        nivel,
        nome,
        selectedClass,
        selectedDeus,
        skills: skills.map(({ nome, atr, trained }) => ({
          nome,
          atr,
          trained,
        })),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [attrs, nivel, nome, selectedClass, selectedDeus, skills]);
}
