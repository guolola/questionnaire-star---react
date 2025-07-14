import { useState, useEffect, useRef } from 'react';
import { Input, Button, Card, Typography, Space, message, Switch } from 'antd';
import { SendOutlined, RobotOutlined, ClearOutlined, GlobalOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addComponent, resetComponents } from '../../../../store/componentsReducer';
import { type ComponentInfoType } from '../../../../store/componentsReducer';
import { deepseekApi, type ThinkingChunk } from '../../../../services/deepseekApi';
import styles from './index.module.scss';

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
  thinkingSteps?: string[];
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState('');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateQuestionnaireWithStreaming = async (requirement: string, thinkingMessageId: string, enableWebSearch: boolean = true): Promise<ComponentInfoType[]> => {
    try {
      let finalContent = '';
      
      // 使用DeepSeek API流式生成问卷
      for await (const chunk of deepseekApi.generateQuestionnaireWithThinking(requirement, enableWebSearch)) {
        if (chunk.type === 'thinking') {
          // 更新思考过程
          setCurrentThinkingStep(chunk.content);
          setMessages(prev => prev.map(msg => 
            msg.id === thinkingMessageId 
              ? { ...msg, content: chunk.content }
              : msg
          ));
        } else if (chunk.type === 'content') {
          finalContent = chunk.content;
        } else if (chunk.type === 'done') {
          finalContent = chunk.content;
          break;
        }
      }
      
      // 解析最终内容为组件
      const components = deepseekApi.parseStreamResult(finalContent);
      return components;
    } catch (error) {
      console.error('AI生成问卷失败:', error);
      
      // 如果AI生成失败，返回一个基础的问卷模板
      const fallbackComponents: ComponentInfoType[] = [
        {
          fe_id: `fallback_${Date.now()}_1`,
          type: 'questionTitle',
          title: '问卷标题',
          props: {
            title: '问卷调查',
            level: 1
          }
        },
        {
          fe_id: `fallback_${Date.now()}_2`,
          type: 'questionParagraph',
          title: '问卷说明',
          props: {
            text: '请根据您的真实情况填写以下问卷，感谢您的参与。'
          }
        },
        {
          fe_id: `fallback_${Date.now()}_3`,
          type: 'questionInput',
          title: '输入框',
          props: {
            title: '请输入您的姓名',
            placeholder: '请输入姓名'
          }
        }
      ];
      
      return fallbackComponents;
    }
  };

  const addComponentsToCanvas = (components: ComponentInfoType[]) => {
    components.forEach(component => {
      dispatch(addComponent(component));
    });
  };

  const clearCanvas = () => {
    dispatch(resetComponents({
      selectedId: '',
      componentList: [],
      copiedComponent: null,
    }));
    message.success('画布已清空');
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 立即显示AI正在思考的消息
      const thinkingMessageId = `msg_${Date.now()}_thinking`;
      const thinkingMessage: Message = {
        id: thinkingMessageId,
        content: '正在连接AI助手...',
        isUser: false,
        timestamp: new Date(),
        isThinking: true,
        thinkingSteps: []
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // 使用流式API生成问卷，显示真实思考过程
      const components = await generateQuestionnaireWithStreaming(inputValue, thinkingMessageId, enableWebSearch);
      
      // 更新AI回复消息
      const aiResponse: Message = {
        id: `msg_${Date.now()}_ai`,
        content: `已为您生成包含 ${components.length} 个组件的问卷。问卷内容：${components.map(c => c.title).join('、')}`,
        isUser: false,
        timestamp: new Date()
      };

      // 替换思考消息为最终回复
      setMessages(prev => [...prev.slice(0, -1), aiResponse]);
      
      // 将生成的组件添加到画布中
      addComponentsToCanvas(components);
      
      message.success(`问卷已生成，包含${components.length}个组件！`);

    } catch (error) {
      console.error('AI生成错误:', error);
      
      // 显示错误消息给用户
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        content: '抱歉，问卷生成失败。可能是网络问题或AI服务暂时不可用，已为您生成基础问卷模板。',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      message.error('AI生成失败，已使用基础模板');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aiChat}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <RobotOutlined />
          <Text strong>AI 问卷助手</Text>
        </div>
        <Button
          type="link"
          size="small"
          icon={<ClearOutlined />}
          onClick={clearCanvas}
          title="清空画布"
        >
          清空画布
        </Button>
      </div>
      
      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <Text type="secondary">
              请描述您想要创建的问卷需求，AI 将为您自动生成问卷
            </Text>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`${styles.messageItem} ${message.isUser ? styles.userMessage : styles.aiMessage}`}
            >
              <Card size="small" className={styles.messageCard}>
                <Text>{message.content}</Text>
                {message.isThinking && (
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '4px',
                    borderLeft: '3px solid var(--primary-color)',
                    fontSize: '12px',
                    color: 'var(--primary-color)',
                    animation: 'pulse 2s infinite'
                  }}>
                    正在思考中...
                  </div>
                )}
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <div className={styles.inputContainer}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请描述您的问卷需求，例如：我想创建一个客户满意度调查问卷"
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (e.ctrlKey || e.metaKey) {
                handleSendMessage();
              }
            }}
            className={styles.inputArea}
            bordered={false}
          />
          <div className={styles.inputControls}>
            <div className={styles.leftControls}>
              <div className={styles.webSearchToggle} onClick={() => setEnableWebSearch(!enableWebSearch)}>
                <GlobalOutlined style={{ color: enableWebSearch ? 'var(--primary-color)' : 'var(--text-tertiary)' }} />
                <span className={styles.toggleText}>联网搜索</span>
              </div>
            </div>
            <div className={styles.rightControls}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputValue.trim()}
                className={styles.sendButton}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;