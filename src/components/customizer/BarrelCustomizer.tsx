"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import BarrelCanvas from "./BarrelCanvas";
import TexturePicker from "./TexturePicker";
import DesignPicker from "./DesignPicker";

export interface CustomizationState {
  color: string;
  texture: 'mat' | 'grain' | 'gloss';
  design: string;
}

const DEFAULT_CUSTOMIZATION: CustomizationState = {
  color: '#8B4513', // Brun par défaut
  texture: 'mat',
  design: 'none'
};

export default function BarrelCustomizer() {
  const [customization, setCustomization] = useState<CustomizationState>(DEFAULT_CUSTOMIZATION);
  const [activeTab, setActiveTab] = useState<'color' | 'texture' | 'design'>('color');

  const updateCustomization = (key: keyof CustomizationState, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zone de rendu */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Personnalisez votre baril
            </h2>
            <p className="text-gray-600">
              Voir le rendu en temps réel de vos modifications
            </p>
          </div>
          
          <div className="flex justify-center">
            <BarrelCanvas customization={customization} />
          </div>
        </div>

        {/* Panneau de contrôle */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options de personnalisation
            </h3>
            
            {/* Onglets */}
            <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1">
              <button
                onClick={() => setActiveTab('color')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'color'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Couleur
              </button>
              <button
                onClick={() => setActiveTab('texture')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'texture'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Finition
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'design'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Design
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="min-h-[300px]">
              {activeTab === 'color' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Choisissez votre couleur</h4>
                  <div className="flex justify-center">
                    <HexColorPicker
                      color={customization.color}
                      onChange={(color) => updateCustomization('color', color)}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Couleur sélectionnée :</p>
                    <div 
                      className="w-12 h-12 rounded-lg mx-auto border-2 border-gray-300"
                      style={{ backgroundColor: customization.color }}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      {customization.color.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'texture' && (
                <TexturePicker
                  selectedTexture={customization.texture}
                  onTextureChange={(texture) => updateCustomization('texture', texture)}
                />
              )}

              {activeTab === 'design' && (
                <DesignPicker
                  selectedDesign={customization.design}
                  onDesignChange={(design) => updateCustomization('design', design)}
                />
              )}
            </div>
          </div>

          {/* Résumé et actions */}
          <div className="bg-orange-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Votre personnalisation
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Couleur :</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: customization.color }}
                  />
                  <span className="font-medium">{customization.color.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Finition :</span>
                <span className="font-medium capitalize">{customization.texture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Design :</span>
                <span className="font-medium">
                  {customization.design === 'none' ? 'Aucun' : customization.design}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Ajouter au panier
              </button>
              <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50 py-3 px-6 rounded-lg font-medium transition-colors">
                Sauvegarder la configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

