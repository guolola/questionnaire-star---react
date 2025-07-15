import React, { FC, useEffect } from 'react'
import { Form, Input, Switch } from 'antd'
import { type QuestionDatePickerPropsType } from './interface'

const PropComponent: FC<QuestionDatePickerPropsType> = (props: QuestionDatePickerPropsType) => {
  const { title, placeholder, dateFormat, showTime, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, dateFormat, showTime, disabled })
  }, [title, placeholder, dateFormat, showTime, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ title, placeholder, dateFormat, showTime, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="占位符" name="placeholder">
        <Input placeholder="请输入占位符" />
      </Form.Item>
      <Form.Item label="日期格式" name="dateFormat">
        <Input placeholder="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="显示时间" name="showTime" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent