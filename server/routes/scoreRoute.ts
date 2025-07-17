import { Router, Request, Response } from "express";
import { compatibilityChain } from "../ai/chains/compatibilityChain";

const router = Router();

router.post("/score", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const response = await compatibilityChain.invoke({ query: question });
    res.json(JSON.parse(response.content as string));
  } catch (error) {
    res.status(500).json({ error: "Failed to process score request" });
  }
});

export default router;
