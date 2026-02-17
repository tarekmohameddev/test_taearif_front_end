#!/bin/bash
# Antigravity AI Debug System - Example Usage Script
# مثال على استخدام نظام Debug

echo "🚀 Antigravity AI Debug System - Example"
echo "========================================"
echo ""

# Step 1: Start the ingest server (in background)
echo "📡 Step 1: Starting ingest server..."
npm run antigravity:server &
SERVER_PID=$!
sleep 2

# Step 2: Inject debug code
echo ""
echo "💉 Step 2: Injecting debug code..."
AGENT_RUNID="example-run-$(date +%s)" \
AGENT_HYP="H1" \
npm run antigravity:inject "context/editorStoreFunctions/imageTextFunctions.ts"

# Step 3: Wait a bit for logs
echo ""
echo "⏳ Step 3: Waiting for logs (5 seconds)..."
sleep 5

# Step 4: Check logs
echo ""
echo "📊 Step 4: Checking logs..."
curl -s http://127.0.0.1:7242/logs | head -20

# Step 5: Cleanup
echo ""
echo "🧹 Step 5: Cleaning up debug code..."
npm run antigravity:cleanup

# Step 6: Stop server
echo ""
echo "🛑 Step 6: Stopping server..."
kill $SERVER_PID 2>/dev/null

echo ""
echo "✅ Example complete!"
