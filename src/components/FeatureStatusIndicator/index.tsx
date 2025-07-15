import React, { FC } from 'react'
import { Badge, Tooltip, Space } from 'antd'
import { 
  BranchesOutlined, 
  BgColorsOutlined, 
  BarChartOutlined, 
  ApiOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons'

interface FeatureStatusIndicatorProps {
  features?: {
    conditionalLogic?: boolean
    multiPage?: boolean
    validation?: boolean
    logicBranching?: boolean
    customStyling?: boolean
    analytics?: boolean
    apiIntegration?: boolean
  }
  style?: React.CSSProperties
}

const FeatureStatusIndicator: FC<FeatureStatusIndicatorProps> = ({ 
  features = {},
  style = {}
}) => {
  const featureList = [
    {
      key: 'conditionalLogic',
      icon: <BranchesOutlined />,
      title: '条件逻辑',
      enabled: features.conditionalLogic || false,
      phase: 3
    },
    {
      key: 'multiPage',
      icon: <FileTextOutlined />,
      title: '多页面',
      enabled: features.multiPage || false,
      phase: 3
    },
    {
      key: 'validation',
      icon: <CheckCircleOutlined />,
      title: '验证规则',
      enabled: features.validation || false,
      phase: 3
    },
    {
      key: 'logicBranching',
      icon: <SettingOutlined />,
      title: '逻辑分支',
      enabled: features.logicBranching || false,
      phase: 5
    },
    {
      key: 'customStyling',
      icon: <BgColorsOutlined />,
      title: '自定义样式',
      enabled: features.customStyling || false,
      phase: 5
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      title: '高级分析',
      enabled: features.analytics || false,
      phase: 5
    },
    {
      key: 'apiIntegration',
      icon: <ApiOutlined />,
      title: 'API集成',
      enabled: features.apiIntegration || false,
      phase: 5
    }
  ]

  const enabledCount = featureList.filter(f => f.enabled).length
  const totalCount = featureList.length

  const getStatusColor = (enabled: boolean, phase: number) => {
    if (!enabled) return '#d9d9d9'
    return phase === 3 ? '#52c41a' : '#722ed1'
  }

  const getOverallStatus = () => {
    const ratio = enabledCount / totalCount
    if (ratio >= 0.8) return { color: '#52c41a', text: '优秀' }
    if (ratio >= 0.6) return { color: '#faad14', text: '良好' }
    if (ratio >= 0.4) return { color: '#fa8c16', text: '一般' }
    return { color: '#f5222d', text: '基础' }
  }

  const overallStatus = getOverallStatus()

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8,
      padding: '4px 8px',
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      fontSize: '12px',
      ...style 
    }}>
      {/* 总体状态 */}
      <Tooltip title={`功能完成度: ${enabledCount}/${totalCount}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrophyOutlined style={{ color: overallStatus.color }} />
          <span style={{ color: overallStatus.color, fontWeight: 'bold' }}>
            {overallStatus.text}
          </span>
        </div>
      </Tooltip>

      {/* 分隔线 */}
      <div style={{ width: '1px', height: '16px', backgroundColor: '#d9d9d9' }} />

      {/* 功能状态指示器 */}
      <Space size={4}>
        {featureList.map((feature) => (
          <Tooltip key={feature.key} title={`${feature.title} (Phase ${feature.phase})`}>
            <Badge
              dot
              color={getStatusColor(feature.enabled, feature.phase)}
              offset={[-2, 2]}
            >
              <div style={{ 
                color: getStatusColor(feature.enabled, feature.phase),
                fontSize: '14px',
                opacity: feature.enabled ? 1 : 0.3
              }}>
                {feature.icon}
              </div>
            </Badge>
          </Tooltip>
        ))}
      </Space>

      {/* 功能统计 */}
      <div style={{ 
        fontSize: '11px', 
        color: '#666',
        marginLeft: 4
      }}>
        {enabledCount}/{totalCount}
      </div>
    </div>
  )
}

export default FeatureStatusIndicator