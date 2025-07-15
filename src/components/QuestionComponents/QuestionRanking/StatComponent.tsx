import React, { FC, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { type QuestionRankingPropsType } from './interface'

const StatComponent: FC<QuestionRankingPropsType> = ({ stat = [] }) => {
  const data = useMemo(() => {
    return stat.map(item => ({
      name: item.name,
      count: item.count
    }))
  }, [stat])

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatComponent