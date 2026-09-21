require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.list();
    console.log("Models:");
    for await (const m of res) {
      console.log(m.name);
    }
  } catch (err) {
    console.error(err);
  }
}
test();
