import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBY4lBN8IKmLqgRgyH23lAcUKWEhD8c_Mc' });

// Helper to strip data:image/jpeg;base64, prefix
const getBase64 = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

const getMimeType = (dataUrl: string): string => {
  return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
};

/**
 * edits an image based on a text prompt using gemini-2.5-flash-image
 * This is used for both the "Time Travel" feature and the "Custom Edit" feature.
 */
export const editImageWithGemini = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const rawBase64 = getBase64(base64Image);
    const mimeType = getMimeType(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: rawBase64,
            },
          },
        ],
      },
      config: {
        // We do not set responseMimeType for this model as per guidelines
      }
    });

    // Extract the generated image
    // The response candidates content parts will contain the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

/**
 * Analyzes an image using gemini-3-pro-preview
 */
export const analyzeImageWithGemini = async (
  base64Image: string,
  prompt: string = "Analyze this image in detail. Describe the lighting, subjects, and mood."
): Promise<string> => {
  try {
    const rawBase64 = getBase64(base64Image);
    const mimeType = getMimeType(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: rawBase64,
            },
          },
        ],
      },
    });

    return response.text || "No analysis could be generated.";

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};