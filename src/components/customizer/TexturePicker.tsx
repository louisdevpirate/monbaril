"use client";

import Image from "next/image";

interface TexturePickerProps {
  selectedTexture: 'mat' | 'grain' | 'gloss';
  onTextureChange: (texture: 'mat' | 'grain' | 'gloss') => void;
}

const textures = [
  {
    id: 'mat' as const,
    name: 'Mat',
    description: 'Finition mate, sans reflet',
    preview: '/customizer/textures/mat_preview.png'
  },
  {
    id: 'grain' as const,
    name: 'Grain',
    description: 'Texture granuleuse, aspect naturel',
    preview: '/customizer/textures/grain_preview.png'
  },
  {
    id: 'gloss' as const,
    name: 'Brillant',
    description: 'Finition brillante, effet miroir',
    preview: '/customizer/textures/gloss_preview.png'
  }
];

export default function TexturePicker({ selectedTexture, onTextureChange }: TexturePickerProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Choisissez votre finition</h4>
      
      <div className="grid grid-cols-1 gap-3">
        {textures.map((texture) => (
          <button
            key={texture.id}
            onClick={() => onTextureChange(texture.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedTexture === texture.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Aperçu de la texture */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                  src={texture.preview}
                  alt={`Aperçu ${texture.name}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Informations */}
              <div className="flex-1 text-left">
                <h5 className="font-medium text-gray-900">{texture.name}</h5>
                <p className="text-sm text-gray-600">{texture.description}</p>
              </div>
              
              {/* Indicateur de sélection */}
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedTexture === texture.id
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-300'
              }`}>
                {selectedTexture === texture.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Description de la texture sélectionnée */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Finition {textures.find(t => t.id === selectedTexture)?.name} :</strong>{' '}
          {textures.find(t => t.id === selectedTexture)?.description}
        </p>
      </div>
    </div>
  );
}
