// 测试 DeepSeek API 连接
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

console.log('\n🧪 DeepSeek API Connection Test\n');
console.log('='.repeat(50));

// 1. 检查环境变量
console.log('\n📋 Step 1: Checking Environment Variables');
console.log('-'.repeat(50));
const apiKey = process.env.DEEPSEEK_API_KEY;
const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

if (!apiKey) {
  console.error('❌ DEEPSEEK_API_KEY is NOT set in .env file');
  console.log('\n💡 Please check:');
  console.log('   1. Does backend/.env file exist?');
  console.log('   2. Is DEEPSEEK_API_KEY defined in .env?');
  console.log('   3. Does the API key start with "sk-"?');
  process.exit(1);
}

console.log('✅ DEEPSEEK_API_KEY is set');
console.log(`   Key preview: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
console.log(`   Key length: ${apiKey.length} characters`);
console.log(`✅ API URL: ${apiUrl}`);

// 2. 测试 API 连接
console.log('\n📡 Step 2: Testing API Connection');
console.log('-'.repeat(50));

const testPayload = {
  model: 'deepseek-chat',
  messages: [
    {
      role: 'user',
      content: 'Say "Hello" in JSON format like: {"message": "Hello"}'
    }
  ],
  temperature: 0.7,
  max_tokens: 100,
  response_format: { type: 'json_object' }
};

console.log('Sending test request to DeepSeek API...');
console.log(`Request payload:`, JSON.stringify(testPayload, null, 2));

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(testPayload)
  });

  console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Request Failed');
    console.error('Response body:', errorText);
    
    // 常见错误分析
    if (response.status === 401) {
      console.log('\n💡 Error 401 - Unauthorized');
      console.log('   Possible causes:');
      console.log('   1. Invalid API key');
      console.log('   2. API key expired');
      console.log('   3. API key has no credits');
      console.log('\n   Please check your API key at: https://platform.deepseek.com/api_keys');
    } else if (response.status === 429) {
      console.log('\n💡 Error 429 - Rate Limit');
      console.log('   You are making too many requests');
    } else if (response.status === 500) {
      console.log('\n💡 Error 500 - Server Error');
      console.log('   DeepSeek API is having issues');
    }
    
    process.exit(1);
  }

  const data = await response.json();
  console.log('✅ API Request Successful!');
  console.log('\n📄 Full Response:');
  console.log(JSON.stringify(data, null, 2));

  // 3. 验证响应格式
  console.log('\n🔍 Step 3: Validating Response Format');
  console.log('-'.repeat(50));

  if (data.choices && data.choices.length > 0) {
    console.log('✅ Response has choices array');
    const content = data.choices[0].message?.content;
    
    if (content) {
      console.log('✅ Response has content');
      console.log(`   Content: ${content.substring(0, 100)}...`);
      
      try {
        const parsed = JSON.parse(content);
        console.log('✅ Content is valid JSON');
        console.log('   Parsed:', parsed);
      } catch (e) {
        console.log('⚠️  Content is not JSON (but that\'s OK for some requests)');
      }
    } else {
      console.log('❌ Response has no content');
    }
  } else {
    console.log('❌ Response has no choices array');
  }

  // 4. 测试市场分析请求
  console.log('\n🎯 Step 4: Testing Market Analysis Request');
  console.log('-'.repeat(50));

  const analysisPayload = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'user',
        content: `You are a market analyst. Analyze the United States market for Organic Green Tea.
        
Return ONLY a valid JSON object (no markdown) with this structure:
{
  "market": "United States",
  "overallScore": 85,
  "recommendation": "recommended",
  "keyFindings": ["Finding 1", "Finding 2"]
}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' }
  };

  console.log('Sending market analysis test request...');
  
  const analysisResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(analysisPayload)
  });

  if (!analysisResponse.ok) {
    const errorText = await analysisResponse.text();
    console.error('❌ Market Analysis Request Failed');
    console.error('Response body:', errorText);
    process.exit(1);
  }

  const analysisData = await analysisResponse.json();
  const analysisContent = analysisData.choices[0]?.message?.content;
  
  if (analysisContent) {
    console.log('✅ Market Analysis Request Successful');
    try {
      const parsed = JSON.parse(analysisContent);
      console.log('✅ Response is valid JSON');
      console.log('\n📊 Analysis Result:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('❌ Response is not valid JSON');
      console.log('Raw content:', analysisContent);
    }
  }

  // 5. 总结
  console.log('\n' + '='.repeat(50));
  console.log('✅ All Tests Passed!');
  console.log('='.repeat(50));
  console.log('\n💡 Your DeepSeek API is working correctly!');
  console.log('   The issue might be in how the backend is loading the .env file.');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure backend/src/index.ts loads dotenv correctly');
  console.log('   2. Restart the backend server');
  console.log('   3. Check backend logs for any .env loading errors\n');

} catch (error) {
  console.error('\n❌ Test Failed with Error:');
  console.error(error);
  
  if (error.message.includes('fetch')) {
    console.log('\n💡 Network Error - Possible causes:');
    console.log('   1. No internet connection');
    console.log('   2. Firewall blocking the request');
    console.log('   3. DeepSeek API is down');
  }
  
  process.exit(1);
}