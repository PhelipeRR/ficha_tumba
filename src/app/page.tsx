"use client";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import RPGSheet from "../components/RPGSheet";
import ImageMaskView from "../components/ImageMaskView";
import ImageMaskControls from "../components/ImageMaskControls";
import ImageUploadPanel from "../components/ImageUploadPanel";

const STORAGE_KEY = "imagemask:v1";

export default function Home() {
  // ✅ agora o pan vai ser bem mais “solto”
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [zoom, setZoom] = useState(120); // ✅ começa um pouco maior ajuda

  const [imageSrc, setImageSrc] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => setImageSrc(String(evt.target?.result || ""));
    reader.readAsDataURL(file);

    setFileName(file.name);

    // ✅ reset inicial bom pra “centralizar”
    setPosX(0);
    setPosY(0);
    setZoom(120);
  };

  const handleReset = () => {
    setPosX(0);
    setPosY(0);
    setZoom(120);
  };

  // Carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (typeof data?.posX === "number") setPosX(data.posX);
      if (typeof data?.posY === "number") setPosY(data.posY);
      if (typeof data?.zoom === "number") setZoom(data.zoom);
      if (typeof data?.imageSrc === "string") setImageSrc(data.imageSrc);
      if (typeof data?.fileName === "string") setFileName(data.fileName);
    } catch {}
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    try {
      const payload = { posX, posY, zoom, imageSrc, fileName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [posX, posY, zoom, imageSrc, fileName]);

  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>

      <main className="flex-1 bg-background py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center gap-4">
            <section id="sheet">
              <RPGSheet isFlipped={isFlipped}>
                <ImageMaskView
                  src={imageSrc}
                  className="imgUpload masked-image"
                  posX={posX}
                  posY={posY}
                  zoom={zoom}
                  // ✅ ESSENCIAL: pare de “prender” em A4
                  // Ajuste fino se quiser: 650/900 foi baseado no seu print.
                  maskWidth={650}
                  maskHeight={900}
                  // ✅ limites grandes
                  panMin={-300}
                  panMax={300}
                  // ✅ âncora no centro real
                  anchorX={50}
                  anchorY={50}
                />
              </RPGSheet>
            </section>

            <div className="no-print">
              <section className="space-y-3">
                <ImageUploadPanel
                  onFileSelect={handleFileSelect}
                  filename={fileName}
                  previewSrc={imageSrc}
                  onClear={() => {
                    setImageSrc("");
                    setFileName("");
                    handleReset();
                  }}
                />

                <ImageMaskControls
                  posX={posX}
                  posY={posY}
                  zoom={zoom}
                  onPosXChange={setPosX}
                  onPosYChange={setPosY}
                  onZoomChange={setZoom}
                  onReset={handleReset}
                />

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90"
                >
                  Imprimir / PDF
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full bg-[#4e4122] text-white rounded-md px-4 py-2 transition-opacity hover:opacity-90 mt-2"
                >
                  {isFlipped ? "Voltar para Frente" : "Ir para o Verso"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const url =
                      "https://allmoving.com.br/wp-content/uploads/2026/01/ficha_equipamentos.png";

                    try {
                      const res = await fetch(url);
                      if (!res.ok) throw new Error(String(res.status));

                      const blob = await res.blob();
                      const blobUrl = window.URL.createObjectURL(blob);

                      const a = document.createElement("a");
                      a.href = blobUrl;
                      a.download = "ficha_equipamentos.png";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();

                      window.URL.revokeObjectURL(blobUrl);
                    } catch {
                      // Se CORS bloquear o fetch, abre o link direto
                      window.open(url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="w-full bg-[#1f2937] text-white rounded-md px-4 py-2 transition-opacity hover:opacity-90 mt-2"
                >
                  Baixar ficha de equipamentos
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
