import express from "express";
import { matchRouter } from "./routes/matches.js";

const app = express();
const PORT = process.env.PORT || 8000;

// ponytail: native express json middleware, no config
app.use(express.json());

app.get("/", (req, res) => res.send("sportz-backend running"));

app.use("/matches", matchRouter);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
