// Test script to check if the API is accessible
async function testApi() {
  try {
    console.log('Testing API with direct URL...');
    const directResponse = await fetch('http://localhost:8080/api/jobs');
    console.log('Direct response status:', directResponse.status);
    const directData = await directResponse.json();
    console.log('Direct data:', directData);
    
    console.log('\nTesting API with proxy...');
    const proxyResponse = await fetch('/api/jobs');
    console.log('Proxy response status:', proxyResponse.status);
    const proxyData = await proxyResponse.json();
    console.log('Proxy data:', proxyData);
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Export the function so it can be imported and called from the browser console
export default testApi; 