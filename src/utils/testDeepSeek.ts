import { deepseekApi } from '../services/deepseekApi';

// 测试DeepSeek API连接的工具函数
export const testDeepSeekConnection = async () => {
  console.log('开始测试DeepSeek API连接...');
  
  try {
    const isConnected = await deepseekApi.testConnection();
    if (isConnected) {
      console.log('✅ DeepSeek API连接成功！');
      return true;
    } else {
      console.log('❌ DeepSeek API连接失败');
      return false;
    }
  } catch (error) {
    console.error('❌ DeepSeek API连接测试出错:', error);
    return false;
  }
};

// 测试问卷生成功能
export const testQuestionnaireGeneration = async () => {
  console.log('开始测试问卷生成功能...');
  
  try {
    const components = await deepseekApi.generateQuestionnaire('创建一个简单的用户反馈问卷');
    console.log('✅ 问卷生成成功:', components);
    return components;
  } catch (error) {
    console.error('❌ 问卷生成失败:', error);
    return null;
  }
};

// 在浏览器控制台中运行测试
if (typeof window !== 'undefined') {
  (window as any).testDeepSeek = {
    testConnection: testDeepSeekConnection,
    testGeneration: testQuestionnaireGeneration
  };
}