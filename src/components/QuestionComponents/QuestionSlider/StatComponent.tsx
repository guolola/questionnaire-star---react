import React, { FC, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type QuestionSliderPropsType } from './interface'

const StatComponent: FC<QuestionSliderPropsType> = ({ stat = [] }) => {
  const data = useMemo(() => {
    return stat.map(item => ({
      name: item.name,
      count: item.count
    }))
  }, [stat])

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatComponent