import React, { FC } from 'react'
import { Rate } from 'antd'
import { type QuestionRatingPropsType } from './interface'

const QuestionRating: FC<QuestionRatingPropsType> = (props: QuestionRatingPropsType) => {
  const { 
    title, 
    allowHalf = false, 
    allowClear = true, 
    count = 5, 
    disabled, 
    value, 
    onChange 
  } = props

  const handleChange = (value: number) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 8 }}>
        <span>{title}</span>
      </div>
      <Rate
        allowHalf={allowHalf}
        allowClear={allowClear}
        count={count}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        style={{ fontSize: '24px' }}
      />
    </div>
  )
}

export default QuestionRating