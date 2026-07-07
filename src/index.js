import express from "express";
import http from "http";

import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => res.send("sportz-backend running"));

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(httpServer);

app.locals.broadcastMatchCreated = broadcastMatchCreated;

httpServer.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server running at ${baseUrl}`);
  console.log(`Websocket running at ${baseUrl.replace("http", "ws")}/ws`);
});
