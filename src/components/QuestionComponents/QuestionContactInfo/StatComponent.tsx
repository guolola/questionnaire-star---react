import React, { FC, useMemo } from 'react'
import { Card, Progress, Typography, Divider } from 'antd'
import { type QuestionContactInfoPropsType } from './interface'

const { Title, Text } = Typography

const StatComponent: FC<QuestionContactInfoPropsType> = ({ stat = [], fields = [] }) => {
  const totalSubmissions = useMemo(() => {
    return stat.length > 0 ? stat.reduce((max, item) => Math.max(max, item.count), 0) : 0
  }, [stat])

  const fieldCompletionRate = useMemo(() => {
    return fields.map(field => {
      const fieldStat = stat.find(s => s.name === field.key)
      const completionCount = fieldStat ? fieldStat.count : 0
      const completionRate = totalSubmissions > 0 ? (completionCount / totalSubmissions) * 100 : 0
      
      return {
        ...field,
        completionCount,
        completionRate
      }
    })
  }, [fields, stat, totalSubmissions])

  const overallCompletionRate = useMemo(() => {
    if (fields.length === 0) return 0
    const totalRate = fieldCompletionRate.reduce((sum, field) => sum + field.completionRate, 0)
    return totalRate / fields.length
  }, [fieldCompletionRate, fields.length])

  return (
    <div style={{ width: '100%' }}>
      <Title level={4}>联系信息统计</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={5} style={{ marginBottom: 4 }}>总提交次数</Title>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {totalSubmissions}
            </Text>
          </div>
          <div>
            <Title level={5} style={{ marginBottom: 4 }}>整体完成率</Title>
            <Progress 
              type="circle" 
              percent={Math.round(overallCompletionRate)} 
              width={80}
              format={(percent) => `${percent}%`}
            />
          </div>
        </div>
      </Card>

      <Divider />

      <Title level={5}>字段完成情况</Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {fieldCompletionRate.map((field, index) => (
          <Card key={field.key} size="small">
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>{field.label}</Text>
                <Text type="secondary">{field.type}</Text>
              </div>
              {field.required && (
                <Text type="danger" style={{ fontSize: '12px' }}>必填</Text>
              )}
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <Progress 
                percent={Math.round(field.completionRate)} 
                strokeColor={field.completionRate >= 80 ? '#52c41a' : field.completionRate >= 60 ? '#faad14' : '#ff4d4f'}
                showInfo={false}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
              <span>完成: {field.completionCount}</span>
              <span>比例: {field.completionRate.toFixed(1)}%</span>
            </div>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <Text type="secondary">暂无字段数据</Text>
        </div>
      )}
    </div>
  )
}

export default StatComponent