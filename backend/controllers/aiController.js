const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc generate interview questions and answers using Gemini
// @route post /api/ai/generate-questions
// @access private
const generateInterviewQuestions = async (req, res) => {
  try {
    console.log("=== generateInterviewQuestions called ===");
    console.log("Request body:", req.body);

    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      console.warn("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    console.log("Generated prompt:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("Raw AI response:", response.text);

    const cleanedText = response.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    console.log("Cleaned AI text:", cleanedText);

    // Safe JSON parsing
    let data;
    try {
      data = JSON.parse(cleanedText);
      console.log("Parsed AI data:", data);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawText: cleanedText,
        error: err.message,
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc generate explanation for an interview question
// @route post /api/ai/generate-explanation
// @access private
const generateConceptExplanation = async (req, res) => {
  try {
    console.log("=== generateConceptExplanation called ===");
    console.log("Request body:", req.body);

    const { question } = req.body;
    if (!question) {
      console.warn("Missing required field: question");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);
    console.log("Generated prompt for explanation:", prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("Raw AI response:", response.text);

    const cleanedText = response.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    console.log("Cleaned AI text:", cleanedText);

    // Safe JSON parsing
    let data;
    try {
      data = JSON.parse(cleanedText);
      console.log("Parsed AI data:", data);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(500).json({
        message: "Failed to parse AI response",
        rawText: cleanedText,
        error: err.message,
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
