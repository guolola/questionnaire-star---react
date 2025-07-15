import React, { FC, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { type QuestionImageChoicePropsType } from './interface'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

const StatComponent: FC<QuestionImageChoicePropsType> = ({ stat = [] }) => {
  const data = useMemo(() => {
    return stat.map(item => ({
      name: item.name,
      count: item.count
    }))
  }, [stat])

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0)
  }, [data])

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {/* 饼图 */}
        <div style={{ flex: 1, height: '300px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: 16 }}>选择分布</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 柱状图 */}
        <div style={{ flex: 1, height: '300px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: 16 }}>选择数量</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 详细统计 */}
      <div style={{ marginTop: 16 }}>
        <h4>详细统计</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {data.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                padding: 12, 
                border: '1px solid #d9d9d9', 
                borderRadius: 6,
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                marginBottom: 8
              }}>
                <div 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%',
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
                <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                {item.count}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                占比: {total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatComponent