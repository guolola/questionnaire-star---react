import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, InputNumber, Select } from 'antd'
import { type QuestionFileUploadPropsType } from './interface'

const PropComponent: FC<QuestionFileUploadPropsType> = (props: QuestionFileUploadPropsType) => {
  const { title, maxCount, maxSize, accept, disabled, buttonText, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, maxCount, maxSize, accept, disabled, buttonText })
  }, [title, maxCount, maxSize, accept, disabled, buttonText])

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
      initialValues={{ title, maxCount, maxSize, accept, disabled, buttonText }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="按钮文字" name="buttonText">
        <Input placeholder="请输入按钮文字" />
      </Form.Item>
      <Form.Item label="最大文件数" name="maxCount">
        <InputNumber min={1} max={10} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="单文件大小限制(MB)" name="maxSize">
        <InputNumber min={1} max={100} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="文件类型" name="accept">
        <Select placeholder="请选择文件类型">
          <Select.Option value="*">所有文件</Select.Option>
          <Select.Option value="image/*">图片文件</Select.Option>
          <Select.Option value="application/pdf">PDF文件</Select.Option>
          <Select.Option value="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word文档</Select.Option>
          <Select.Option value="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel表格</Select.Option>
          <Select.Option value=".zip,.rar,.7z">压缩文件</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent