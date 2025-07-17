import express, { Request, Response } from "express";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute";
import scoreRoute from "./routes/scoreRoute";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", uploadRoute);
app.use("/api", scoreRoute);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));
