// 测试 Gemini API 连接
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 加载环境变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

console.log('\n🧪 Gemini API Connection Test\n');
console.log('='.repeat(50));

// 1. 检查环境变量
console.log('\n📋 Step 1: Checking Environment Variables');
console.log('-'.repeat(50));
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is NOT set in .env file');
  console.log('\n💡 Please check:');
  console.log('   1. Does backend/.env file exist?');
  console.log('   2. Is GEMINI_API_KEY defined in .env?');
  console.log('   3. Does the API key start with "AI"?');
  console.log('\n📝 Get your API key at: https://makersuite.google.com/app/apikey');
  process.exit(1);
}

console.log('✅ GEMINI_API_KEY is set');
console.log(`   Key preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
console.log(`   Key length: ${apiKey.length} characters`);
console.log(`✅ Model: ${model}`);

// 2. 测试 API 连接
console.log('\n📡 Step 2: Testing API Connection');
console.log('-'.repeat(50));

const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const testPayload = {
  contents: [
    {
      parts: [
        {
          text: 'Say "Hello" in JSON format like: {"message": "Hello"}'
        }
      ]
    }
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 100,
    responseMimeType: "application/json"
  }
};

console.log('Sending test request to Gemini API...');
console.log(`Request payload:`, JSON.stringify(testPayload, null, 2));

try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testPayload)
  });

  console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Request Failed');
    console.error('Response body:', errorText);
    
    // 常见错误分析
    if (response.status === 400) {
      console.log('\n💡 Error 400 - Bad Request');
      console.log('   Possible causes:');
      console.log('   1. Invalid API key format');
      console.log('   2. Invalid model name');
      console.log('   3. Request payload format error');
    } else if (response.status === 403) {
      console.log('\n💡 Error 403 - Forbidden');
      console.log('   Possible causes:');
      console.log('   1. API key doesn\'t have access to this model');
      console.log('   2. Billing not enabled');
      console.log('   3. API not enabled in Google Cloud Console');
    } else if (response.status === 429) {
      console.log('\n💡 Error 429 - Rate Limit');
      console.log('   You are making too many requests');
      console.log('   Free tier limits:');
      console.log('   - Gemini 1.5 Pro: 2 requests/minute');
      console.log('   - Gemini 1.5 Flash: 15 requests/minute');
    } else if (response.status === 500) {
      console.log('\n💡 Error 500 - Server Error');
      console.log('   Gemini API is having issues');
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

  if (data.candidates && data.candidates.length > 0) {
    console.log('✅ Response has candidates array');
    const content = data.candidates[0]?.content?.parts?.[0]?.text;
    
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
    console.log('❌ Response has no candidates array');
  }

  // 4. 测试市场分析请求
  console.log('\n🎯 Step 4: Testing Market Analysis Request');
  console.log('-'.repeat(50));

  const analysisPayload = {
    contents: [
      {
        parts: [
          {
            text: `You are a market analyst. Analyze the United States market for Organic Green Tea.
        
Return ONLY a valid JSON object (no markdown) with this structure:
{
  "market": "United States",
  "overallScore": 85,
  "recommendation": "recommended",
  "keyFindings": ["Finding 1", "Finding 2"]
}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 500,
      responseMimeType: "application/json"
    }
  };

  console.log('Sending market analysis test request...');
  
  const analysisResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
  const analysisContent = analysisData.candidates?.[0]?.content?.parts?.[0]?.text;
  
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

  // 5. 检查使用情况
  if (data.usageMetadata) {
    console.log('\n📊 Usage Statistics:');
    console.log('-'.repeat(50));
    console.log(`   Prompt tokens: ${data.usageMetadata.promptTokenCount || 0}`);
    console.log(`   Response tokens: ${data.usageMetadata.candidatesTokenCount || 0}`);
    console.log(`   Total tokens: ${data.usageMetadata.totalTokenCount || 0}`);
  }

  // 6. 总结
  console.log('\n' + '='.repeat(50));
  console.log('✅ All Tests Passed!');
  console.log('='.repeat(50));
  console.log('\n💡 Your Gemini API is working correctly!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update your .env file with GEMINI_API_KEY');
  console.log('   2. Remove DEEPSEEK_API_KEY from .env');
  console.log('   3. Restart the backend server');
  console.log('   4. Test the /api/analyze endpoint\n');

  console.log('💰 Cost Estimate:');
  console.log('-'.repeat(50));
  if (model.includes('flash')) {
    console.log('   Gemini 1.5 Flash pricing:');
    console.log('   - Input: $0.35 / 1M tokens');
    console.log('   - Output: $1.05 / 1M tokens');
    console.log('   - Free tier: 15 requests/minute');
  } else {
    console.log('   Gemini 1.5 Pro pricing:');
    console.log('   - Input: $3.50 / 1M tokens');
    console.log('   - Output: $10.50 / 1M tokens');
    console.log('   - Free tier: 2 requests/minute');
  }
  console.log('\n');

} catch (error) {
  console.error('\n❌ Test Failed with Error:');
  console.error(error);
  
  if (error.message && error.message.includes('fetch')) {
    console.log('\n💡 Network Error - Possible causes:');
    console.log('   1. No internet connection');
    console.log('   2. Firewall blocking the request');
    console.log('   3. Gemini API is down');
  }
  
  process.exit(1);
}
