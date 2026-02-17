/**
 * Antigravity AI Debug System - Automation Script
 * 
 * هذا السكربت يربط Antigravity AI بالنظام تلقائياً
 * يمكن Antigravity AI استدعاء هذا السكربت لتنفيذ دورة العمل الكاملة
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const SERVER_PORT = process.env.ANTIGRAVITY_PORT || 7242;
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Check if ingest server is running
 */
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`${SERVER_URL}/status`, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Start ingest server in background
 */
function startServer() {
  log('🚀 Starting ingest server...', 'blue');
  
  try {
    // Check if already running
    if (checkServer()) {
      log('✅ Server already running', 'green');
      return true;
    }
    
    // Start server in background
    const serverProcess = spawn('npm', ['run', 'antigravity:server'], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });
    
    serverProcess.unref();
    
    // Wait a bit for server to start
    setTimeout(async () => {
      if (await checkServer()) {
        log('✅ Server started successfully', 'green');
      } else {
        log('⚠️  Server may not have started. Check manually.', 'yellow');
      }
    }, 3000);
    
    return true;
  } catch (error) {
    log(`❌ Failed to start server: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Inject debug code into files
 */
function injectDebugCode(runId, hypothesisId, filePattern) {
  log(`💉 Injecting debug code...`, 'blue');
  log(`   Run ID: ${runId}`, 'yellow');
  log(`   Hypothesis: ${hypothesisId}`, 'yellow');
  log(`   Pattern: ${filePattern}`, 'yellow');
  
  try {
    const env = {
      ...process.env,
      AGENT_RUNID: runId,
      AGENT_HYP: hypothesisId
    };
    
    execSync(
      `npm run antigravity:inject "${filePattern}"`,
      { 
        env,
        stdio: 'inherit',
        shell: true
      }
    );
    
    log('✅ Debug code injected successfully', 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to inject debug code: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Get logs from server
 */
function getLogs() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/logs`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const logs = JSON.parse(data);
          resolve(logs);
        } catch (error) {
          reject(new Error('Failed to parse logs'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Read logs from file
 */
function readLogsFromFile() {
  const logFile = path.join(process.cwd(), '.antigravity', 'debug.log');
  
  if (!fs.existsSync(logFile)) {
    return { logs: [], count: 0 };
  }
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    const logs = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(log => log !== null);
    
    return { logs, count: logs.length };
  } catch (error) {
    return { logs: [], count: 0, error: error.message };
  }
}

/**
 * Cleanup debug code
 */
function cleanup() {
  log('🧹 Cleaning up debug code...', 'blue');
  
  try {
    execSync('npm run antigravity:cleanup', {
      stdio: 'inherit',
      shell: true
    });
    
    log('✅ Cleanup completed', 'green');
    return true;
  } catch (error) {
    log(`❌ Cleanup failed: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Main automation function
 */
async function automate(action, options = {}) {
  log('\n🤖 Antigravity AI Debug System - Automation\n', 'bright');
  
  switch (action) {
    case 'start-server':
      return startServer();
    
    case 'inject':
      const { runId, hypothesisId, filePattern } = options;
      if (!runId || !hypothesisId || !filePattern) {
        log('❌ Missing required options: runId, hypothesisId, filePattern', 'red');
        return false;
      }
      
      // Ensure server is running
      if (!(await checkServer())) {
        log('⚠️  Server not running. Starting...', 'yellow');
        await startServer();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      return injectDebugCode(runId, hypothesisId, filePattern);
    
    case 'get-logs':
      log('📊 Fetching logs...', 'blue');
      try {
        const logs = await getLogs();
        log(`✅ Found ${logs.count} log entries`, 'green');
        return logs;
      } catch (error) {
        log(`⚠️  Failed to get logs from server, trying file...`, 'yellow');
        const fileLogs = readLogsFromFile();
        log(`✅ Found ${fileLogs.count} log entries in file`, 'green');
        return fileLogs;
      }
    
    case 'cleanup':
      return cleanup();
    
    case 'status':
      const isRunning = await checkServer();
      if (isRunning) {
        log('✅ Server is running', 'green');
      } else {
        log('❌ Server is not running', 'red');
      }
      return isRunning;
    
    default:
      log(`❌ Unknown action: ${action}`, 'red');
      log('Available actions: start-server, inject, get-logs, cleanup, status', 'yellow');
      return false;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const action = args[0];
  const options = {};
  
  // Parse options
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      options[key] = value;
    }
  }
  
  automate(action, options)
    .then((result) => {
      if (result && typeof result === 'object' && result.logs) {
        // Output logs as JSON for parsing
        console.log(JSON.stringify(result, null, 2));
      }
      process.exit(result === false ? 1 : 0);
    })
    .catch((error) => {
      log(`❌ Error: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { automate, startServer, injectDebugCode, getLogs, cleanup, checkServer };
