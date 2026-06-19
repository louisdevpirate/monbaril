"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import Image from "next/image";

export default function BarrelCustomizer() {
  const [color, setColor] = useState('#8B4513');
  const [texture, setTexture] = useState('mat');
  const [design, setDesign] = useState('none');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Personnalisez votre baril</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rendu du baril */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Image de base */}
            <Image
              src="/barils/baril1.png"
              alt="Baril"
              width={256}
              height={256}
              className="w-full h-full object-contain"
              style={{
                filter: `hue-rotate(${getHueRotation(color)}) saturate(${getSaturation(color)})`,
              }}
            />
            
            {/* Couche de couleur */}
            <div 
              className="absolute inset-0 mix-blend-multiply"
              style={{ 
                backgroundColor: color,
                opacity: 0.4
              }}
            />
          </div>
        </div>

        {/* Contrôles */}
        <div className="space-y-6">
          {/* Couleur */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Couleur</h3>
            <HexColorPicker color={color} onChange={setColor} />
            <p className="text-sm text-gray-600 mt-2">{color.toUpperCase()}</p>
          </div>

          {/* Texture */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Finition</h3>
            <div className="flex space-x-2">
              {['mat', 'grain', 'gloss'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTexture(t)}
                  className={`px-4 py-2 rounded-lg border ${
                    texture === t ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Design */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Design</h3>
            <div className="flex space-x-2">
              {['none', 'gengar', 'pikachu'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDesign(d)}
                  className={`px-4 py-2 rounded-lg border ${
                    design === d ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  {d === 'none' ? 'Aucun' : d}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

function getHueRotation(hexColor: string): number {
  // Conversion simple hex vers rotation de teinte
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;
  return (rgb.r + rgb.g + rgb.b) / 3;
}

function getSaturation(hexColor: string): number {
  return 1.2; // Saturation fixe pour simplifier
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

