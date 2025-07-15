import React, { FC } from 'react'
import { Select } from 'antd'
import { type QuestionSelectPropsType, type OptionType } from './interface'

const QuestionSelect: FC<QuestionSelectPropsType> = (props: QuestionSelectPropsType) => {
  const { 
    title, 
    placeholder, 
    options = [], 
    allowClear = true, 
    showSearch = false,
    disabled, 
    value, 
    onChange 
  } = props

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 8 }}>
        <span>{title}</span>
      </div>
      <Select
        placeholder={placeholder}
        allowClear={allowClear}
        showSearch={showSearch}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        {options.map((option: OptionType) => (
          <Select.Option key={option.value} value={option.value}>
            {option.text}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default QuestionSelect