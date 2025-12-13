import React from "react";

interface Props {
  onSelectDeus: (deus: string) => void;
  value?: string;
}

const DeusesSelect: React.FC<Props> = ({ onSelectDeus, value }) => {
  return (
    <div>
      <select
        className="deuses-select"
        id="deuses_icon"
        onChange={(e) => onSelectDeus(e.target.value)}
        value={value ?? ""}
      >
        <option value="">Selecione um deus</option>
        {Object.keys({
          aharadak: "",
          allihanna: "",
          arsenal: "",
          azgher: "",
          hynnin: "",
          kallyadranoch: "",
          khalmyr: "",
          lena: "",
          linwu: "",
          marah: "",
          megalokk: "",
          nimb: "",
          oceano: "",
          sszzaas: "",
          tannatoh: "",
          tenebra: "",
          thyatis: "",
          thwor: "",
          valkaria: "",
          wynna: "",
        }).map((deus) => (
          <option key={deus} value={deus}>
            {deus.charAt(0).toUpperCase() + deus.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DeusesSelect;
