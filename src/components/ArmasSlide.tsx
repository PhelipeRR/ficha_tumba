import React, { useState } from "react";

const armas = [
  { src: "/machado_pesado.png", alt: "Machado Pesado" },
  { src: "/besta_simples.png", alt: "Besta" },
  { src: "/arco_simples.png", alt: "Arco Simples" },
  { src: "/adaga_simples.png", alt: "Arco Simples" },
  { src: "/rapieira_simples.png", alt: "Arco Simples" },
  { src: "/lanca_simples.png", alt: "Arco Simples" },
  { src: "/tridente_simples.png", alt: "Tridente Simples" },
  { src: "/cajado_aura.png", alt: "Tridente Simples" },
  { src: "/machado_pequeno.png", alt: "Tridente Simples" },
  { src: "/espada_curta.png", alt: "Tridente Simples" },
];

const ArmasSlide: React.FC = () => {
  const [index, setIndex] = useState(0);

  const proxima = () => setIndex((i) => (i + 1) % armas.length);
  const anterior = () => setIndex((i) => (i - 1 + armas.length) % armas.length);

  return (
    <div
      className="armas group absolute flex flex-col items-center"
      style={{
        bottom: "11.7em",
        left: "22.6em",
        width: "5em",
      }}
    >
      
      {/* Imagem da arma (virada pra direita) */}
      <img
        key={index}
        src={armas[index].src}
        alt={armas[index].alt}
        className="arma-um transition-opacity duration-500 w-full scale-x-[-1] relative z-10"
        style={{
            borderRadius: "0px 0px 33px 0px",
        }}
      />

      {/* Botões (aparecem só no hover) */}
      <div className="w-full flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={anterior}
          className="bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition"
        >
          ◀
        </button>
        <button
          onClick={proxima}
          className="bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ArmasSlide;
