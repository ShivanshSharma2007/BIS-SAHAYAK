require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-1.5-flash-8b', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: 'hi',
      });
      console.log(`Success ${model}`);
    } catch (err) {
      console.error(`Error ${model}:`, err.message);
    }
  }
}
test();
