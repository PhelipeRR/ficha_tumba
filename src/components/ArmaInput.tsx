import React from "react";

interface WeaponInputsProps {
  weapon: {
    nome: string;
    ataque: string;
    critico: string;
    tipo: string;
    dano: string;
  };
  onChange: (weapon: WeaponInputsProps["weapon"]) => void;
  wrapperClass: string;
}

const WeaponInputs: React.FC<WeaponInputsProps> = ({ weapon, onChange, wrapperClass }) => {
  const handleChange = (field: keyof typeof weapon, value: string) => {
    onChange({ ...weapon, [field]: value });
  };

  const filled = (v: string) => (v.trim() !== "" ? "filled" : "");

  return (
    <div className={`arma-inputs ${wrapperClass}`}>
      {/* Linha 1 */}
      <div className="flex gap-3 items-end">
        <input
          type="text"
          value={weapon.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          className={`nome-arma bg-transparent border-b border-black/60 focus:outline-none ${filled(weapon.nome)}`}
        />

        <input
          type="text"
          value={weapon.ataque}
          onChange={(e) => handleChange("ataque", e.target.value)}
          className={`ataque-arma bg-transparent border-b border-black/60 focus:outline-none text-center ${filled(weapon.ataque)}`}
        />

        <input
          type="text"
          value={weapon.critico}
          onChange={(e) => handleChange("critico", e.target.value)}
          className={`crit-arma bg-transparent border-b border-black/60 focus:outline-none text-center ${filled(weapon.critico)}`}
        />
      </div>

      {/* Linha 2 */}
      <div className="flex gap-3 items-end">
        <input
          type="text"
          value={weapon.tipo}
          onChange={(e) => handleChange("tipo", e.target.value)}
          className={`tipo-arma bg-transparent border-b border-black/60 focus:outline-none ${filled(weapon.tipo)}`}
        />

        <input
          type="text"
          value={weapon.dano}
          onChange={(e) => handleChange("dano", e.target.value)}
          className={`dano-arma bg-transparent border-b border-black/60 focus:outline-none text-center ${filled(weapon.dano)}`}
        />
      </div>
    </div>
  );
};

export default WeaponInputs;
