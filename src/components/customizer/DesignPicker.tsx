"use client";

import Image from "next/image";

interface DesignPickerProps {
  selectedDesign: string;
  onDesignChange: (design: string) => void;
}

const designs = [
  {
    id: 'none',
    name: 'Aucun design',
    description: 'Baril uni sans motif',
    preview: '/customizer/designs/none_preview.png'
  },
  {
    id: 'gengar',
    name: 'Gengar',
    description: 'Pokémon fantôme populaire',
    preview: '/customizer/designs/gengar_preview.png'
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    description: 'Pokémon électrique emblématique',
    preview: '/customizer/designs/pikachu_preview.png'
  },
  {
    id: 'charizard',
    name: 'Charizard',
    description: 'Dragon de feu légendaire',
    preview: '/customizer/designs/charizard_preview.png'
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    description: 'Pokémon psychique puissant',
    preview: '/customizer/designs/mewtwo_preview.png'
  },
  {
    id: 'logo_monbaril',
    name: 'Logo MonBaril',
    description: 'Logo officiel de la marque',
    preview: '/customizer/designs/logo_monbaril_preview.png'
  }
];

export default function DesignPicker({ selectedDesign, onDesignChange }: DesignPickerProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Choisissez votre design</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {designs.map((design) => (
          <button
            key={design.id}
            onClick={() => onDesignChange(design.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedDesign === design.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="space-y-2">
              {/* Aperçu du design */}
              <div className="w-full h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                  src={design.preview}
                  alt={`Aperçu ${design.name}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Informations */}
              <div className="text-center">
                <h5 className="font-medium text-gray-900 text-sm">{design.name}</h5>
                <p className="text-xs text-gray-600">{design.description}</p>
              </div>
              
              {/* Indicateur de sélection */}
              <div className="flex justify-center">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedDesign === design.id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-300'
                }`}>
                  {selectedDesign === design.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Description du design sélectionné */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Design sélectionné :</strong>{' '}
          {designs.find(d => d.id === selectedDesign)?.name} - {' '}
          {designs.find(d => d.id === selectedDesign)?.description}
        </p>
      </div>
    </div>
  );
}

