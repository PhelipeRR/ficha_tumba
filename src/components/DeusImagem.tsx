import React from "react";

interface DeusImagemProps {
  deus?: string;
}

const IMAGENS_DEUSES: Record<string, string> = {
  aharadak: "/deuses/aharadak.png",
  allihanna: "/deuses/allihanna.png",
  arsenal: "/deuses/arsenal.png",
  azgher: "/deuses/azgher.png",
  hynnin: "/deuses/hynnin.png",
  kallyadranoch: "/deuses/kallyadranoch.png",
  khalmyr: "/deuses/khalmyr.png",
  lena: "/deuses/lena.png",
  linwu: "/deuses/linwu.png",
  marah: "/deuses/marah.png",
  megalokk: "/deuses/megalokk.png",
  nimb: "/deuses/nimb.png",
  oceano: "/deuses/oceano.png",
  sszzaas: "/deuses/sszzaas.png",
  tannatoh: "/deuses/tannatoh.png",
  tenebra: "/deuses/tenebra.png",
  thwor: "/deuses/thwor.png",
  thyatis: "/deuses/thyatis.png",
  valkaria: "/deuses/valkaria.png",
  wynna: "/deuses/wynna.png",
};

// Caminho da imagem padrão
const FALLBACK = "/deuses/tumba.png";

const DeusImagem: React.FC<DeusImagemProps> = ({ deus }) => {
  // se deus é vazio → usa fallback
  const imagem = deus && IMAGENS_DEUSES[deus] ? IMAGENS_DEUSES[deus] : FALLBACK;

  return (
    <img
      src={imagem}
      alt={deus || "nenhum-deus"}
      className="deus-imagem absolute transition-all duration-500"
    />
  );
};

export default DeusImagem;
