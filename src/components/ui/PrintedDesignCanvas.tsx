import React, { useEffect, useRef } from "react";

interface PrintedDesignCanvasProps {
  designSrc: string;
  width: number;
  height: number;
}

const PrintedDesignCanvas: React.FC<PrintedDesignCanvasProps> = ({
  designSrc,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure a transparent canvas every render.
    canvas.width = width;
    canvas.height = height;
    canvas.style.background = "transparent";
    canvas.style.backgroundColor = "transparent";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = designSrc;

    img.onload = () => {
      // Fit the art into the canvas (contain)
      const ratio = Math.min(width / img.width, height / img.height);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const dx = (width - drawW) / 2;
      const dy = (height - drawH) / 2;

      // Draw the design as-is (no color math here)
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, dx, dy, drawW, drawH);

      // Subtle fabric modulation inside the design (optional, very light)
      // This adds microscopic variation to avoid a flat sticker look.
      // You can comment this out if you want pure art.
      const fabric = new Image();
      fabric.crossOrigin = "anonymous";
      fabric.src = "/textures/fabric.png";
      fabric.onload = () => {
        ctx.globalAlpha = 0.12;              // tiny effect
        ctx.globalCompositeOperation = "multiply";
        // tile the texture to cover the canvas
        const pat = ctx.createPattern(fabric, "repeat");
        if (pat) {
          ctx.fillStyle = pat as any;
          ctx.fillRect(0, 0, width, height);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      };
    };
  }, [designSrc, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: "block",
        background: "transparent !important",
        backgroundColor: "transparent !important"
      }}
    />
  );
};

export default PrintedDesignCanvas;
