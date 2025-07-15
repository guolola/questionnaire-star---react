import React, { FC } from 'react'
import { Radio, Checkbox, Card, Image } from 'antd'
import { type QuestionImageChoicePropsType, type ImageOptionType } from './interface'

const QuestionImageChoice: FC<QuestionImageChoicePropsType> = (props: QuestionImageChoicePropsType) => {
  const { 
    title, 
    options = [], 
    selectionType = 'single',
    showLabels = true,
    imageSize = 'medium',
    columns = 2,
    disabled,
    value,
    onChange 
  } = props

  const handleSingleChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue)
    }
  }

  const handleMultipleChange = (optionValue: string, checked: boolean) => {
    if (onChange) {
      const currentValue = Array.isArray(value) ? value : []
      if (checked) {
        onChange([...currentValue, optionValue])
      } else {
        onChange(currentValue.filter(v => v !== optionValue))
      }
    }
  }

  const getImageSize = () => {
    switch (imageSize) {
      case 'small': return { width: 80, height: 80 }
      case 'medium': return { width: 120, height: 120 }
      case 'large': return { width: 160, height: 160 }
      default: return { width: 120, height: 120 }
    }
  }

  const renderOption = (option: ImageOptionType) => {
    const isSelected = selectionType === 'single' 
      ? value === option.value 
      : Array.isArray(value) && value.includes(option.value)

    return (
      <Card
        key={option.value}
        hoverable
        style={{
          marginBottom: 16,
          border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        bodyStyle={{ padding: 12 }}
        onClick={() => {
          if (disabled) return
          if (selectionType === 'single') {
            handleSingleChange(option.value)
          } else {
            handleMultipleChange(option.value, !isSelected)
          }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Image
            src={option.imageUrl}
            alt={option.text}
            style={{
              ...getImageSize(),
              objectFit: 'cover',
              borderRadius: 4
            }}
            preview={false}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          />
          {showLabels && (
            <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
              {option.text}
            </div>
          )}
          <div style={{ marginTop: 4 }}>
            {selectionType === 'single' ? (
              <Radio
                checked={isSelected}
                disabled={disabled}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 16
      }}>
        {options.map(renderOption)}
      </div>
    </div>
  )
}

export default QuestionImageChoice