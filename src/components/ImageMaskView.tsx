"use client";
import React, { useEffect, useMemo, useState } from "react";

interface ImageMaskViewProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  maskUrl?: string;

  // pan (agora em "percentuais livres", sem ficar preso em -100..100)
  posX?: number;
  posY?: number;

  // zoom em %
  zoom?: number;

  // ✅ NOVO: tamanho REAL da área que você quer considerar (não A4)
  // Use valores próximos do tamanho “útil” do buraco da máscara.
  // Se você não passar, cai nos defaults (bons pro seu print da máscara).
  maskWidth?: number;  // default 650
  maskHeight?: number; // default 900

  // ✅ NOVO: controla o quanto o pan mexe (posX/posY viram "pontos percentuais")
  // Ex: posX=0 => 50% (centro). posX=100 => 150% (bem pra direita)
  // Assim você pode passar -300..300 no slider e fica MUITO mais maleável.
  panMin?: number; // default -300
  panMax?: number; // default 300

  // ✅ NOVO: se quiser, força a âncora inicial (senão fica no centro real)
  anchorX?: number; // default 50
  anchorY?: number; // default 50
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const ImageMaskView: React.FC<ImageMaskViewProps> = ({
  src,
  className = "masked-print masked-image",
  style,
  maskUrl = "/masks/personagem-1.png",

  posX = 0,
  posY = 0,
  zoom = 100,

  maskWidth = 650,
  maskHeight = 900,

  panMin = -300,
  panMax = 300,

  anchorX = 50,
  anchorY = 50,
}) => {
  if (!src) return null;

  // ✅ Aqui está a correção: o "container" do cálculo não é A4.
  // Ele é a área que você quer tratar como referência de enquadramento.
  const boxW = maskWidth;
  const boxH = maskHeight;

  // meta da imagem (se quiser usar no futuro; deixei porque você já tinha)
  const [imgMeta, setImgMeta] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let alive = true;
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.src = src;
    im.onload = () => {
      if (!alive) return;
      setImgMeta({ w: im.width || 1, h: im.height || 1 });
    };
    return () => {
      alive = false;
    };
  }, [src]);

  // zoom
  const s = zoom / 100;
  const imgW = boxW * s;
  const imgH = boxH * s;

  // ✅ pan muito mais solto (você pode usar -300..300 no slider tranquilamente)
  const nx = clamp(posX, panMin, panMax);
  const ny = clamp(posY, panMin, panMax);

  // ✅ NOVO: pan direto em background-position %
  // Em vez de "amarrar" com panScalePct, aqui o pan soma direto.
  // posX=0 => 50% (centro), posX=100 => 150%, posX=-200 => -150%, etc.
  const bgPosXPct = anchorX + nx;
  const bgPosYPct = anchorY + ny;

  // ===== Canvas: reproduz a regra do CSS background-position =====
  // offsetPx = (container - image) * (pos% / 100)
  const x = (boxW - imgW) * (bgPosXPct / 100);
  const y = (boxH - imgH) * (bgPosYPct / 100);

  const [printUrl, setPrintUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // ✅ DPI maior = melhor qualidade no print/export
    const dpi = 10;
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

      // desenha imagem “movida”
      ctx.drawImage(
        img,
        Math.round(x * dpi),
        Math.round(y * dpi),
        Math.round(imgW * dpi),
        Math.round(imgH * dpi)
      );

      // aplica máscara
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over";

      if (mounted) setPrintUrl(canvas.toDataURL("image/png"));
    };

    let imgLoaded = false;
    let maskLoaded = false;

    img.onload = () => {
      imgLoaded = true;
      if (maskLoaded) draw();
    };
    mask.onload = () => {
      maskLoaded = true;
      if (imgLoaded) draw();
    };

    return () => {
      mounted = false;
    };
  }, [src, maskUrl, x, y, imgW, imgH, boxW, boxH]);

  // (imgMeta não é usado agora, mas deixei carregado se você quiser ajustar defaults depois)
  useMemo(() => imgMeta, [imgMeta]);

  return (
    <>
      <div
        className={`${className} screen-only`}
        style={{
          backgroundImage: `url(${src})`,
          // ✅ agora é MUITO mais maleável
          backgroundPosition: `${bgPosXPct}% ${bgPosYPct}%`,
          backgroundSize: `${zoom}%`,
          ...(maskUrl
            ? ({ ["--mask-url" as any]: `url('${maskUrl}')` } as React.CSSProperties)
            : {}),
          ...style,
        }}
      />
      {printUrl && (
        <img className="imgUpload print-only" src={printUrl} alt="masked" />
      )}
    </>
  );
};

export default ImageMaskView;
