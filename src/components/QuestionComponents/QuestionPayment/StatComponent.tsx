import React, { FC, useMemo } from 'react'
import { Card, Typography, Statistic, Row, Col } from 'antd'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { type QuestionPaymentPropsType } from './interface'

const { Title } = Typography

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const StatComponent: FC<QuestionPaymentPropsType> = ({ stat = [], currency = 'CNY' }) => {
  const paymentData = useMemo(() => {
    return stat.map(item => ({
      name: item.name,
      count: item.count,
      amount: item.amount || 0
    }))
  }, [stat])

  const totalTransactions = useMemo(() => {
    return paymentData.reduce((sum, item) => sum + item.count, 0)
  }, [paymentData])

  const totalAmount = useMemo(() => {
    return paymentData.reduce((sum, item) => sum + item.amount, 0)
  }, [paymentData])

  const averageAmount = useMemo(() => {
    return totalTransactions > 0 ? totalAmount / totalTransactions : 0
  }, [totalAmount, totalTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div style={{ width: '100%' }}>
      <Title level={4}>支付统计</Title>
      
      {/* 总体统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总交易数"
              value={totalTransactions}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总金额"
              value={formatCurrency(totalAmount)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均金额"
              value={formatCurrency(averageAmount)}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="支付方式"
              value={paymentData.length}
              suffix="种"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表统计 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {/* 支付方式分布 */}
        <Card title="支付方式分布" style={{ flex: 1 }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 支付金额统计 */}
        <Card title="支付金额统计" style={{ flex: 1 }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 详细数据 */}
      <Card title="详细数据">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {paymentData.map((item, index) => (
            <Card key={index} size="small" style={{ backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
                <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>交易数量:</span>
                <span style={{ fontWeight: 'bold' }}>{item.count}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>总金额:</span>
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>平均金额:</span>
                <span style={{ fontWeight: 'bold', color: '#722ed1' }}>
                  {formatCurrency(item.count > 0 ? item.amount / item.count : 0)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {paymentData.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <Title level={4} type="secondary">暂无支付数据</Title>
          </div>
        </Card>
      )}
    </div>
  )
}

export default StatComponent