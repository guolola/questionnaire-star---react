import React, { FC, useMemo } from 'react'
import { Card, Typography, Progress, Space } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { type QuestionSignaturePropsType } from './interface'

const { Title, Text } = Typography

const COLORS = ['#52c41a', '#ff4d4f']

const StatComponent: FC<QuestionSignaturePropsType> = ({ stat = [] }) => {
  const signatureData = useMemo(() => {
    const signed = stat.find(item => item.name === 'signed')?.count || 0
    const unsigned = stat.find(item => item.name === 'unsigned')?.count || 0
    const total = signed + unsigned
    
    return {
      signed,
      unsigned,
      total,
      signedRate: total > 0 ? (signed / total) * 100 : 0
    }
  }, [stat])

  const chartData = useMemo(() => [
    { name: '已签名', value: signatureData.signed, color: COLORS[0] },
    { name: '未签名', value: signatureData.unsigned, color: COLORS[1] }
  ], [signatureData])

  return (
    <div style={{ width: '100%' }}>
      <Title level={4}>签名统计</Title>
      
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {/* 统计卡片 */}
        <div style={{ flex: 1 }}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">总提交数</Text>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                  {signatureData.total}
                </Title>
              </div>
              
              <div>
                <Text type="secondary">已签名数</Text>
                <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                  {signatureData.signed}
                </Title>
              </div>
              
              <div>
                <Text type="secondary">未签名数</Text>
                <Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>
                  {signatureData.unsigned}
                </Title>
              </div>
              
              <div>
                <Text type="secondary">签名完成率</Text>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={Math.round(signatureData.signedRate)}
                    strokeColor="#52c41a"
                    trailColor="#ff4d4f"
                  />
                </div>
              </div>
            </Space>
          </Card>
        </div>

        {/* 饼图 */}
        <div style={{ flex: 1 }}>
          <Card title="签名分布">
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* 详细信息 */}
      <Card title="详细信息">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#52c41a', borderRadius: '50%' }} />
              <Text strong>已签名</Text>
            </div>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
              {signatureData.signed}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              占比 {signatureData.signedRate.toFixed(1)}%
            </Text>
          </div>
          
          <div style={{ padding: 16, backgroundColor: '#fff2f0', borderRadius: 8, border: '1px solid #ffccc7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#ff4d4f', borderRadius: '50%' }} />
              <Text strong>未签名</Text>
            </div>
            <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
              {signatureData.unsigned}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              占比 {(100 - signatureData.signedRate).toFixed(1)}%
            </Text>
          </div>
        </div>
      </Card>

      {signatureData.total === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <Title level={4} type="secondary">暂无签名数据</Title>
            <Text type="secondary">当有用户提交签名后，这里将显示统计信息</Text>
          </div>
        </Card>
      )}
    </div>
  )
}

export default StatComponent