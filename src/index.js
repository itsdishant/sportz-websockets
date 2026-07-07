import express from "express";
import http from "http";

import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const httpServer = http.createServer(app);
const { broadcastMatchCreated } = attachWebSocketServer(httpServer);

app.use(securityMiddleware());
app.use(express.json());
app.use("/matches", matchRouter);

app.get("/", (req, res) => res.send("sportz-backend running"));

app.locals.broadcastMatchCreated = broadcastMatchCreated;

httpServer.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server running at ${baseUrl}`);
  console.log(`Websocket running at ${baseUrl.replace("http", "ws")}/ws`);
});
