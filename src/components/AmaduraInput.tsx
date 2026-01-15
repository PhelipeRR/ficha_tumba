import React from "react";

type Equipamento = {
  nome: string;
  defesa: number;
  penalidade: number;
  rd: number;
};

interface Props {
  tipo: "Armadura" | "Escudo";
  value: Equipamento;
  onChange: (data: Equipamento) => void;
}

const EquipamentoInput: React.FC<Props> = ({ tipo, value, onChange }) => {
  return (
    <div className="flex gap-3 items-end equipamento-inputs">
      <input
        type="text"
        className={`nomeEquip ${value.nome ? "filled" : ""}`}
        placeholder={tipo}
        value={value.nome}
        onChange={(e) => onChange({ ...value, nome: e.target.value })}
      />

      <input
        type="number"
        className={`defEquip ${value.defesa ? "filled" : ""}`}
        placeholder="Def"
        value={value.defesa === 0 ? "" : String(value.defesa)}
        onChange={(e) =>
          onChange({ ...value, defesa: Number(e.target.value) || 0 })
        }
      />

      <input
        type="number"
        className={`penEquip ${value.penalidade ? "filled" : ""}`}
        placeholder="Pen"
        value={value.penalidade === 0 ? "" : String(value.penalidade)}
        onChange={(e) =>
          onChange({ ...value, penalidade: Number(e.target.value) || 0 })
        }
      />

      <input
        type="number"
        className={`rdEquip ${value.rd ? "filled" : ""}`}
        placeholder="RD"
        value={value.rd === 0 ? "" : String(value.rd)}
        onChange={(e) => onChange({ ...value, rd: Number(e.target.value) || 0 })}
      />
    </div>
  );
};

export default EquipamentoInput;
