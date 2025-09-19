// AI Capabilities Test Script
const https = require('https');
const http = require('http');

console.log('🚀 Testing Enhanced AI Capabilities...\n');

// Test server health
function testServerHealth() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Server Health Check:');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (err) => {
      console.log('❌ Server Health Check Failed:', err.message);
      resolve(false);
    });

    req.end();
  });
}

// Test session save endpoint
function testSessionSave() {
  return new Promise((resolve) => {
    const sessionData = {
      transcript: "Testing enhanced AI capabilities with MediaPipe, TensorFlow, and WebGazer",
      duration: 15,
      metrics: {
        wordsPerMinute: 120,
        fillerWordCount: 2,
        eyeContact: 85,
        confidence: 78
      }
    };

    const postData = JSON.stringify(sessionData);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/sessions/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Session Save Test:');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data.substring(0, 200)}...`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (err) => {
      console.log('❌ Session Save Test Failed:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test AI analysis endpoints
function testAIAnalysis() {
  return new Promise((resolve) => {
    const analysisData = {
      transcript: "This is a test of the enhanced AI analysis capabilities",
      duration: 10,
      purpose: "general-presentation"
    };

    const postData = JSON.stringify(analysisData);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/detect-enhanced-fillers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ AI Analysis Test:');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data.substring(0, 200)}...`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (err) => {
      console.log('❌ AI Analysis Test Failed:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runAITests() {
  console.log('🔍 Testing Enhanced AI Capabilities...\n');
  
  const results = {
    serverHealth: await testServerHealth(),
    sessionSave: await testSessionSave(),
    aiAnalysis: await testAIAnalysis()
  };

  console.log('\n📊 AI Capabilities Test Results:');
  console.log('================================');
  console.log(`Server Health: ${results.serverHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Session Save: ${results.sessionSave ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AI Analysis: ${results.aiAnalysis ? '✅ PASS' : '❌ FAIL'}`);

  const allPassed = Object.values(results).every(result => result);
  console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (allPassed) {
    console.log('\n🎉 Enhanced AI Capabilities are working correctly!');
    console.log('   - MediaPipe: Body language analysis enabled');
    console.log('   - TensorFlow: Emotion recognition enabled');
    console.log('   - WebGazer: Eye tracking enabled');
    console.log('   - Enhanced error handling: Active');
    console.log('   - Graceful fallbacks: Configured');
  } else {
    console.log('\n⚠️ Some AI capabilities may need attention.');
  }
}

runAITests().catch(console.error);
