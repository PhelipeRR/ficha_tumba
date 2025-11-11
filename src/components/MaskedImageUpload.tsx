import React, { useState } from "react";

const MaskedImageUpload: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [zoom, setZoom] = useState(100);

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setImageSrc(String(evt.target?.result || ""));
      reader.readAsDataURL(file);
      setPosX(50);
      setPosY(50);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#eee] gap-5 font-sans">
      <div className="relative w-[794px] h-[1123px] overflow-hidden border-2 border-[#333] bg-center bg-cover bg-[url('https://allmoving.com.br/wp-content/uploads/2025/11/bg.png')]">
        {imageSrc && (
          // 1. MUDANÇA: De <img> para <div>
          <div
            className="imgUpload masked-image"
            // 2. MUDANÇA: Usar 'backgroundImage' e 'backgroundPosition'
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: `${posX}% ${posY}%`,
              backgroundSize: `${zoom}%`,
            }}
          />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="text-[20px] font-[CloisterBlack]"
      />

      {imageSrc && (
        <div className="flex flex-col gap-2 p-4 bg-white rounded shadow-md w-96 font-sans">
          <div className="flex items-center gap-2">
            <label htmlFor="posX" className="w-20">Pos. Horizontal:</label>
            <input
              id="posX"
              type="range"
              min="0"
              max="100"
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10 text-right">{posX}%</span>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="posY" className="w-20">Pos. Vertical:</label>
            <input
              id="posY"
              type="range"
              min="0"
              max="100"
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10 text-right">{posY}%</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="zoom" className="w-20">Zoom:</label>
            <input
              id="zoom"
              type="range"
              min="80"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10 text-right">{zoom}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaskedImageUpload;