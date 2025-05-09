import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicaionRoute from "./routes/application.route.js";
import adminRoute from "./routes/admin.route.js";
import bookmarkRoute from "./routes/bookmark.route.js";
import notificationRoute from "./routes/notification.route.js";

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

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicaionRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/bookmark", bookmarkRoute);
app.use("/api/v1/notification", notificationRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDB();
});
