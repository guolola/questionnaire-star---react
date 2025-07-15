import React, { FC } from 'react'
import { Slider } from 'antd'
import { type QuestionSliderPropsType } from './interface'

const QuestionSlider: FC<QuestionSliderPropsType> = (props: QuestionSliderPropsType) => {
  const { 
    title, 
    min = 0, 
    max = 100, 
    step = 1,
    range = false,
    showMarks = false,
    disabled,
    value,
    onChange 
  } = props

  const handleChange = (value: number | number[]) => {
    if (onChange) {
      onChange(value)
    }
  }

  const marks = showMarks ? {
    [min]: min.toString(),
    [max]: max.toString(),
    [Math.floor((min + max) / 2)]: Math.floor((min + max) / 2).toString()
  } : undefined

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 24 }}>
        <span>{title}</span>
      </div>
      <div style={{ padding: '0 10px' }}>
        <Slider
          min={min}
          max={max}
          step={step}
          range={range}
          marks={marks}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          tooltip={{ formatter: (value) => `${value}` }}
        />
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 8,
        color: '#666',
        fontSize: '12px'
      }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default QuestionSlider