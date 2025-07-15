import React, { FC, useEffect } from 'react'
import { Form, Input, Button, Space, Switch } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type QuestionRankingPropsType, type RankingOptionType } from './interface'

const PropComponent: FC<QuestionRankingPropsType> = (props: QuestionRankingPropsType) => {
  const { title, options, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, disabled })
  }, [title, options, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addOption = () => {
    const currentOptions = form.getFieldValue('options') || []
    const newOptions = [...currentOptions, { key: `option${currentOptions.length + 1}`, text: `选项${currentOptions.length + 1}` }]
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
      initialValues={{ title, options, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
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
                    name={[field.name, 'key']}
                    rules={[{ required: true, message: '请输入选项键值' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="选项键值" />
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

      <Form.Item label="禁用" name="disabled" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  )
}

export default PropComponent