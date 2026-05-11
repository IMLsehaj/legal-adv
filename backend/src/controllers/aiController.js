const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Case } = require('../models');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('FATAL ERROR: GEMINI_API_KEY is not defined in your .env file. The server cannot start.');
}

// Initialize the Google Generative AI SDK using your environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Analyze a legal case and provide suggestions
// @route   POST /api/ai/analyze-case
// @access  Private
const analyzeCase = asyncHandler(async (req, res) => {
  const { caseDescription } = req.body;

  if (!caseDescription) {
    res.status(400);
    throw new Error('Please provide a case description');
  }

  // Use gemini-2.5-flash (Google retired the 1.0 and 1.5 models)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert legal advisor. Read the following case description and provide a preliminary analysis.
    Include potential legal issues, relevant areas of law, and suggested next steps for the client.
    Keep the tone professional and objective.

    Case Description:
    ${caseDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Save the case and AI analysis to the database
    const newCase = await Case.create({
      user: req.user.id,
      description: caseDescription,
      analysis: text,
    });

    res.status(201).json(newCase);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to generate AI analysis: ' + error.message);
  }
});

module.exports = { analyzeCase };