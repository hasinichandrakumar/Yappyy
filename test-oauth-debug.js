const https = require('https');
const http = require('http');

// Test the OAuth flow
async function testOAuth() {
  console.log('🔍 Testing OAuth flow...');
  
  // Test 1: Check if server is running
  try {
    const response = await fetch('http://localhost:5000/api/auth/test');
    const data = await response.json();
    console.log('✅ Server is running');
    console.log('   Client ID:', data.clientId);
    console.log('   Has Secret:', data.hasSecret);
    console.log('   Callback URL:', data.callbackUrl);
  } catch (error) {
    console.error('❌ Server not responding:', error.message);
    return;
  }
  
  // Test 2: Try to initiate OAuth flow
  try {
    console.log('\n🔐 Testing OAuth initiation...');
    const response = await fetch('http://localhost:5000/api/auth/google', {
      redirect: 'manual' // Don't follow redirects
    });
    
    console.log('   Status:', response.status);
    console.log('   Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('   Redirect Location:', location);
      
      if (location && location.includes('accounts.google.com')) {
        console.log('✅ OAuth initiation successful - redirecting to Google');
      } else {
        console.log('❌ Unexpected redirect location');
      }
    } else {
      console.log('❌ Unexpected response status');
    }
  } catch (error) {
    console.error('❌ OAuth initiation failed:', error.message);
  }
}

testOAuth();


