import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Switch, ColorPicker } from 'antd'
import { type QuestionSignaturePropsType } from './interface'

const PropComponent: FC<QuestionSignaturePropsType> = (props: QuestionSignaturePropsType) => {
  const { 
    title, 
    width, 
    height, 
    strokeColor, 
    strokeWidth, 
    backgroundColor, 
    disabled, 
    required, 
    onChange 
  } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title,
      width,
      height,
      strokeColor,
      strokeWidth,
      backgroundColor,
      disabled,
      required
    })
  }, [title, width, height, strokeColor, strokeWidth, backgroundColor, disabled, required])

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
      initialValues={{
        title,
        width,
        height,
        strokeColor,
        strokeWidth,
        backgroundColor,
        disabled,
        required
      }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="画布宽度" name="width">
        <InputNumber
          min={200}
          max={800}
          style={{ width: '100%' }}
          addonAfter="px"
        />
      </Form.Item>

      <Form.Item label="画布高度" name="height">
        <InputNumber
          min={100}
          max={400}
          style={{ width: '100%' }}
          addonAfter="px"
        />
      </Form.Item>

      <Form.Item label="笔画颜色" name="strokeColor">
        <ColorPicker
          showText
          style={{ width: '100%' }}
          presets={[
            {
              label: '常用颜色',
              colors: [
                '#000000',
                '#1890ff',
                '#52c41a',
                '#faad14',
                '#f5222d',
                '#722ed1',
                '#fa541c',
                '#eb2f96',
                '#13c2c2',
                '#a0d911'
              ]
            }
          ]}
        />
      </Form.Item>

      <Form.Item label="笔画粗细" name="strokeWidth">
        <InputNumber
          min={1}
          max={10}
          style={{ width: '100%' }}
          addonAfter="px"
        />
      </Form.Item>

      <Form.Item label="背景颜色" name="backgroundColor">
        <ColorPicker
          showText
          style={{ width: '100%' }}
          presets={[
            {
              label: '常用颜色',
              colors: [
                '#ffffff',
                '#f5f5f5',
                '#e6f7ff',
                '#f6ffed',
                '#fff7e6',
                '#fff2e8',
                '#f9f0ff',
                '#fff0f6',
                '#e6fffb',
                '#fcffe6'
              ]
            }
          ]}
        />
      </Form.Item>

      <Form.Item label="必填" name="required" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent