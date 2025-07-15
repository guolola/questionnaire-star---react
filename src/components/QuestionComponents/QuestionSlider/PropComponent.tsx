import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, InputNumber } from 'antd'
import { type QuestionSliderPropsType } from './interface'

const PropComponent: FC<QuestionSliderPropsType> = (props: QuestionSliderPropsType) => {
  const { title, min, max, step, range, showMarks, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, min, max, step, range, showMarks, disabled })
  }, [title, min, max, step, range, showMarks, disabled])

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
      initialValues={{ title, min, max, step, range, showMarks, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
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
      <Form.Item label="范围选择" name="range" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="显示刻度" name="showMarks" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent