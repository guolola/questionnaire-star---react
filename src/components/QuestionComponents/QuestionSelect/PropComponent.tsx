import React, { FC, useEffect } from 'react'
import { Form, Input, Switch, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type QuestionSelectPropsType, type OptionType } from './interface'

const PropComponent: FC<QuestionSelectPropsType> = (props: QuestionSelectPropsType) => {
  const { title, placeholder, options, allowClear, showSearch, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, placeholder, options, allowClear, showSearch, disabled })
  }, [title, placeholder, options, allowClear, showSearch, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addOption = () => {
    const currentOptions = form.getFieldValue('options') || []
    const newOptions = [...currentOptions, { value: `option${currentOptions.length + 1}`, text: `选项${currentOptions.length + 1}` }]
    form.setFieldsValue({ options: newOptions })
    handleValuesChange()
  }

  const removeOption = (index: number) => {
    const currentOptions = form.getFieldValue('options') || []
    const newOptions = currentOptions.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ options: newOptions })
    handleValuesChange()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ title, placeholder, options, allowClear, showSearch, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="占位符" name="placeholder">
        <Input placeholder="请输入占位符" />
      </Form.Item>
      
      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'text']}
                    rules={[{ required: true, message: '请输入选项文本' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="选项文本" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    rules={[{ required: true, message: '请输入选项值' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="选项值" />
                  </Form.Item>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => removeOption(index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={addOption}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                添加选项
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="允许清空" name="allowClear" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="支持搜索" name="showSearch" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent