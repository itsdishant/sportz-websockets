import express from "express";
import { matchRouter } from "./routes/matches.js";

const app = express();

// ponytail: native express json middleware, no config
app.use(express.json());

app.get("/", (req, res) => res.send("sportz-backend running"));

app.use("/matches", matchRouter);

app.listen(8000, () => console.log("http://localhost:8000"));
