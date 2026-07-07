import WebSocket, { WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  try {
    socket.send(JSON.stringify(payload));
  } catch (error) {
    console.error("websocket send error:", error);
  }
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    sendJson(client, payload);
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  const interval = setInterval(() => {
    for (const client of wss.clients) {
      if (client.isAlive === false) {
        client.terminate();
        continue;
      }
      client.isAlive = false;
      client.ping();
    }
  }, 30000);

  wss.on("connection", async (ws, req) => {
    if (wsArcjet) {
      try {
        const decision = await wsArcjet.protect(req);

        if (decision.isDenied()) {
          const code = decision.reason.isRateLimit() ? 1013 : 1008;
          const reason = decision.reason.isRateLimit()
            ? "Rate limit exceeded"
            : "Access Denied";
          ws.close(code, reason);
          return;
        }
      } catch (error) {
        console.error("websocket connection error:", error);
        ws.close(1011, "Server security error");
        return;
      }
    }

    ws.isAlive = true;
    ws.on("pong", () => (ws.isAlive = true));

    sendJson(ws, { type: "welcome", message: "Welcome to Sportz!" });
    ws.on("error", (error) => {
      console.error("websocket connection error:", error);
    });
  });

  wss.on("error", (error) => {
    console.error("websocket connection error:", error);
  });

  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}
