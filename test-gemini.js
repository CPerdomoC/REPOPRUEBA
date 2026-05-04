const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key loaded, length:", apiKey ? apiKey.length : 0);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const result = await model.generateContent("Hola, prueba");
  console.log(result.response.text());
}

run();