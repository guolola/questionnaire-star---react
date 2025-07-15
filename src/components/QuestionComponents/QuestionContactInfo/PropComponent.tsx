import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Switch, Button, Space, InputNumber, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type QuestionContactInfoPropsType, type ContactField } from './interface'

const PropComponent: FC<QuestionContactInfoPropsType> = (props: QuestionContactInfoPropsType) => {
  const { title, fields, layout, required, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, fields, layout, required, disabled })
  }, [title, fields, layout, required, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addField = () => {
    const currentFields = form.getFieldValue('fields') || []
    const newField: ContactField = {
      key: `field_${Date.now()}`,
      label: `字段${currentFields.length + 1}`,
      type: 'text',
      placeholder: '请输入...',
      required: false,
      span: 12
    }
    form.setFieldsValue({ fields: [...currentFields, newField] })
    handleValuesChange()
  }

  const removeField = (index: number) => {
    const currentFields = form.getFieldValue('fields') || []
    const newFields = currentFields.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ fields: newFields })
    handleValuesChange()
  }

  const fieldTypeOptions = [
    { label: '文本', value: 'text' },
    { label: '邮箱', value: 'email' },
    { label: '手机号', value: 'phone' },
    { label: '下拉选择', value: 'select' },
    { label: '多行文本', value: 'textarea' }
  ]

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ title, fields, layout, required, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      
      <Form.Item label="布局方式" name="layout">
        <Select>
          <Select.Option value="horizontal">水平布局</Select.Option>
          <Select.Option value="vertical">垂直布局</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="整体必填" name="required" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="字段配置">
        <Form.List name="fields">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card key={field.key} size="small" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'label']}
                        rules={[{ required: true, message: '请输入字段标签' }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="字段标签" />
                      </Form.Item>
                      
                      <Space style={{ width: '100%', marginBottom: 8 }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'key']}
                          rules={[{ required: true, message: '请输入字段键' }]}
                          style={{ marginBottom: 0, flex: 1 }}
                        >
                          <Input placeholder="字段键" />
                        </Form.Item>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'type']}
                          style={{ marginBottom: 0, width: 120 }}
                        >
                          <Select options={fieldTypeOptions} />
                        </Form.Item>
                      </Space>
                      
                      <Form.Item
                        {...field}
                        name={[field.name, 'placeholder']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="占位符文本" />
                      </Form.Item>
                      
                      <Space style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'span']}
                          label="栅格宽度"
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={1} max={24} />
                        </Form.Item>
                        
                        <Form.Item
                          {...field}
                          name={[field.name, 'required']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                        >
                          <Switch size="small" />
                        </Form.Item>
                        <span style={{ fontSize: '12px', color: '#666' }}>必填</span>
                      </Space>
                    </div>
                    
                    <Button
                      type="link"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeField(index)}
                    />
                  </div>
                </Card>
              ))}
              
              <Button
                type="dashed"
                onClick={addField}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                添加字段
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