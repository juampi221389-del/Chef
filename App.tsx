import React, { useState, useRef } from 'react';
import { Mood, RecipeData } from './types';
import { generateRecipeFromImage } from './services/geminiService';
import MoodSelector from './components/MoodSelector';
import RecipeCard from './components/RecipeCard';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>(Mood.SURVIVAL);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen es demasiado grande. Intenta con una menor a 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setRecipe(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateRecipeFromImage(image, mood);
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setRecipe(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">👻</span>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Cocinero Fantasma
            </h1>
          </div>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-600">v1.0</a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* Intro Text */}
        {!recipe && (
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              ¿Qué cocino hoy?
            </h2>
            <p className="text-lg text-gray-500 max-w-lg mx-auto">
              Sube una foto de los ingredientes que tengas (o de tu nevera abierta) y deja que la IA invente la receta perfecta.
            </p>
          </div>
        )}

        {/* Input Section */}
        {!recipe && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all hover:shadow-xl">
            
            {/* Image Preview Area */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-3 uppercase tracking-wider">
                1. Tus Ingredientes
              </label>
              
              <div 
                className={`
                  relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden transition-colors
                  ${image ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'}
                `}
                onClick={() => !image && fileInputRef.current?.click()}
              >
                {image ? (
                  <>
                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="p-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-orange-600 hover:text-orange-500">Sube una foto</span> o tómala ahora
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Mood Selector */}
            <MoodSelector 
              selectedMood={mood} 
              onSelectMood={setMood} 
              disabled={isLoading}
            />

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!image || isLoading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform
                flex items-center justify-center gap-2
                ${!image || isLoading 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-200 hover:-translate-y-1 active:translate-y-0'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  El Chef está pensando...
                </>
              ) : (
                <>
                  🔥 Generar Receta
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {recipe && (
          <RecipeCard data={recipe} onReset={handleReset} />
        )}

      </main>
      
      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 mt-16 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Cocinero Fantasma. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
