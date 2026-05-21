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
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are an expert legal advisor analyzing a document or case description.
    Analyze the provided text and evaluate its legal soundness, completeness, and structure.

    CRITICAL INSTRUCTION: If the provided text is NOT related to any legal matter, contract, or official document, you MUST assign a "score" of less than 60 (to trigger a red failure state). In the "analysisText", clearly state that the provided text is not a valid legal document, and populate the "issues" array with errors explaining this.

    You must return a JSON object with the following exact structure:
    {
      "score": <number between 0 and 100 representing the overall quality/soundness>,
      "analysisText": "<A professional and objective preliminary analysis summarizing the document/case>",
      "issues": [
        { "type": "<either 'error', 'warning', or 'success'>", "message": "<description of the issue or positive point>", "section": "<the section of the document this applies to>" }
      ],
      "suggestions": [
        "<actionable suggestion 1>"
      ]
    }

    Case Description:
    ${caseDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedData = JSON.parse(text);

    // Save the case and AI analysis to the database
    const newCase = await Case.create({
      user: req.user.id,
      description: caseDescription,
      analysis: parsedData.analysisText || "Analysis generated.",
    });

    res.status(201).json({
      _id: newCase._id,
      score: parsedData.score,
      analysis: parsedData.analysisText,
      issues: parsedData.issues,
      suggestions: parsedData.suggestions
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to generate AI analysis: ' + error.message);
  }
});

// @desc    Generate a legal document from a template
// @route   POST /api/ai/generate-template
// @access  Private
const generateTemplate = asyncHandler(async (req, res) => {
  const { templateTitle, formData } = req.body;

  if (!templateTitle || !formData) {
    res.status(400);
    throw new Error('Please provide template title and form data');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert legal document drafter. Generate a complete, professional, and formal legal document for a "${templateTitle}".
    
    Incorporate the following specific details provided by the client:
    ${JSON.stringify(formData, null, 2)}

    Format the document using standard HTML tags (like <h1>, <h2>, <p>, <strong>, <ul>, etc.) so it can be rendered beautifully on a web page. Do not include markdown blocks (like \`\`\`html). Just return the raw HTML.
    
    At the very bottom of the document, add a prominent disclaimer in a red or bold text box stating that this is an AI-generated draft template and MUST be reviewed by a qualified advocate or lawyer before signing or official use.
  `;

  try {
    const result = await model.generateContent(prompt);
    let htmlContent = result.response.text();
    
    // Clean up if Gemini adds markdown backticks
    htmlContent = htmlContent.replace(/^```html\n/, '').replace(/\n```$/, '');

    res.status(200).json({ html: htmlContent });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to generate document: ' + error.message);
  }
});

module.exports = { analyzeCase, generateTemplate };