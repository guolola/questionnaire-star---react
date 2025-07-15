import React, { FC } from 'react'
import { InputNumber } from 'antd'
import { type QuestionNumberPropsType } from './interface'

const QuestionNumber: FC<QuestionNumberPropsType> = (props: QuestionNumberPropsType) => {
  const { 
    title, 
    placeholder, 
    min, 
    max, 
    step = 1,
    precision,
    disabled, 
    value, 
    onChange 
  } = props

  const handleChange = (value: number | null) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 8 }}>
        <span>{title}</span>
      </div>
      <InputNumber
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        precision={precision}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </div>
  )
}

export default QuestionNumber