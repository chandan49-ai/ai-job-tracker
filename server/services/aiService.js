const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

const generateAIResponse = async (prompt) => {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("AI Error:", error.message);
    throw new Error("AI service failed");
  }
};

module.exports = {
  generateAIResponse,
};