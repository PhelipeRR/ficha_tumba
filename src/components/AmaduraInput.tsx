import React, { useState } from "react";

interface Props {
  tipo: "Armadura" | "Escudo";
  onChange?: (data: {
    nome: string;
    defesa: number;
    penalidade: number;
    rd: number;
  }) => void;
}

const EquipamentoInput: React.FC<Props> = ({ tipo, onChange }) => {
  const [nome, setNome] = useState("");
  const [defesa, setDefesa] = useState("");
  const [penalidade, setPenalidade] = useState("");
  const [rd, setRd] = useState("");

  const update = (field: string, value: string) => {
    const novo = {
      nome: field === "nome" ? value : nome,
      defesa: field === "defesa" ? Number(value) || 0 : Number(defesa) || 0,
      penalidade: field === "penalidade" ? Number(value) || 0 : Number(penalidade) || 0,
      rd: field === "rd" ? Number(value) || 0 : Number(rd) || 0,
    };

    onChange?.(novo);
  };

  return (
    <div className="flex gap-3 items-end equipamento-inputs">
      <input
        type="text"
        className={`nomeEquip ${nome ? "filled" : ""}`}
        placeholder={tipo}
        value={nome}
        onChange={(e) => {
          setNome(e.target.value);
          update("nome", e.target.value);
        }}
      />

      <input
        type="number"
        className={`defEquip ${defesa ? "filled" : ""}`}
        placeholder="Def"
        value={defesa}
        onChange={(e) => {
          setDefesa(e.target.value);
          update("defesa", e.target.value);
        }}
      />

      <input
        type="number"
        className={`penEquip ${penalidade ? "filled" : ""}`}
        placeholder="Pen"
        value={penalidade}
        onChange={(e) => {
          setPenalidade(e.target.value);
          update("penalidade", e.target.value);
        }}
      />

      <input
        type="number"
        className={`rdEquip ${rd ? "filled" : ""}`}
        placeholder="RD"
        value={rd}
        onChange={(e) => {
          setRd(e.target.value);
          update("rd", e.target.value);
        }}
      />
    </div>
  );
};

export default EquipamentoInput;
