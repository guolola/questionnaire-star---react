import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, InputNumber } from 'antd'
import { type QuestionRatingPropsType } from './interface'

const PropComponent: FC<QuestionRatingPropsType> = (props: QuestionRatingPropsType) => {
  const { title, allowHalf, allowClear, count, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, allowHalf, allowClear, count, disabled })
  }, [title, allowHalf, allowClear, count, disabled])

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
      initialValues={{ title, allowHalf, allowClear, count, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="星级数量" name="count">
        <InputNumber min={1} max={10} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="允许半星" name="allowHalf" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="允许清空" name="allowClear" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent