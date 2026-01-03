export enum Mood {
  SURVIVAL = 'Supervivencia 🛠️',
  GOURMET = 'Gourmet 🍷',
  FITNESS = 'Fitness 💪',
  HANGOVER = 'Resaca 🥴',
}

export interface RecipeData {
  isFoodDetected: boolean;
  title?: string;
  ingredientsDetected?: string[];
  missingIngredients?: string[];
  steps?: string[];
  timeEstimate?: string;
  macros?: string;
  humorousComment?: string;
}

export interface AppState {
  image: string | null; // Base64 string
  mood: Mood;
  isLoading: boolean;
  recipe: RecipeData | null;
  error: string | null;
}
