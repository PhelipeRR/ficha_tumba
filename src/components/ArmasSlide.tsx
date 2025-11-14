import React, { useState } from "react";

export interface Arma {
  src: string;
  alt: string;
}

interface ArmasSlideProps {
  armas: Arma[];
  position: React.CSSProperties;
  className?: string;
}

const ArmasSlide: React.FC<ArmasSlideProps> = ({ armas, position, className }) => {
  const [index, setIndex] = useState(0);

  const proxima = () => setIndex((i) => (i + 1) % armas.length);
  const anterior = () => setIndex((i) => (i - 1 + armas.length) % armas.length);

  return (
    <div
      className={`armas group absolute flex flex-col items-center ${className ?? ""}`}
      style={position}
    >
      <img
        key={index}
        src={armas[index].src}
        alt={armas[index].alt}
        className="transition-opacity duration-500 w-full scale-x-[-1] relative z-10"
        style={{ borderRadius: "0px 0px 33px 0px" }}
      />

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
