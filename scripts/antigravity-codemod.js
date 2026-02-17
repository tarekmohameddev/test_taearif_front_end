/**
 * Antigravity AI Debug System - Codemod for Injecting Debug Code
 * 
 * This codemod injects debug logging code into specified locations
 * Usage: jscodeshift -t scripts/antigravity-codemod.js <file-pattern> --runId=<id> --hypothesisId=<id>
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  
  // Get environment variables
  const runId = process.env.AGENT_RUNID || process.env.runId || 'debug-run';
  const hypothesisId = process.env.AGENT_HYP || process.env.hypothesisId || 'H0';
  const isDryRun = process.env.DRY_RUN === 'true' || process.argv.includes('--dry');
  
  // Template for debug code injection
  const createDebugCode = (location, message = 'auto-instrument') => {
    return j.template.statement(`
      // #region agent log
      (function(){
        try {
          const payload = {
            location: ${JSON.stringify(location)},
            message: ${JSON.stringify(message)},
            timestamp: Date.now(),
            runId: ${JSON.stringify(runId)},
            hypothesisId: ${JSON.stringify(hypothesisId)}
          };
          if (typeof globalThis !== 'undefined' && globalThis.fetch) {
            globalThis.fetch('http://127.0.0.1:7242/ingest/' + ${JSON.stringify(runId)}, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(function(){});
          }
        } catch(e) {}
      })();
      // #endregion
    `)();
  };
  
  let hasChanges = false;
  
  // Strategy 1: Inject at the beginning of each function
  root.find(j.FunctionDeclaration).forEach(path => {
    const lineNumber = path.node.loc?.start.line || 0;
    const location = `${file.path}:${lineNumber}`;
    
    // Check if debug code already exists
    const body = path.get('body', 'body');
    if (body.value && body.value.length > 0) {
      const firstStatement = body.value[0];
      // Skip if already has debug code
      if (j(firstStatement).find(j.Comment).some(comment => 
        comment.value.value.includes('agent log')
      )) {
        return;
      }
    }
    
    const debugCode = createDebugCode(location, 'function-entry');
    body.value.unshift(debugCode);
    hasChanges = true;
  });
  
  // Strategy 2: Inject at the beginning of arrow functions
  root.find(j.ArrowFunctionExpression).forEach(path => {
    // Only inject if it's a direct assignment (not inline)
    const parent = path.parent;
    if (parent.value.type === 'VariableDeclarator' || parent.value.type === 'Property') {
      const lineNumber = path.node.loc?.start.line || 0;
      const location = `${file.path}:${lineNumber}`;
      
      if (path.node.body.type === 'BlockStatement') {
        const body = path.get('body', 'body');
        if (body.value && body.value.length > 0) {
          const firstStatement = body.value[0];
          if (j(firstStatement).find(j.Comment).some(comment => 
            comment.value.value.includes('agent log')
          )) {
            return;
          }
        }
        
        const debugCode = createDebugCode(location, 'arrow-function-entry');
        body.value.unshift(debugCode);
        hasChanges = true;
      }
    }
  });
  
  // Strategy 3: Inject before return statements (optional - can be enabled)
  // This is more aggressive, so we'll skip it by default
  // Uncomment if needed:
  /*
  root.find(j.ReturnStatement).forEach(path => {
    const lineNumber = path.node.loc?.start.line || 0;
    const location = `${file.path}:${lineNumber}`;
    const debugCode = createDebugCode(location, 'before-return');
    
    j(path).insertBefore(debugCode);
    hasChanges = true;
  });
  */
  
  if (hasChanges && !isDryRun) {
    return root.toSource({ 
      quote: 'single',
      trailingComma: true,
      lineTerminator: '\n'
    });
  } else if (isDryRun) {
    console.log(`[DRY RUN] Would inject debug code in ${file.path}`);
    return file.source;
  }
  
  return file.source;
};
