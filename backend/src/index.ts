import express from 'express';
import { appRouter } from './routes';
// import { errorHandler } from './middleware/errorMiddleware';
import dotenv from 'dotenv';
import cors from "cors";

const app = express();
app.use(express.json());
// app.use(errorHandler)
app.use(express.urlencoded({ extended: true }));


app.use(cors({origin: "http://localhost:5173", credentials: true})); 

dotenv.config();  // so that we can use process.env to access environment variables

app.use("/api", appRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
const PORT = process.env.PORT || 8000;

    app.listen(PORT, () =>
    console.log("Server is running on port " + PORT));