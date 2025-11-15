import React from "react";

interface ClasseImagemProps {
  classe?: string;
}

const IMAGENS_CLASSES: Record<string, string> = {
  arcanista: "/classes/arcanista.png",
  barbaro: "/classes/barbaro.png",
  bardo: "/classes/bardo.png",
  bucaneiro: "/classes/bucaneiro.png",
  cacador: "/classes/cacador.png",
  cavaleiro: "/classes/cavaleiro.png",
  clerigo: "/classes/clerigo.png",
  druida: "/classes/druida.png",
  frade: "/classes/frade.png",
  guerreiro: "/classes/guerreiro.png",
  inventor: "/classes/inventor.png",
  ladino: "/classes/ladino.png",
  lutador: "/classes/lutador.png",
  nobre: "/classes/nobre.png",
  paladino: "/classes/paladino.png",
  pajem: "/classes/pajem.png",
};

const ClasseImagem: React.FC<ClasseImagemProps> = ({ classe }) => {
  if (!classe || !IMAGENS_CLASSES[classe]) return null;

  return (
    <img
      src={IMAGENS_CLASSES[classe]}
      alt={classe}
      className="classe-imagem absolute transition-all duration-500"
    />
  );
};

export default ClasseImagem;
