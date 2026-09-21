require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-pro-latest'];
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: 'hi',
      });
      console.log(`Success ${model}:`, response.text);
    } catch (err) {
      console.error(`Error ${model}:`, err.message);
    }
  }
}
test();
