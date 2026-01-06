"use client";
import React, { useEffect, useMemo, useState } from "react";
import SkillRow from "./SkillRow";
import type { AttrKey, SkillBase } from "../types/types";
import ClassesSelect from "./ClassesSkills";
import ArmasSlide from "./ArmasSlide";
import ClasseImagem from "./ClasseImagem";
import EquipamentoInput from "./AmaduraInput";
import { armas1, armas2, armas3, armas4 } from "./armasListas";
import DeusImagem from "./DeusImagem";
import DeusesSelect from "./DeusesSelect";
import WeaponInputs from "./ArmaInput";
import ReusableInput from "./RacaOrigem";
import ReusableTextarea from "./ReusableTextArea";

import { useHP } from "./hooks/useHP";
import { useMana } from "./hooks/useMana";
import { useSheetStorage } from "./hooks/useSheetStorage";

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
  isFlipped?: boolean;
}

const STORAGE_KEY = "rpgsheet:v1";

const RPGSheet: React.FC<RPGSheetProps> = ({ children, isFlipped = false }) => {
  const [attrs, setAttrs] = useState<Record<AttrKey, number>>({
    des: 0,
    for: 0,
    con: 0,
    int: 0,
    sab: 0,
    car: 0,
  });

  const [spells, setSpells] = useState("");
  const [anotacoes, setAnotacoes] = useState("");
  const [poderes, setPoderes] = useState("");
  const [nivel, setNivel] = useState(0);
  const [skills, setSkills] = useState<(SkillBase & { trained: boolean })[]>(
    SKILLS.map((s) => ({ ...s, trained: false }))
  );
  const [hpOffset, setHpOffset] = useState(0);
  const [manaOffset, setManaOffset] = useState(0);

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDeus, setSelectedDeus] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [raca, setRaca] = useState("");
  const [origem, setOrigem] = useState("");
  const [jogador, setJogador] = useState("");
  const [armadura, setArmadura] = useState({
    nome: "",
    defesa: 0,
    penalidade: 0,
    rd: 0,
  });
  const [escudo, setEscudo] = useState({
    nome: "",
    defesa: 0,
    penalidade: 0,
    rd: 0,
  });
  const defesaTotal = 10 + armadura.defesa + escudo.defesa;
  const rdTotal = armadura.rd + escudo.rd;

  const [arma1, setArma1] = useState({
    nome: "",
    ataque: "",
    critico: "",
    tipo: "",
    dano: "",
  });

  const [arma2, setArma2] = useState({
    nome: "",
    ataque: "",
    critico: "",
    tipo: "",
    dano: "",
  });

  const [arma3, setArma3] = useState({
    nome: "",
    ataque: "",
    critico: "",
    tipo: "",
    dano: "",
  });

  const [arma4, setArma4] = useState({
    nome: "",
    ataque: "",
    critico: "",
    tipo: "",
    dano: "",
  });

  // Carregar estado salvo
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.attrs) setAttrs((prev) => ({ ...prev, ...data.attrs }));
      if (typeof data?.nivel === "number") setNivel(data.nivel);
      if (typeof data?.selectedClass === "string")
        setSelectedClass(data.selectedClass);
      if (typeof data?.selectedDeus === "string")
        setSelectedDeus(data.selectedDeus);
      if (typeof data?.nome === "string") setNome(data.nome);
      if (Array.isArray(data?.skills)) {
        const byName: Record<string, { atr: AttrKey; trained: boolean }> = {};
        data.skills.forEach((s: any) => {
          if (s?.nome && s?.atr)
            byName[s.nome] = { atr: s.atr, trained: !!s.trained };
        });
        setSkills((prev) =>
          prev.map((s) => ({
            ...s,
            atr: byName[s.nome]?.atr ?? s.atr,
            trained: byName[s.nome]?.trained ?? s.trained,
          }))
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = {
        attrs,
        nivel,
        selectedClass,
        selectedDeus,
        nome,
        skills: skills.map(({ nome, atr, trained }) => ({
          nome,
          atr,
          trained,
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [attrs, nivel, selectedClass, selectedDeus, nome, skills]);

  const handleClassSelect = (classe: string) => {
    setSelectedClass(classe);
    const trainedByClass: Record<string, string[]> = {
      arcanista: ["Vontade", "Misticismo"],
      barbaro: ["Luta", "Fortitude"],
      bardo: ["Atuação", "Reflexo"],
      bucaneiro: ["Luta", "Reflexos"],
      cacador: ["Sobrevivência", "Luta"],
      cavaleiro: ["Luta", "Fortitude"],
      clerigo: ["Religião", "Vontade"],
      druida: ["Sobrevivência", "Vontade"],
      frade: ["Religião", "Vontade"],
      guerreiro: ["Luta", "Fortitude"],
      inventor: ["Ofício 1", "Vontade"],
      ladino: ["Furtividade", "Ladinagem"],
      lutador: ["Luta", "Fortitude"],
      nobre: ["Diplomacia", "Vontade"],
      paladino: ["Luta", "Vontade"],
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

  const computedVida = useMemo(() => {
    const vidaPorClasse: Record<string, { base: number; porNivel: number }> = {
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

    const classe = vidaPorClasse[selectedClass];
    if (!classe) return 0;

    const modCon = Number(attrs.con) || 0;
    const nivelValido = Math.max(nivel, 1);

    // PV total = (base + modCon no 1º nível) + (níveis seguintes * (porNivel + modCon))
    return (
      classe.base + modCon + (nivelValido - 1) * (classe.porNivel + modCon)
    );
  }, [selectedClass, attrs.con, nivel]);

  const computedMana = useMemo(() => {
    const manaPorClasse: Record<
      string,
      { porNivel: number; modAtributo?: keyof typeof attrs }
    > = {
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

    const classe = manaPorClasse[selectedClass];
    if (!classe) return 0;

    const modAtributo = classe.modAtributo
      ? Number(attrs[classe.modAtributo]) || 0
      : 0;
    const nivelValido = Math.max(nivel, 1);

    // Mana total = (porNivel * nível) + modificador (somado apenas uma vez)
    return classe.porNivel * nivelValido + modAtributo;
  }, [selectedClass, attrs, nivel]);

  const hpTotal = computedVida + hpOffset;
  const manaTotal = computedMana + manaOffset;

  const computedSkills = useMemo(() => {
    const profBonus =
      nivel >= 1 && nivel <= 6
        ? 2
        : nivel >= 7 && nivel <= 14
        ? 4
        : nivel >= 15
        ? 6
        : 0;

    const halfLevel = Math.floor(nivel / 2);

    // Penalidade total vinda da armadura + escudo
    const penalidadeArmadura =
      (armadura?.penalidade || 0) + (escudo?.penalidade || 0);

    // Perícias que sofrem penalidade
    const periciasComPenalidade = [
      "acrobacia",
      "atletismo",
      "furtividade",
      "ladinagem",
    ];

    return skills.map((skill) => {
      const modAtrib = attrs[skill.atr] || 0;
      const treinoBonus = skill.trained ? profBonus : 0;

      let total = modAtrib + halfLevel + treinoBonus;

      // Aplica penalidade se a perícia estiver na lista
      if (periciasComPenalidade.includes(skill.nome.toLowerCase())) {
        total -= penalidadeArmadura;
      }

      return { ...skill, value: total };
    });
  }, [skills, attrs, nivel, armadura, escudo]);

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
    <div className={`sheet font-[CloisterBlack] ${isFlipped ? "flipped" : ""}`}>
      <div className="sheet-inner">
        {/* Frente da Ficha */}
        <div className="page-face page-front">
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

          <ClassesSelect
            onSelectClass={handleClassSelect}
            value={selectedClass}
          />
          <DeusesSelect onSelectDeus={setSelectedDeus} value={selectedDeus} />

          {/* Input de nome*/}
          <div className="nome_personagem">
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Bananilson Farofa"
            />
          </div>

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

          {/* HP */}
          <div className="hp">
            <button type="button" onClick={() => setHpOffset((v) => v - 1)}>
              -
            </button>

            <input id="hp" type="number" value={hpTotal} readOnly />

            <button type="button" onClick={() => setHpOffset((v) => v + 1)}>
              +
            </button>
          </div>

          {/* Mana */}
          <div className="mana">
            <button type="button" onClick={() => setManaOffset((v) => v - 1)}>
              -
            </button>

            <input id="mana" type="number" value={manaTotal} readOnly />

            <button type="button" onClick={() => setManaOffset((v) => v + 1)}>
              +
            </button>
          </div>

          <ReusableInput
            value={raca}
            onChange={setRaca}
            className="raca-input"
          />

          <ReusableInput
            value={origem}
            onChange={setOrigem}
            className="origem-input"
          />

          <ReusableInput
            value={jogador}
            onChange={setJogador}
            className="jogador-input"
          />

          {/* Slide de armas */}
          {/* Slide 1 */}
          <ArmasSlide
            armas={armas1}
            className="armas1"
            position={{
              bottom: "11.7em",
              left: "22.6em",
              width: "5em",
            }}
          />

          {/* Slide 2 */}
          <ArmasSlide
            armas={armas2}
            className="armas2"
            position={{
              bottom: "19.7em",
              left: "22.6em",
              width: "5em",
            }}
          />

          {/* Slide 3 */}
          <ArmasSlide
            armas={armas3}
            className="armas3"
            position={{
              bottom: "27.5em",
              left: "22.6em",
              width: "5em",
            }}
          />

          {/* Slide 4 */}
          <ArmasSlide
            armas={armas4}
            className="armas4"
            position={{
              bottom: "3.7em",
              left: "22.6em",
              width: "5em",
            }}
          />

          {/* Imagem da classe — reativa à seleção */}
          {selectedClass && (
            <ClasseImagem key={selectedClass} classe={selectedClass} />
          )}

          <DeusImagem deus={selectedDeus} />

          <WeaponInputs
            wrapperClass="arma1-inputs"
            weapon={arma1}
            onChange={setArma1}
          />

          <WeaponInputs
            wrapperClass="arma2-inputs"
            weapon={arma2}
            onChange={setArma2}
          />

          <WeaponInputs
            wrapperClass="arma3-inputs"
            weapon={arma3}
            onChange={setArma3}
          />

          <WeaponInputs
            wrapperClass="arma4-inputs"
            weapon={arma4}
            onChange={setArma4}
          />

          {/* Inputs de Armadura e Escudo */}
          <div className="armaduras">
            <EquipamentoInput
              tipo="Armadura"
              onChange={(data) => setArmadura(data)}
            />

            <EquipamentoInput
              tipo="Escudo"
              onChange={(data) => setEscudo(data)}
            />
          </div>

          {/* Total de Armadura e Escudo */}
          <div className="totais-armadura-escudo">
            <div className="defesa-total">
              <input type="number" readOnly value={defesaTotal} />
            </div>

            <div className="rd-total">
              <input type="number" readOnly value={rdTotal} />
            </div>
          </div>
        </div>

        {/* Verso da Ficha */}
        <div className="page-face page-back">
          <div
            className="p-8 text-center verso-spacer"
            style={{ paddingTop: "100px" }}
          ></div>
          <div className="verso-inputs">
            <ReusableTextarea
              value={spells}
              onChange={setSpells}
              className="magia-textarea"
              placeholder="Magias do personagem"
              rows={38}
            />

            <ReusableTextarea
              value={poderes}
              onChange={setPoderes}
              className="poderes-textarea"
              placeholder="Poderes do personagem"
              rows={38}
            />

            <ReusableTextarea
              value={anotacoes}
              onChange={setAnotacoes}
              className="anotacoes-textarea"
              placeholder="Anotações"
              rows={14}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RPGSheet;
