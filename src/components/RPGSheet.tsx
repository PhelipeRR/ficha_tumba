"use client";
import React, { useMemo, useState } from "react";
import SkillRow from "./SkillRow";
import type { AttrKey, SkillBase } from "../types/types";
import ClassesSelect from "./ClassesSkills";


const SKILLS: SkillBase[] = [
  { nome: "Acrobacia", atr: "des" },
  { nome: "Adestramento", atr: "car" },
  { nome: "Atletismo", atr: "for" },
  { nome: "Atuação", atr: "car" },
  { nome: "Cavalgar", atr: "des" },
  { nome: "Conhecimento", atr: "int" },
  { nome: "Cura", atr: "sab" },
  { nome: "Diplomacia", atr: "car" },
  { nome: "Enganação", atr: "car" },
  { nome: "Fortitude", atr: "con" },
  { nome: "Furtividade", atr: "des" },
  { nome: "Guerra", atr: "int" },
  { nome: "Iniciativa", atr: "des" },
  { nome: "Intimidação", atr: "car" },
  { nome: "Intuição", atr: "sab" },
  { nome: "Investigação", atr: "int" },
  { nome: "Ladinagem", atr: "des" },
  { nome: "Luta", atr: "for" },
  { nome: "Misticismo", atr: "int" },
  { nome: "Nobreza", atr: "int" },
  { nome: "Ofício 1", atr: "int" },
  { nome: "Ofício 2", atr: "int" },
  { nome: "Percepção", atr: "sab" },
  { nome: "Pilotagem", atr: "des" },
  { nome: "Pontaria", atr: "des" },
  { nome: "Reflexos", atr: "des" },
  { nome: "Religião", atr: "sab" },
  { nome: "Sobrevivência", atr: "sab" },
  { nome: "Vontade", atr: "sab" },
];

interface RPGSheetProps {
  children?: React.ReactNode;
}

const RPGSheet: React.FC<RPGSheetProps> = ({ children }) => {
  const [attrs, setAttrs] = useState<Record<AttrKey, number>>({
    des: 0,
    for: 0,
    con: 0,
    int: 0,
    sab: 0,
    car: 0,
  });

  const [nivel, setNivel] = useState(0);
  const [skills, setSkills] = useState<(SkillBase & { trained: boolean })[]>(
    SKILLS.map((s) => ({ ...s, trained: false }))
  );

  const handleClassSelect = (classe: string) => {
    const trainedByClass: Record<string, string[]> = {
      arcanista: ["Conhecimento", "Misticismo"],
      barbaro: ["Luta", "Fortitude"],
      bardo: ["Atuação", "Diplomacia", "Enganação"],
      bucaneiro: ["Pilotagem", "Acrobacia", "Reflexos"],
      cacador: ["Sobrevivência", "Percepção", "Furtividade"],
      cavaleiro: ["Cavalgar", "Guerra", "Fortitude"],
      clerigo: ["Religião", "Cura"],
      druida: ["Sobrevivência", "Natureza", "Cura"],
      frade: ["Luta", "Reflexos", "Vontade"],
      guerreiro: ["Luta", "Fortitude", "Reflexos"],
      inventor: ["Ofício 1", "Conhecimento", "Misticismo"],
      ladino: ["Furtividade", "Ladinagem", "Enganação"],
      lutador: ["Luta", "Atletismo"],
      nobre: ["Diplomacia", "Nobreza"],
      paladino: ["Religião", "Vontade"],
      pajem: ["Cura", "Intuição"],
    };

    const trainedSkills = trainedByClass[classe] || [];

    setSkills((prev) =>
      prev.map((s) => ({
        ...s,
        trained: trainedSkills.includes(s.nome),
      }))
    );
  };

  const computedSkills = useMemo(
    () =>
      skills.map((skill) => {
        const modAtrib = attrs[skill.atr] || 0;
        const bonusTreino = skill.trained ? Math.floor(nivel / 2) + 2 : 0;
        const total = modAtrib + bonusTreino;
        return { ...skill, value: total };
      }),
    [skills, attrs, nivel]
  );

  const handleAttrChange = (name: AttrKey, val: string) => {
    setAttrs((prev) => ({ ...prev, [name]: Number(val) || 0 }));
  };

  const handleSkillChange = (
    name: string,
    key: "trained" | "atr",
    val: boolean | AttrKey
  ) => {
    setSkills((prev) =>
      prev.map((s) => (s.nome === name ? { ...s, [key]: val as any } : s))
    );
  };

  return (
    <div className="sheet font-[CloisterBlack] relative">
      {children}
      {/* Coluna de perícias */}
      <div className="skills-column">
        {computedSkills.map((skill) => (
          <SkillRow
            key={skill.nome}
            skill={skill}
            attribute={skill.atr}
            trained={skill.trained}
            value={skill.value}
            onChange={handleSkillChange}
          />
        ))}
      </div>

      <ClassesSelect onSelectClass={handleClassSelect} />


      {/* Inputs de atributos - mesma posição do HTML original */}
      <div className="attr destreza">
        <input
          id="des"
          type="number"
          value={attrs.des}
          onChange={(e) => handleAttrChange("des", e.target.value)}
        />
      </div>

      <div className="attr forca">
        <input
          id="for"
          type="number"
          value={attrs.for}
          onChange={(e) => handleAttrChange("for", e.target.value)}
        />
      </div>

      <div className="attr constituicao">
        <input
          id="con"
          type="number"
          value={attrs.con}
          onChange={(e) => handleAttrChange("con", e.target.value)}
        />
      </div>

      <div className="attr inteligencia">
        <input
          id="int"
          type="number"
          value={attrs.int}
          onChange={(e) => handleAttrChange("int", e.target.value)}
        />
      </div>

      <div className="attr sabedoria">
        <input
          id="sab"
          type="number"
          value={attrs.sab}
          onChange={(e) => handleAttrChange("sab", e.target.value)}
        />
      </div>

      <div className="attr carisma">
        <input
          id="car"
          type="number"
          value={attrs.car}
          onChange={(e) => handleAttrChange("car", e.target.value)}
        />
      </div>

      {/* Nível */}
      <div className="level">
        <input
          id="nivel"
          type="number"
          value={nivel}
          onChange={(e) => setNivel(Number(e.target.value) || 0)}
        />
      </div>
    </div>
  );
};

export default RPGSheet;
