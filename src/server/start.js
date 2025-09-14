#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SkillBridge Backend...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed successfully!\n');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔥 Starting server on http://localhost:3001\n');
  console.log('Available endpoints:');
  console.log('  • GET  /api/health     - Health check');
  console.log('  • GET  /api/match      - Smart matching');
  console.log('  • GET  /api/location   - Location-based search');
  console.log('  • GET  /api/verify     - Verification info');
  console.log('  • GET  /api/chat       - Chat simulation');
  console.log('  • GET  /api/reviews    - Reviews & ratings');
  console.log('  • GET  /api/assistant  - AI assistant\n');
  
  const server = spawn('node', ['server.js'], { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  // Test connectivity after a short delay
  setTimeout(() => {
    testConnectivity();
  }, 3000);
  
  server.on('close', (code) => {
    console.log(`\n💥 Server stopped with code ${code}`);
  });
  
  // Handle CTRL+C
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

function testConnectivity() {
  const http = require('http');
  
  console.log('\n🔍 Testing server connectivity...');
  
  const req = http.get('http://localhost:3001/api/health', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Server is responding correctly!');
        console.log('🌐 CORS enabled for frontend connectivity');
        console.log('💡 You can now use the feature buttons on the landing page\n');
      } else {
        console.log(`⚠️  Server responded with status ${res.statusCode}`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('❌ Server connectivity test failed:', error.message);
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    console.log('⚠️  Server connectivity test timed out');
  });
}