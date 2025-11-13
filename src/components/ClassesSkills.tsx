import React from "react";

interface Props {
  onSelectClass: (classe: string) => void;
  value?: string;
}

const ClassesSelect: React.FC<Props> = ({ onSelectClass, value }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectClass(e.target.value);
  };

  return (
    <div>
      <select name="classes" id="classes_icon" onChange={handleChange} value={value ?? ""}>
        <option value="">Selecione uma classe</option>
        <option value="arcanista">Arcanista</option>
        <option value="barbaro">Bárbaro</option>
        <option value="bardo">Bardo</option>
        <option value="bucaneiro">Bucaneiro</option>
        <option value="cacador">Caçador</option>
        <option value="cavaleiro">Cavaleiro</option>
        <option value="clerigo">Clérigo</option>
        <option value="druida">Druida</option>
        <option value="frade">Frade</option>
        <option value="guerreiro">Guerreiro</option>
        <option value="inventor">Inventor</option>
        <option value="ladino">Ladino</option>
        <option value="lutador">Lutador</option>
        <option value="nobre">Nobre</option>
        <option value="paladino">Paladino</option>
        <option value="pajem">Pajem</option>
      </select>
    </div>
  );
};

export default ClassesSelect;
