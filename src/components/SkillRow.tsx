import React, { useState } from "react";
import type { AttrKey } from "../types/types";
import SkillOffset from "./SkillOffset";

interface Skill {
  nome: string;
}

interface SkillRowProps {
  skill: Skill;
  attribute: AttrKey;
  trained: boolean;
  value: number;
  nivel: number;

  onChange: (name: string, key: "trained" | "atr", val: boolean | AttrKey) => void;
}

const SkillRow: React.FC<SkillRowProps> = ({
  skill,
  attribute,
  trained,
  value,
  onChange,
}) => {
  const [offset, setOffset] = useState(0);
  const total = value + offset;

  return (
    <div className="skill-row">
      <input
        type="checkbox"
        className="trained"
        checked={trained}
        onChange={(e) =>
          onChange(skill.nome, "trained", e.target.checked)
        }
      />

      <div className="skill-name">{skill.nome}</div>

      <select
        className="atr"
        value={attribute}
        onChange={(e) =>
          onChange(skill.nome, "atr", e.target.value as AttrKey)
        }
      >
        <option value="for">For</option>
        <option value="des">Des</option>
        <option value="con">Con</option>
        <option value="int">Int</option>
        <option value="sab">Sab</option>
        <option value="car">Car</option>
      </select>

      {/* VALOR FINAL */}
      <input
  type="text"
  className="value"
  readOnly
  value={total >= 0 ? `+${total}` : total}
/>

      {/* COMPONENTE ISOLADO */}
      <SkillOffset
        value={offset}
        onChange={(delta) =>
          setOffset(o => o + delta)
        }
      />
    </div>
  );
};

export default SkillRow;
