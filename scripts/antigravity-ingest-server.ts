/**
 * Antigravity AI Debug System - Ingest Server
 * 
 * This server receives debug logs from injected code and writes them to .antigravity/debug.log
 * Format: NDJSON (Newline Delimited JSON)
 */

import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json({ limit: "1mb" }));

const LOG_DIR = path.resolve(".antigravity");
const LOG_FILE = path.join(LOG_DIR, "debug.log");

// Create .antigravity directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  console.log(`✅ Created directory: ${LOG_DIR}`);
}

// Maximum payload size (1MB)
const MAX_PAYLOAD_SIZE = 1024 * 1024;

// Sanitize data to prevent sending sensitive information
function sanitizePayload(payload: any): any {
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'auth', 'credential'];
  
  if (typeof payload !== 'object' || payload === null) {
    return payload;
  }
  
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item));
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// POST endpoint to receive debug logs
app.post("/ingest/:id", (req, res) => {
  try {
    const runId = req.params.id;
    const payload = req.body;
    
    // Check payload size
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      console.warn(`⚠️  Payload too large: ${payloadSize} bytes (max: ${MAX_PAYLOAD_SIZE})`);
      return res.status(400).send({ 
        ok: false, 
        error: "Payload too large" 
      });
    }
    
    // Sanitize payload
    const sanitizedPayload = sanitizePayload(payload);
    
    // Create log entry
    const entry = {
      id: runId,
      receivedAt: new Date().toISOString(),
      payload: sanitizedPayload
    };
    
    // Append to log file (NDJSON format)
    const logLine = JSON.stringify(entry) + "\n";
    fs.appendFileSync(LOG_FILE, logLine, "utf8");
    
    // Log to console for immediate feedback
    console.log(`📝 [${runId}] Log received from ${sanitizedPayload.location || 'unknown'}`);
    
    res.status(201).send({ ok: true, received: true });
  } catch (error: any) {
    console.error("❌ Error processing log:", error.message);
    res.status(500).send({ 
      ok: false, 
      error: error.message 
    });
  }
});

// GET endpoint to check server status
app.get("/status", (req, res) => {
  const stats = {
    status: "running",
    logFile: LOG_FILE,
    logFileExists: fs.existsSync(LOG_FILE),
    logFileSize: fs.existsSync(LOG_FILE) 
      ? fs.statSync(LOG_FILE).size 
      : 0,
    timestamp: new Date().toISOString()
  };
  
  res.json(stats);
});

// GET endpoint to read logs (for debugging)
app.get("/logs", (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.json({ logs: [], count: 0 });
    }
    
    const content = fs.readFileSync(LOG_FILE, "utf8");
    const lines = content.trim().split("\n").filter(line => line.trim());
    const logs = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(log => log !== null);
    
    res.json({ 
      logs, 
      count: logs.length,
      file: LOG_FILE
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear logs endpoint
app.delete("/logs", (req, res) => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "", "utf8");
      console.log("🧹 Logs cleared");
      res.json({ ok: true, message: "Logs cleared" });
    } else {
      res.json({ ok: true, message: "No logs to clear" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.ANTIGRAVITY_PORT || 7242;

app.listen(PORT, () => {
  console.log(`🚀 Antigravity Ingest Server running on http://127.0.0.1:${PORT}`);
  console.log(`📁 Log file: ${LOG_FILE}`);
  console.log(`📊 Status: http://127.0.0.1:${PORT}/status`);
  console.log(`📝 Logs: http://127.0.0.1:${PORT}/logs`);
});
