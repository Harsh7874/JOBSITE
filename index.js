import express from 'express'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import cors from "cors"
import userRouter from "./routes/userRoute.js";
import jobRouter from './routes/jobRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

const uploadDir = path.join(__dirname, 'uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 4000
connectDB()
// connectCloudinary()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)
app.use("/auth/job", jobRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });
  
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
