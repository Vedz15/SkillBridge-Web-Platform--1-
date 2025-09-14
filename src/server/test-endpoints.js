#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3001';

// Test endpoints
const endpoints = [
  { name: 'Health Check', path: '/api/health' },
  { name: 'Smart Matching', path: '/api/match?skills=yoga&location_lat=23.03&location_lng=72.57&limit=3' },
  { name: 'Location-Based Search', path: '/api/location?lat=23.03&lng=72.57&radius=25&limit=5' },
  { name: 'Verification Info', path: '/api/verify' },
  { name: 'Chat Simulation', path: '/api/chat?limit=5' },
  { name: 'Reviews System', path: '/api/reviews' },
  { name: 'AI Assistant', path: '/api/assistant?user_type=shishya' }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint.path}`;
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            success: json.success || false,
            dataSize: data.length
          });
        } catch (error) {
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        status: 0,
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        status: 0,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing SkillBridge API Endpoints...\n');
  console.log('Server:', BASE_URL);
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.name}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success && result.status === 200) {
      console.log(`✅ PASS (${result.dataSize} bytes)`);
    } else {
      console.log(`❌ FAIL (${result.status}): ${result.error || 'Unknown error'}`);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  
  const passed = results.filter(r => r.success && r.status === 200).length;
  const total = results.length;
  
  console.log(`📊 Test Results: ${passed}/${total} endpoints working`);
  
  if (passed === total) {
    console.log('🎉 All endpoints are working correctly!');
    console.log('\n💡 You can now click the feature buttons on the landing page');
    console.log('   They will fetch real data from these endpoints.');
  } else {
    console.log('⚠️  Some endpoints failed. Check server logs for details.');
  }
  
  console.log('\n🔗 Frontend Integration:');
  console.log('   - Smart Matching: Click the "Smart Matching" card');
  console.log('   - Location-Based: Click the "Location-Based" card'); 
  console.log('   - Secure & Trusted: Click the "Secure & Trusted" card');
  console.log('   - Real-time Chat: Click the "Real-time Chat" card');
  console.log('   - Review System: Click the "Review System" card');
  console.log('   - AI Assistant: Click the "AI Assistant" card');
}

// Check if server is running first
console.log('Checking if server is running...');
http.get(`${BASE_URL}/api/health`, (res) => {
  if (res.statusCode === 200) {
    runTests();
  } else {
    console.log('❌ Server is not responding correctly');
    console.log('💡 Start the server first: cd server && npm start');
  }
}).on('error', (error) => {
  console.log('❌ Server is not running');
  console.log('💡 Start the server first: cd server && npm start');
  console.log('   Or use quick start: cd server && npm run quick-start');
});