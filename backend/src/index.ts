import express from 'express';
import { appRouter } from './routes';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";
import { prisma } from './lib/db';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["https://creditsea.raghvendra.tech", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

dotenv.config();

app.use("/api", appRouter);

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

async function checkDBConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

checkDBConnection();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log("Server is running on port " + PORT)
);