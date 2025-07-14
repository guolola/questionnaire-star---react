import { type ComponentInfoType } from '../store/componentsReducer';
import { nanoid } from '@reduxjs/toolkit';

const DEEPSEEK_API_KEY = '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export interface DeepSeekStreamChunk {
  choices: Array<{
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface ThinkingChunk {
  type: 'thinking' | 'content' | 'done';
  content: string;
  isComplete?: boolean;
}

// 问卷生成的系统提示词
const SYSTEM_PROMPT = `
你是一个专业的问卷设计专家。根据用户需求，生成合适的问卷组件配置。

可用组件类型及其属性：
1. questionTitle - 标题组件
   props: { title: string, level?: number }

2. questionParagraph - 段落描述
   props: { text: string }

3. questionInput - 单行输入框
   props: { title: string, placeholder?: string }

4. questionTextarea - 多行文本框
   props: { title: string, placeholder?: string }

5. questionRadio - 单选题
   props: { 
     title: string,
     isVertical?: boolean,
     options: Array<{ value: string, text: string }>,
     value?: string
   }

6. questionCheckbox - 多选题
   props: {
     title: string,
     isVertical?: boolean,
     list: Array<{ value: string, text: string, checked: boolean }>
   }

设计原则：
1. 问卷应有清晰的标题和说明
2. 问题顺序要合理（基本信息→主要问题→补充信息）
3. 选项要全面且互斥（单选题）
4. 避免引导性问题
5. 根据需求选择合适的组件类型

请返回JSON格式的数组，每个元素包含：
- type: 组件类型
- title: 组件标题（用于编辑器显示）
- props: 组件属性

示例：
[
  {
    "type": "questionTitle",
    "title": "问卷标题",
    "props": { "title": "客户满意度调查", "level": 1 }
  },
  {
    "type": "questionParagraph", 
    "title": "问卷说明",
    "props": { "text": "请根据您的真实体验填写以下问卷，您的意见对我们很重要。" }
  },
  {
    "type": "questionInput",
    "title": "姓名输入",
    "props": { "title": "请输入您的姓名", "placeholder": "请输入姓名" }
  },
  {
    "type": "questionRadio",
    "title": "性别选择",
    "props": {
      "title": "您的性别",
      "isVertical": false,
      "options": [
        { "value": "male", "text": "男" },
        { "value": "female", "text": "女" }
      ],
      "value": ""
    }
  }
]

请只返回JSON数组，不要包含其他说明文字。
`;

export class DeepSeekAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = DEEPSEEK_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = DEEPSEEK_API_URL;
  }

  async generateQuestionnaire(requirement: string, enableWebSearch: boolean = true): Promise<ComponentInfoType[]> {
    try {
      const messages: DeepSeekMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请根据以下需求生成问卷：${requirement}` }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
          ...(enableWebSearch && {
            tools: [
              {
                type: 'function',
                function: {
                  name: 'web_search',
                  description: '搜索网络信息来获取最新的相关内容',
                  parameters: {
                    type: 'object',
                    properties: {
                      query: {
                        type: 'string',
                        description: '搜索查询关键词'
                      }
                    },
                    required: ['query']
                  }
                }
              }
            ]
          })
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('API返回内容为空');
      }

      // 解析AI返回的JSON
      const components = this.parseAIResponse(content);
      
      // 转换为系统需要的格式
      return components.map(comp => ({
        fe_id: nanoid(),
        type: comp.type,
        title: comp.title,
        props: this.validateAndNormalizeProps(comp.type, comp.props)
      }));

    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      throw error;
    }
  }

  // 新增：流式生成问卷，显示真实思考过程
  async* generateQuestionnaireWithThinking(requirement: string, enableWebSearch: boolean = true): AsyncGenerator<ThinkingChunk> {
    try {
      const messages: DeepSeekMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请根据以下需求生成问卷：${requirement}` }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner', // 使用推理模型显示思考过程
          messages,
          temperature: 0.7,
          max_tokens: 3000,
          stream: true, // 启用流式响应
          ...(enableWebSearch && {
            tools: [
              {
                type: 'function',
                function: {
                  name: 'web_search',
                  description: '搜索网络信息来获取最新的相关内容',
                  parameters: {
                    type: 'object',
                    properties: {
                      query: {
                        type: 'string',
                        description: '搜索查询关键词'
                      }
                    },
                    required: ['query']
                  }
                }
              }
            ]
          })
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let thinkingContent = '';
      let finalContent = '';
      let isInThinking = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) continue;
            
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              yield { type: 'done', content: finalContent, isComplete: true };
              return;
            }

            try {
              const chunk: DeepSeekStreamChunk = JSON.parse(data);
              const delta = chunk.choices[0]?.delta;
              
              // 处理思考过程内容
              if (delta?.reasoning_content) {
                thinkingContent += delta.reasoning_content;
                
                // 实时显示思考过程
                if (thinkingContent.trim()) {
                  yield { 
                    type: 'thinking', 
                    content: thinkingContent.slice(-300) // 显示最后300字符
                  };
                }
              }
              
              // 处理正常回复内容
              if (delta?.content) {
                finalContent += delta.content;
                if (finalContent.trim()) {
                  yield { type: 'content', content: finalContent };
                }
              }
              
              // 检查是否完成
              if (chunk.choices[0]?.finish_reason) {
                yield { type: 'done', content: finalContent, isComplete: true };
                return;
              }
            } catch (parseError) {
              console.warn('解析流式数据失败:', parseError);
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('DeepSeek 流式API调用失败:', error);
      throw error;
    }
  }

  // 从流式内容解析最终结果
  parseStreamResult(content: string): ComponentInfoType[] {
    try {
      const components = this.parseAIResponse(content);
      return components.map(comp => ({
        fe_id: nanoid(),
        type: comp.type,
        title: comp.title,
        props: this.validateAndNormalizeProps(comp.type, comp.props)
      }));
    } catch (error) {
      console.error('解析流式结果失败:', error);
      throw error;
    }
  }

  private parseAIResponse(content: string): any[] {
    try {
      // 尝试从响应中提取JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // 如果没有找到JSON格式，尝试直接解析
      return JSON.parse(content);
    } catch (error) {
      console.error('解析AI响应失败:', error);
      throw new Error('AI返回的内容格式不正确');
    }
  }

  private validateAndNormalizeProps(type: string, props: any): any {
    // 根据组件类型验证和规范化属性
    switch (type) {
      case 'questionTitle':
        return {
          title: props.title || '标题',
          level: props.level || 1
        };

      case 'questionParagraph':
        return {
          text: props.text || '段落内容'
        };

      case 'questionInput':
        return {
          title: props.title || '输入框标题',
          placeholder: props.placeholder || '请输入...'
        };

      case 'questionTextarea':
        return {
          title: props.title || '文本框标题',
          placeholder: props.placeholder || '请输入...'
        };

      case 'questionRadio':
        return {
          title: props.title || '单选题标题',
          isVertical: props.isVertical || false,
          options: props.options || [
            { value: 'option1', text: '选项1' },
            { value: 'option2', text: '选项2' }
          ],
          value: props.value || ''
        };

      case 'questionCheckbox':
        return {
          title: props.title || '多选题标题',
          isVertical: props.isVertical || false,
          list: props.list || [
            { value: 'option1', text: '选项1', checked: false },
            { value: 'option2', text: '选项2', checked: false }
          ]
        };

      default:
        return props;
    }
  }

  // 测试API连接
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: '测试连接' }],
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      console.error('DeepSeek API连接测试失败:', error);
      return false;
    }
  }

  // 测试R1推理模型
  async testReasonerModel(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [{ role: 'user', content: '1+1等于几？请显示思考过程。' }],
          max_tokens: 100,
          stream: false
        })
      });

      return response.ok;
    } catch (error) {
      console.error('DeepSeek R1模型测试失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const deepseekApi = new DeepSeekAPI();