require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-8b',
      contents: 'hi',
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
