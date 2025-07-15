import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, InputNumber } from 'antd'
import { type QuestionNumberPropsType } from './interface'

const PropComponent: FC<QuestionNumberPropsType> = (props: QuestionNumberPropsType) => {
  const { title, placeholder, min, max, step, precision, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, min, max, step, precision, disabled })
  }, [title, placeholder, min, max, step, precision, disabled])

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
      initialValues={{ title, placeholder, min, max, step, precision, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="占位符" name="placeholder">
        <Input placeholder="请输入占位符" />
      </Form.Item>
      <Form.Item label="最小值" name="min">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="最大值" name="max">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="步长" name="step">
        <InputNumber min={0.01} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="小数位数" name="precision">
        <InputNumber min={0} max={10} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent