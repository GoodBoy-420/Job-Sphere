import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import connectDB from "./utils/db.js";


const app = express();

//build in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDB();
});
