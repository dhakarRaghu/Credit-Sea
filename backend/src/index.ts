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

const PORT = process.env.PORT || 8000;

    app.listen(PORT, () =>
    console.log("Server is running on port " + PORT));