import React, { useState, useRef, useEffect } from "react";

interface Props {
  tipo: "Armadura" | "Escudo";
  onChange?: (data: { nome: string; valor: number; penalidade: number }) => void;
}

const EquipamentoInput: React.FC<Props> = ({ tipo, onChange }) => {
  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [penalidade, setPenalidade] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = () => {
    onChange?.({
      nome,
      valor: Number(valor) || 0,
      penalidade: Number(penalidade) || 0,
    });
  };

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // ajustar altura
    }
  }, [nome]);

  return (
    <div style={{ display: "flex", gap: "1em", alignItems: "flex-start", marginBottom: "1em" }}>
      {/* Nome da Armadura/Escudo */}
      <textarea
        ref={textareaRef}
        className="nomeArmadura"
        placeholder={tipo}
        value={nome}
        onChange={(e) => { setNome(e.target.value); handleChange(); }}
        style={{
          width: "10em",
          resize: "none",
          overflow: "hidden",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
        rows={1}
      />

      {/* Bônus de Defesa */}
      <input
        className="bonusDefesa"
        type="number"
        placeholder="Defesa"
        value={valor}
        onChange={(e) => { setValor(e.target.value); handleChange(); }}
        style={{ width: "4em" }}
      />

      {/* Penalidade */}
      <input
        className="penalidadeArmadura"
        type="number"
        placeholder="Penalidade"
        value={penalidade}
        onChange={(e) => { setPenalidade(e.target.value); handleChange(); }}
        style={{ width: "6em" }}
      />
    </div>
  );
};

export default EquipamentoInput;
