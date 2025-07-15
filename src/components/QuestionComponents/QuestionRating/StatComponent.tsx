import React, { FC, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type QuestionRatingPropsType } from './interface'

const StatComponent: FC<QuestionRatingPropsType> = ({ stat = [] }) => {
  const data = useMemo(() => {
    return stat.map(item => ({
      name: `${item.name}星`,
      count: item.count
    }))
  }, [stat])

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#faad14" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatComponent