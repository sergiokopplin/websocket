const express = require("express");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Global state (in production, use Redis/Database)
let currentCall = null;
let clients = new Set();
let globalConsent = false;

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // WebSocket Server
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/api/ws",
  });

  // Function to broadcast to all clients
  const broadcast = (message) => {
    console.log("Broadcasting:", message);
    const data = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    });
  };

  // WebSocket connection handler
  wss.on("connection", (ws) => {
    console.log("Client connected");
    clients.add(ws);

    // Send current state to new client
    ws.send(
      JSON.stringify({
        type: "CURRENT_CALL_STATE",
        hasActiveCall: !!currentCall,
        callInfo: currentCall,
      })
    );

    // Send current consent state
    ws.send(
      JSON.stringify({
        type: "CONSENT_UPDATE",
        globalConsent,
      })
    );

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);
        console.log("Received message:", message);

        switch (message.type) {
          case "GET_CURRENT_STATE":
            ws.send(
              JSON.stringify({
                type: "CURRENT_CALL_STATE",
                hasActiveCall: !!currentCall,
                callInfo: currentCall,
              })
            );
            break;

          case "STOP_RECORDING":
            if (currentCall) {
              currentCall.status = "transcribing";
              broadcast({
                type: "CALL_STATUS_UPDATE",
                updates: { status: "transcribing" },
              });
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  // API Routes
  server.use(express.json());

  // Endpoint to update global recording consent
  server.post("/api/consent", (req, res) => {
    const { consent } = req.body;
    console.log("Updating global consent:", consent);

    globalConsent = consent;

    // If consent is removed, end any active call
    if (!consent && currentCall) {
      console.log("Consent removed, ending active call");

      broadcast({
        type: "CALL_ENDED",
        callId: currentCall.callId,
        reason: "consent_removed",
      });

      currentCall = null;
    }

    // Broadcast consent state to all clients
    broadcast({
      type: "CONSENT_UPDATE",
      globalConsent,
    });

    res.json({ success: true });
  });

  // Get current consent state
  server.get("/api/consent", (req, res) => {
    res.json({
      success: true,
      globalConsent,
    });
  });

  // Endpoint to update recording consent
  server.post("/api/call/consent", (req, res) => {
    const { consent } = req.body;

    if (currentCall) {
      console.log(
        "Updating consent for call:",
        currentCall.callId,
        "consent:",
        consent
      );

      currentCall.isRecordingConsented = consent;
      currentCall.status = consent ? "recording" : "waiting_consent";
      currentCall.recordingEnabled = consent;

      broadcast({
        type: "RECORDING_CONSENT_UPDATE",
        callId: currentCall.callId,
        isRecordingConsented: consent,
        status: currentCall.status,
        recordingEnabled: consent,
      });
    }

    res.json({ success: true });
  });

  // Endpoint to simulate call error
  server.post("/api/call/error", (req, res) => {
    if (currentCall) {
      console.log("Simulating error for call:", currentCall.callId);

      currentCall.status = "error";
      currentCall.errorMessage = "Simulated call error: Connection lost";

      broadcast({
        type: "CALL_ERROR",
        callId: currentCall.callId,
        errorMessage: currentCall.errorMessage,
      });

      // Remove call after broadcast
      setTimeout(() => {
        currentCall = null;
      }, 3000);
    }

    res.json({ success: true });
  });

  // Endpoint to simulate call start (would be called by external service)
  server.post("/api/call/start", (req, res) => {
    // Check if recording is consented
    if (!globalConsent) {
      return res.status(403).json({
        success: false,
        error: "Recording consent required",
      });
    }

    const { expertName = "Dr. John Smith", expertId = "123" } = req.body;

    currentCall = {
      callId: `call_${Date.now()}`,
      expertId: expertId,
      expertName,
      startTime: new Date().toISOString(),
      status: "waiting_consent", // Start in waiting consent state
      isRecordingConsented: false,
      recordingEnabled: false,
    };

    console.log("Starting call:", currentCall);

    broadcast({
      type: "CALL_STARTED",
      ...currentCall,
    });

    res.json({ success: true, call: currentCall });
  });

  // Endpoint to simulate call end
  server.post("/api/call/end", (req, res) => {
    if (currentCall) {
      console.log("Ending call:", currentCall.callId);

      broadcast({
        type: "CALL_ENDED",
        callId: currentCall.callId,
      });

      // Remove call after broadcast
      setTimeout(() => {
        currentCall = null;
      }, 3000);
    }

    res.json({ success: true });
  });

  // Current call status
  server.get("/api/call/status", (req, res) => {
    res.json({
      hasActiveCall: !!currentCall,
      callInfo: currentCall,
    });
  });

  // Next.js handler for all other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log(`> WebSocket server running on ws://localhost:${PORT}/api/ws`);
  });
});
