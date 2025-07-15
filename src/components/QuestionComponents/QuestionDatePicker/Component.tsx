import React, { FC } from 'react'
import { DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import { type QuestionDatePickerPropsType } from './interface'

const QuestionDatePicker: FC<QuestionDatePickerPropsType> = (props: QuestionDatePickerPropsType) => {
  const { title, placeholder, dateFormat = 'YYYY-MM-DD', showTime = false, disabled, value, onChange } = props

  const handleChange = (date: Dayjs | null, dateString: string) => {
    if (onChange) {
      onChange(dateString)
    }
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 8 }}>
        <span>{title}</span>
      </div>
      <DatePicker
        placeholder={placeholder}
        format={dateFormat}
        showTime={showTime}
        disabled={disabled}
        value={value ? value as any : null}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
    </div>
  )
}

export default QuestionDatePicker