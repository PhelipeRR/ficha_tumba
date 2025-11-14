"use client";
import React, { useEffect, useState } from "react";

interface ImageMaskViewProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  maskUrl?: string;
  posX?: number;
  posY?: number;
  zoom?: number;
}

const ImageMaskView: React.FC<ImageMaskViewProps> = ({
  src,
  className = "imgUpload masked-image",
  style,
  maskUrl = "/masks/personagem-1.png",
  posX = 50,
  posY = 50,
  zoom = 100,
}) => {
  if (!src) return null;

  const boxW = 210;
  const boxH = 297;
  const s = zoom / 100;
  const imgW = boxW * s;
  const imgH = boxH * s;
  const nx = Math.max(-100, Math.min(100, posX));
  const ny = Math.max(-100, Math.min(100, posY));
  const x = (nx / 100) * (boxW - imgW) / 2;
  const y = (ny / 100) * (boxH - imgH) / 2;

  const [printUrl, setPrintUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const dpi = 10; // 210mm*10 = 2100px (boa definição, leve)
    const cw = Math.round(boxW * dpi);
    const ch = Math.round(boxH * dpi);
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const mask = new Image();
    mask.crossOrigin = "anonymous";
    mask.src = maskUrl;

    const draw = () => {
      ctx.clearRect(0, 0, cw, ch);
      const scale = dpi; // converter de mm para px
      ctx.drawImage(img, Math.round(x * scale), Math.round(y * scale), Math.round(imgW * scale), Math.round(imgH * scale));
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over";
      if (mounted) setPrintUrl(canvas.toDataURL("image/png"));
    };

    let imgLoaded = false;
    let maskLoaded = false;
    img.onload = () => { imgLoaded = true; if (maskLoaded) draw(); };
    mask.onload = () => { maskLoaded = true; if (imgLoaded) draw(); };

    return () => { mounted = false; };
  }, [src, maskUrl, x, y, imgW, imgH]);

  return (
    <>
      <div
        className={`${className} screen-only`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${posX}% ${posY}%`,
          backgroundSize: `${zoom}%`,
          ...(maskUrl ? ({ ["--mask-url" as any]: `url('${maskUrl}')` } as React.CSSProperties) : {}),
          ...style,
        }}
      />
      {printUrl && (
        <img
          className={`imgUpload print-only`}
          src={printUrl}
          alt="masked"
        />
      )}
    </>
  );
};

export default ImageMaskView;