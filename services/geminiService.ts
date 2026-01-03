import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Mood, RecipeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the structured response
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isFoodDetected: {
      type: Type.BOOLEAN,
      description: "True if food ingredients are detected in the image, false otherwise.",
    },
    humorousComment: {
      type: Type.STRING,
      description: "A funny comment. If no food is found, roast the user. If food is found, a short witty intro.",
    },
    title: {
      type: Type.STRING,
      description: "The name of the generated recipe.",
    },
    ingredientsDetected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ingredients seen in the photo.",
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step cooking instructions.",
    },
    timeEstimate: {
      type: Type.STRING,
      description: "Estimated preparation and cooking time.",
    },
    macros: {
      type: Type.STRING,
      description: "Brief nutritional info (e.g. 'High Protein, approx 400kcal').",
    },
  },
  required: ["isFoodDetected", "humorousComment"],
};

export const generateRecipeFromImage = async (
  base64Image: string,
  mood: Mood
): Promise<RecipeData> => {
  try {
    // Remove the data URL prefix if present to get just the base64 string
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `
      Actúa como el 'Cocinero Fantasma'. Analiza esta imagen.
      
      El usuario ha elegido el modo: ${mood}.
      
      1. Identifica qué ingredientes hay en la foto.
      2. Si NO ves comida o ingredientes claros, establece 'isFoodDetected' en false y haz un comentario gracioso (roast) en 'humorousComment'.
      3. Si ves comida, genera una receta basada ÚNICAMENTE en lo que ves (y básicos de despensa como aceite, sal, agua).
      4. Ajusta la complejidad y estilo de la receta al modo seleccionado (${mood}).
         - Supervivencia: Lo más simple y rápido posible.
         - Gourmet: Técnicas sofisticadas, descripciones elegantes.
         - Fitness: Enfocado en macros, saludable.
         - Resaca: Grasoso, reconfortante, fácil de comer.
      
      Responde estrictamente en JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as RecipeData;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("No se pudo conectar con el Cocinero Fantasma. Inténtalo de nuevo.");
  }
};