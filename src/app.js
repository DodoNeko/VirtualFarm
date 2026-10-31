import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import routes from "./routes/index.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "../src/templates")
));


app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../src/templates/index.html")
    );
});

app.get("/profile/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../src/templates/pages/profile.html")
    );
});

app.get("/garden/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../src/templates/pages/garden.html")
    );
});

app.use("/api", routes);

export default app;
