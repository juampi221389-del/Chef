import React from 'react';
import { RecipeData } from '../types';

interface RecipeCardProps {
  data: RecipeData;
  onReset: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ data, onReset }) => {
  if (!data.isFoodDetected) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-3xl">👻</div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-red-800">Ups, no veo comida...</h3>
            <p className="mt-2 text-red-700 italic">"{data.humorousComment}"</p>
            <button 
              onClick={onReset}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded transition-colors"
            >
              Intentar otra foto
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8 animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
          {data.timeEstimate && (
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              ⏱️ {data.timeEstimate}
            </span>
          )}
          {data.macros && (
            <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              🔥 {data.macros}
            </span>
          )}
        </div>
        {data.humorousComment && (
          <div className="mt-4 italic text-orange-50 border-l-2 border-white/40 pl-3 text-sm">
            👻 "{data.humorousComment}"
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        {/* Ingredients */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4 border-gray-100">
            Ingredientes Detectados
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.ingredientsDetected?.map((ing, idx) => (
              <li key={idx} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded">
                <span className="text-green-500 mr-2">✓</span> {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide border-b pb-2 mb-4 border-gray-100">
            Instrucciones
          </h3>
          <div className="space-y-6">
            {data.steps?.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-600 leading-relaxed mt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
          <button
            onClick={onReset}
            className="group flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Cocinar otra cosa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
