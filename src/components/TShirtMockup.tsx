import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDesignState } from "../store/AppContext";

interface TShirtMockupProps {
  color: string;
  design?: string | null;
  material: string;
  size: string;
  side?: 'front' | 'back';
  onSideSwitch?: (side: 'front' | 'back') => void;
}

const TShirtMockup: React.FC<TShirtMockupProps> = ({
  color,
  design,
  material,
  size,
  side = 'front',
  onSideSwitch,
}) => {
  const [category, setCategory] = useState("T-shirt");
  const [selectedMaterial, setSelectedMaterial] = useState(material || "Cotton");
  const [selectedSize, setSelectedSize] = useState(size || "M");


  const getSizeScale = () => {
    switch (selectedSize) {
      case "XS": return "scale-75";
      case "S": return "scale-90";
      case "M": return "scale-100";
      case "L": return "scale-110";
      case "XL": return "scale-125";
      case "XXL": return "scale-140";
      case "3XL": return "scale-150";
      default: return "scale-100";
    }
  };

  // Use global design alignment state (PERSISTENT ACROSS NAVIGATION)
  const { currentAlignment, updateAlignment } = useDesignState();

  // Transition animation state
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rotateRef = useRef<HTMLDivElement | null>(null);



  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const box = rotateRef.current?.getBoundingClientRect();
    if (!box) return;

    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const startAngle = Math.atan2(startY - centerY, startX - centerX);
    const startRotation = currentAlignment.rotation;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentAngle = Math.atan2(
        moveEvent.clientY - centerY,
        moveEvent.clientX - centerX
      );
      const rotationDeg = (currentAngle - startAngle) * (180 / Math.PI);
      const newAlignment = {
        ...currentAlignment,
        rotation: startRotation + rotationDeg,
      };
      updateAlignment(newAlignment);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center h-full p-4 bg-white">
      {/* 🔘 Option selectors - moved directly below heading */}
      <div className="flex flex-wrap gap-3 mb-1 justify-center mt-2 items-center relative z-50">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition"
        >
          <option value="T-shirt">T-shirt</option>
          <option value="Hoodie">Hoodie</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Tank Top">Tank Top</option>
          <option value="Polo">Polo</option>
          <option value="Long Sleeve">Long Sleeve</option>
          <option value="Cropped Tee">Cropped Tee</option>
        </select>

        <select
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition"
        >
          <option value="Cotton">Cotton</option>
          <option value="Polyester">Polyester</option>
          <option value="Blended">Blended</option>
          <option value="Linen">Linen</option>
          <option value="Organic Cotton">Organic Cotton</option>
          <option value="Silk">Silk</option>
          <option value="Dry-Fit">Dry-Fit</option>
        </select>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition"
        >
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="3XL">3XL</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                onSideSwitch?.(side === 'front' ? 'back' : 'front');
                setTimeout(() => setIsTransitioning(false), 100);
              }, 100);
            }}
            disabled={isTransitioning}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {side === 'front' ? 'Back-print!' : 'Front-print!'}
          </button>
          <span className="text-xs text-gray-500 font-medium">
            {side === 'front' ? 'Front' : 'Back'}
          </span>
        </div>




      </div>



      {/* 🧢 Apparel Preview - positioned directly below dropdowns */}
      <div
        className={cn(
          "relative transition-all duration-500 transform origin-center bg-transparent",
          getSizeScale()
        )}
        style={{ 
          width: 560, 
          height: 700,
          marginTop: '-120px',
          marginBottom: 0,
          paddingTop: 0,
          backgroundColor: 'transparent'
        }}
      >
        {/* Navigation Arrows - Only show relevant arrow */}
        {onSideSwitch && (
          <>
            {/* Show left arrow only when on back (to go to front) */}
            {side === 'back' && (
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    onSideSwitch?.('front');
                    setTimeout(() => setIsTransitioning(false), 50);
                  }, 150);
                }}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                title="Switch to front"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {/* Show right arrow only when on front (to go to back) */}
            {side === 'front' && (
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    onSideSwitch?.('back');
                    setTimeout(() => setIsTransitioning(false), 50);
                  }, 150);
                }}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-2 bg-white/80 hover:bg-white border border-gray-200 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                title="Switch to back"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </>
        )}

        {/* Simple loading indicator during transition */}
        {isTransitioning && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/20">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* T-shirt Mockup Display - SHARED CONTAINER FOR BOTH FRONT AND BACK */}
        <div className={`absolute inset-0 bg-transparent transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {/* Base Shirt */}
          <img
            src={side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"}
            alt={`T-shirt ${side}`}
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
            draggable={false}
          />

          {/* Natural T-shirt Color Blending */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              backgroundColor: color,
              mixBlendMode: "multiply",
              opacity: color === "#FFFFFF" ? 0.1 : 0.8,
              maskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              WebkitMaskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
          
          {/* Fabric Depth and Fold Definition */}
          <div
            className="absolute inset-0 z-21 pointer-events-none"
            style={{
              backgroundColor: color === "#FFFFFF" ? "#f5f5f5" : color,
              mixBlendMode: "soft-light",
              opacity: 0.3,
              maskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              WebkitMaskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />

          {/* Subtle Fabric Texture Overlay */}
          <div
            className="absolute inset-0 z-22 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 70% 80%, rgba(0,0,0,0.05) 0%, transparent 50%)`,
              mixBlendMode: "overlay",
              opacity: 0.4,
              maskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              WebkitMaskImage: `url(${side === 'front' ? "/mockups/tshirt.png" : "/mockups/tshirtbp.png"})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />

          {/* Design Layer */}
          {design && (
            <Rnd
              bounds="parent"
              size={{ width: currentAlignment.width, height: currentAlignment.height }}
              position={{ x: currentAlignment.x, y: currentAlignment.y }}
              onDragStop={(_, d) => {
                const newAlignment = { ...currentAlignment, x: d.x, y: d.y };
                updateAlignment(newAlignment);
              }}
              onResizeStop={(_, __, ref, ___, position) => {
                const newAlignment = {
                  ...currentAlignment,
                  width: parseFloat(ref.style.width),
                  height: parseFloat(ref.style.height),
                  ...position,
                };
                updateAlignment(newAlignment);
              }}
              lockAspectRatio
              className="z-30 group"
            >
              <div
                ref={rotateRef}
                style={{
                  transform: `rotate(${currentAlignment.rotation}deg)`,
                  transformOrigin: "center center",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Base Design Layer - High Opacity for Color Preservation */}
                <img
                  src={design}
                  alt="Printed design"
                  className="w-full h-full object-contain rounded-sm select-none absolute inset-0"
                  draggable={false}
                  style={{
                    objectFit: "contain",
                    mixBlendMode: "normal",
                    opacity: 0.95,
                    filter: "contrast(1.08) brightness(1.02) saturate(1.05)",
                    userSelect: "none",
                  }}
                />

                {/* Fabric Integration Layer - Subtle Blending */}
                <img
                  src={design}
                  alt="Fabric integration layer"
                  className="w-full h-full object-contain rounded-sm select-none absolute inset-0 pointer-events-none"
                  draggable={false}
                  style={{
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    opacity: 0.15,
                    filter: "blur(0.3px)",
                    userSelect: "none",
                  }}
                />

                {/* Realistic Ink Absorption Effect */}
                <img
                  src={design}
                  alt="Ink absorption layer"
                  className="w-full h-full object-contain rounded-sm select-none absolute inset-0 pointer-events-none"
                  draggable={false}
                  style={{
                    objectFit: "contain",
                    mixBlendMode: "overlay",
                    opacity: 0.25,
                    filter: "blur(0.2px) brightness(0.95)",
                    userSelect: "none",
                  }}
                />

                {/* Subtle Shadow for Depth */}
                <img
                  src={design}
                  alt="Shadow layer"
                  className="w-full h-full object-contain rounded-sm select-none absolute inset-0 pointer-events-none"
                  draggable={false}
                  style={{
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    opacity: 0.08,
                    filter: "blur(1px) brightness(0.3)",
                    transform: "translate(1px, 1px)",
                    userSelect: "none",
                  }}
                />

                {/* Rotation handle */}
                <div
                  onMouseDown={handleMouseDown}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full cursor-grab opacity-0 group-hover:opacity-100 transition"
                  title="Rotate"
                />
              </div>
            </Rnd>
          )}
        </div>
      </div>
    </div>
  );
};

export default TShirtMockup;
