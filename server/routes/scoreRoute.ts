import { Router } from 'express';
import { compatibilityChain } from '../ai/chains/compatibilityChain';

const router = Router();

/**
 * POST /api/score
 * Generates compatibility scores using AI analysis
 */
router.post('/score', async (req, res) => {
  try {
    const { question } = req.body;

    // Validate request
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Question is required and must be a string'
      });
    }

    // Process the scoring request through AI chain
    const response = await compatibilityChain.invoke({ query: question });
    
    // Parse and return the AI response
    const scoreData = JSON.parse(response.content as string);
    
    res.json({
      success: true,
      data: scoreData
    });

  } catch (error) {
    // Handle parsing errors specifically
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: 'Failed to parse AI response',
        details: 'Invalid JSON response from compatibility chain'
      });
    }

    // Handle general errors
    res.status(500).json({
      error: 'Failed to process score request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
