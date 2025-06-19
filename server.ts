import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
  }),
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
