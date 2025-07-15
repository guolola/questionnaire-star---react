import React, { FC, useState } from 'react'
import { Modal, Tabs, Card, Typography, Button, Space, Divider, Badge } from 'antd'
import { 
  BranchesOutlined, 
  BgColorsOutlined, 
  BarChartOutlined, 
  ApiOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  EyeOutlined
} from '@ant-design/icons'

// 导入我们创建的高级功能组件
import ConditionalLogicEditor from '../ConditionalLogicEditor'
import MultiPageEditor from '../MultiPageEditor'
import ValidationRuleEditor from '../ValidationRuleEditor'
import FeatureDemo from '../FeatureDemo'

const { Title, Text } = Typography
const { TabPane } = Tabs

interface AdvancedFeaturesManagerProps {
  visible: boolean
  onClose: () => void
  activeFeature?: string
  questions: Array<{ id: string; title: string; type: string }>
  currentQuestionId?: string
}

const AdvancedFeaturesManager: FC<AdvancedFeaturesManagerProps> = ({
  visible,
  onClose,
  activeFeature = 'overview',
  questions,
  currentQuestionId
}) => {
  const [currentTab, setCurrentTab] = useState(activeFeature)
  const [subModalVisible, setSubModalVisible] = useState<string | null>(null)

  // 功能概览数据
  const featureOverview = [
    {
      id: 'conditional-logic',
      title: '条件逻辑',
      description: '根据用户回答动态显示/隐藏问题',
      icon: <BranchesOutlined />,
      status: 'active',
      phase: '3',
      component: 'ConditionalLogicEditor'
    },
    {
      id: 'multi-page',
      title: '多页面管理',
      description: '将长问卷分成多个页面提升用户体验',
      icon: <FileTextOutlined />,
      status: 'active',
      phase: '3',
      component: 'MultiPageEditor'
    },
    {
      id: 'validation-rules',
      title: '高级验证',
      description: '设置复杂的输入验证规则',
      icon: <CheckCircleOutlined />,
      status: 'active',
      phase: '3',
      component: 'ValidationRuleEditor'
    },
    {
      id: 'logic-branching',
      title: '高级逻辑分支',
      description: '企业级复杂逻辑处理系统',
      icon: <SettingOutlined />,
      status: 'enterprise',
      phase: '5',
      component: 'LogicBranchingEditor'
    },
    {
      id: 'custom-styling',
      title: '自定义样式',
      description: '完全自定义问卷的视觉样式',
      icon: <BgColorsOutlined />,
      status: 'enterprise',
      phase: '5',
      component: 'CustomStylingEditor'
    },
    {
      id: 'advanced-analytics',
      title: '高级分析',
      description: '深度数据分析和智能洞察',
      icon: <BarChartOutlined />,
      status: 'enterprise',
      phase: '5',
      component: 'AdvancedAnalyticsPanel'
    },
    {
      id: 'api-integration',
      title: 'API集成',
      description: '与第三方服务无缝集成',
      icon: <ApiOutlined />,
      status: 'enterprise',
      phase: '5',
      component: 'APIIntegrationPanel'
    }
  ]

  const handleFeatureClick = (featureId: string) => {
    setSubModalVisible(featureId)
  }

  const renderFeatureCard = (feature: any) => {
    const statusColors = {
      active: '#52c41a',
      enterprise: '#722ed1'
    }

    return (
      <Card 
        key={feature.id}
        hoverable
        style={{ marginBottom: 16 }}
        onClick={() => handleFeatureClick(feature.id)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '24px', color: statusColors[feature.status] }}>
            {feature.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Title level={5} style={{ margin: 0 }}>{feature.title}</Title>
              <Badge 
                text={`Phase ${feature.phase}`}
                color={feature.status === 'enterprise' ? 'purple' : 'green'}
              />
            </div>
            <Text type="secondary">{feature.description}</Text>
          </div>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              handleFeatureClick(feature.id)
            }}
          >
            配置
          </Button>
        </div>
      </Card>
    )
  }

  const renderOverview = () => {
    const phase3Features = featureOverview.filter(f => f.phase === '3')
    const phase5Features = featureOverview.filter(f => f.phase === '5')

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>问卷高级功能管理</Title>
          <Text type="secondary">
            管理和配置问卷的高级功能，提升用户体验和数据收集效率
          </Text>
        </div>

        <Divider orientation="left">Phase 3 - 专业功能</Divider>
        {phase3Features.map(renderFeatureCard)}

        <Divider orientation="left">Phase 5 - 企业级功能</Divider>
        {phase5Features.map(renderFeatureCard)}

        <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f6f8fa', borderRadius: 8 }}>
          <Title level={5}>功能统计</Title>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {featureOverview.length}
              </div>
              <Text type="secondary">总功能数</Text>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {phase3Features.length}
              </div>
              <Text type="secondary">专业功能</Text>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                {phase5Features.length}
              </div>
              <Text type="secondary">企业功能</Text>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalyticsPreview = () => (
    <div style={{ padding: '20px' }}>
      <Title level={4}>高级分析预览</Title>
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Title level={5} style={{ marginTop: 16 }}>增强统计分析</Title>
          <Text type="secondary">
            包含高级统计量、文本分析、相关性分析、趋势预测等功能
          </Text>
          <br />
          <Button 
            type="primary" 
            style={{ marginTop: 16 }}
            onClick={() => handleFeatureClick('advanced-analytics')}
          >
            查看详细分析
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderAPIIntegrationPreview = () => (
    <div style={{ padding: '20px' }}>
      <Title level={4}>API集成预览</Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {[
          { name: 'Salesforce CRM', icon: '🏢' },
          { name: 'HubSpot', icon: '🧡' },
          { name: 'Mailchimp', icon: '📧' },
          { name: 'Zapier', icon: '⚡' },
          { name: 'Google Sheets', icon: '📊' },
          { name: 'Slack', icon: '💬' }
        ].map((integration, index) => (
          <Card key={index} size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: 8 }}>{integration.icon}</div>
              <Text strong>{integration.name}</Text>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button 
          type="primary" 
          onClick={() => handleFeatureClick('api-integration')}
        >
          配置API集成
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Modal
        title="高级功能管理中心"
        open={visible}
        onCancel={onClose}
        width={1200}
        footer={null}
      >
        <Tabs activeKey={currentTab} onChange={setCurrentTab}>
          <TabPane tab="功能概览" key="overview">
            {renderOverview()}
          </TabPane>
          <TabPane tab="高级分析" key="analytics">
            {renderAnalyticsPreview()}
          </TabPane>
          <TabPane tab="API集成" key="api">
            {renderAPIIntegrationPreview()}
          </TabPane>
          <TabPane tab="完整演示" key="demo">
            <FeatureDemo />
          </TabPane>
        </Tabs>
      </Modal>

      {/* 子功能模态框 */}
      <ConditionalLogicEditor
        visible={subModalVisible === 'conditional-logic'}
        onClose={() => setSubModalVisible(null)}
        onSave={(rules) => {
          console.log('保存条件逻辑规则:', rules)
          setSubModalVisible(null)
        }}
        rules={[]}
        questions={questions}
        currentQuestionId={currentQuestionId}
      />

      <MultiPageEditor
        visible={subModalVisible === 'multi-page'}
        onClose={() => setSubModalVisible(null)}
        onSave={(pages) => {
          console.log('保存多页面设置:', pages)
          setSubModalVisible(null)
        }}
        pages={[]}
        questions={questions}
      />

      <ValidationRuleEditor
        visible={subModalVisible === 'validation-rules'}
        onClose={() => setSubModalVisible(null)}
        onSave={(rules) => {
          console.log('保存验证规则:', rules)
          setSubModalVisible(null)
        }}
        rules={[]}
        currentQuestionId={currentQuestionId}
      />

      {/* Phase 5 功能的占位符模态框 */}
      <Modal
        title="高级逻辑分支"
        open={subModalVisible === 'logic-branching'}
        onCancel={() => setSubModalVisible(null)}
        width={1000}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <SettingOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
          <Title level={4} style={{ marginTop: 16 }}>企业级逻辑分支系统</Title>
          <Text type="secondary">
            支持复杂的AND/OR逻辑组合、12种操作符、表达式计算等高级功能
          </Text>
          <br />
          <Button type="primary" style={{ marginTop: 16 }}>
            配置逻辑分支
          </Button>
        </div>
      </Modal>

      <Modal
        title="自定义样式"
        open={subModalVisible === 'custom-styling'}
        onCancel={() => setSubModalVisible(null)}
        width={1000}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <BgColorsOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
          <Title level={4} style={{ marginTop: 16 }}>自定义样式系统</Title>
          <Text type="secondary">
            包含主题管理、响应式设计、动画效果等完整的样式定制功能
          </Text>
          <br />
          <Button type="primary" style={{ marginTop: 16 }}>
            编辑样式
          </Button>
        </div>
      </Modal>

      <Modal
        title="高级分析"
        open={subModalVisible === 'advanced-analytics'}
        onCancel={() => setSubModalVisible(null)}
        width={1200}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <BarChartOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
          <Title level={4} style={{ marginTop: 16 }}>增强统计分析系统</Title>
          <Text type="secondary">
            包含高级统计量、文本分析、相关性分析、趋势预测、智能洞察等功能
          </Text>
          <br />
          <Button type="primary" style={{ marginTop: 16 }}>
            查看分析报告
          </Button>
        </div>
      </Modal>

      <Modal
        title="API集成"
        open={subModalVisible === 'api-integration'}
        onCancel={() => setSubModalVisible(null)}
        width={1000}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <ApiOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
          <Title level={4} style={{ marginTop: 16 }}>第三方API集成</Title>
          <Text type="secondary">
            支持Salesforce、HubSpot、Mailchimp、Zapier等多种第三方服务集成
          </Text>
          <br />
          <Button type="primary" style={{ marginTop: 16 }}>
            配置集成
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AdvancedFeaturesManager