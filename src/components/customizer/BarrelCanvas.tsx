"use client";

import Image from "next/image";
import { CustomizationState } from "./BarrelCustomizer";

interface BarrelCanvasProps {
  customization: CustomizationState;
}

export default function BarrelCanvas({ customization }: BarrelCanvasProps) {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Conteneur principal avec superposition */}
      <div className="relative w-full h-full">
        
        {/* Image de base du baril */}
        <div className="absolute inset-0">
          <Image
            src="/customizer/base/barrel_base.png"
            alt="Baril de base"
            width={320}
            height={320}
            className="w-full h-full object-contain"
            style={{
              filter: `hue-rotate(${getHueRotation(customization.color)}) saturate(${getSaturation(customization.color)})`,
            }}
          />
        </div>

        {/* Couche de couleur avec mix-blend-mode */}
        <div 
          className="absolute inset-0 mix-blend-multiply"
          style={{ 
            backgroundColor: customization.color,
            opacity: 0.6
          }}
        />

        {/* Texture de finition */}
        {customization.texture !== 'mat' && (
          <div className="absolute inset-0">
            <Image
              src={`/customizer/textures/${customization.texture}.png`}
              alt={`Texture ${customization.texture}`}
              width={320}
              height={320}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Design central */}
        {customization.design !== 'none' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={`/customizer/designs/${customization.design}.png`}
              alt={`Design ${customization.design}`}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Indicateur de chargement si nécessaire */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg opacity-0 pointer-events-none">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );
}

// Fonctions utilitaires pour la conversion de couleur
function getHueRotation(hexColor: string): number {
  // Convertir hex en HSL et retourner la rotation de teinte
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.h;
}

function getSaturation(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 1;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl.s;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s, l };
}

