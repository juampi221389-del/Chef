import React from 'react';
import { Mood } from '../types';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
  disabled: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood, disabled }) => {
  return (
    <div className="w-full mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wider">
        Selecciona tu Mood (Estado de Ánimo)
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.values(Mood).map((mood) => {
          const isSelected = selectedMood === mood;
          return (
            <button
              key={mood}
              onClick={() => onSelectMood(mood)}
              disabled={disabled}
              className={`
                relative overflow-hidden group p-3 rounded-xl border-2 transition-all duration-200 ease-in-out
                flex flex-col items-center justify-center gap-2 text-sm font-medium
                ${isSelected 
                  ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-gray-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-xl">{mood.split(' ').pop()}</span>
              <span className="text-center">{mood.split(' ').slice(0, -1).join(' ')}</span>
              {isSelected && (
                <div className="absolute inset-0 border-2 border-orange-500 rounded-xl pointer-events-none animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
