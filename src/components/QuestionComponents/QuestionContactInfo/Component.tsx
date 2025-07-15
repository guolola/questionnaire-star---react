import React, { FC } from 'react'
import { Form, Input, Select, Row, Col } from 'antd'
import { type QuestionContactInfoPropsType, type ContactField } from './interface'

const QuestionContactInfo: FC<QuestionContactInfoPropsType> = (props: QuestionContactInfoPropsType) => {
  const { 
    title, 
    fields = [],
    layout = 'horizontal',
    required = false,
    disabled,
    value = {},
    onChange 
  } = props

  const handleFieldChange = (fieldKey: string, fieldValue: string) => {
    if (onChange) {
      onChange({
        ...value,
        [fieldKey]: fieldValue
      })
    }
  }

  const renderField = (field: ContactField) => {
    const fieldValue = value[field.key] || ''
    
    const commonProps = {
      placeholder: field.placeholder,
      disabled: disabled || field.disabled,
      value: fieldValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.key, e.target.value)
    }

    let inputComponent
    switch (field.type) {
      case 'email':
        inputComponent = <Input type="email" {...commonProps} />
        break
      case 'phone':
        inputComponent = <Input type="tel" {...commonProps} />
        break
      case 'select':
        inputComponent = (
          <Select
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            value={fieldValue || undefined}
            onChange={(val) => handleFieldChange(field.key, val)}
            options={field.options || []}
          />
        )
        break
      case 'textarea':
        inputComponent = (
          <Input.TextArea 
            rows={3}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        )
        break
      default:
        inputComponent = <Input {...commonProps} />
    }

    return (
      <Form.Item
        key={field.key}
        label={field.label}
        required={required || field.required}
        style={{ marginBottom: 16 }}
      >
        {inputComponent}
      </Form.Item>
    )
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
      </div>
      <Form layout="vertical">
        {layout === 'horizontal' ? (
          <Row gutter={16}>
            {fields.map(field => (
              <Col key={field.key} span={field.span || 12}>
                {renderField(field)}
              </Col>
            ))}
          </Row>
        ) : (
          fields.map(renderField)
        )}
      </Form>
    </div>
  )
}

export default QuestionContactInfo