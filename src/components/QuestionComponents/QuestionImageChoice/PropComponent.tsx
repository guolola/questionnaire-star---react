import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Switch, InputNumber, Button, Space, Upload, message } from 'antd'
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { type QuestionImageChoicePropsType, type ImageOptionType } from './interface'

const PropComponent: FC<QuestionImageChoicePropsType> = (props: QuestionImageChoicePropsType) => {
  const { title, options, selectionType, showLabels, imageSize, columns, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, options, selectionType, showLabels, imageSize, columns, disabled })
  }, [title, options, selectionType, showLabels, imageSize, columns, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addOption = () => {
    const currentOptions = form.getFieldValue('options') || []
    const newOptions = [...currentOptions, {
      value: `option${currentOptions.length + 1}`,
      text: `选项${currentOptions.length + 1}`,
      imageUrl: 'https://via.placeholder.com/120x120/1890ff/white?text=' + (currentOptions.length + 1)
    }]
    form.setFieldsValue({ options: newOptions })
    handleValuesChange()
  }

  const removeOption = (index: number) => {
    const currentOptions = form.getFieldValue('options') || []
    const newOptions = currentOptions.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ options: newOptions })
    handleValuesChange()
  }

  const handleImageUpload = (index: number, file: File) => {
    // 在实际应用中，这里应该上传图片到服务器并返回URL
    // 这里模拟上传过程
    const reader = new FileReader()
    reader.onload = (e) => {
      const currentOptions = form.getFieldValue('options') || []
      const newOptions = currentOptions.map((option: ImageOptionType, i: number) => {
        if (i === index) {
          return { ...option, imageUrl: e.target?.result as string }
        }
        return option
      })
      form.setFieldsValue({ options: newOptions })
      handleValuesChange()
    }
    reader.readAsDataURL(file)
    return false // 阻止默认上传行为
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ title, options, selectionType, showLabels, imageSize, columns, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      
      <Form.Item label="选择类型" name="selectionType">
        <Select>
          <Select.Option value="single">单选</Select.Option>
          <Select.Option value="multiple">多选</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="图片尺寸" name="imageSize">
        <Select>
          <Select.Option value="small">小 (80x80)</Select.Option>
          <Select.Option value="medium">中 (120x120)</Select.Option>
          <Select.Option value="large">大 (160x160)</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="列数" name="columns">
        <InputNumber min={1} max={4} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="显示标签" name="showLabels" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="图片选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} style={{ display: 'block', marginBottom: 16 }} align="baseline">
                  <div style={{ 
                    border: '1px solid #d9d9d9', 
                    borderRadius: 6, 
                    padding: 12,
                    width: '100%'
                  }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'text']}
                      rules={[{ required: true, message: '请输入选项文本' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="选项文本" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'value']}
                      rules={[{ required: true, message: '请输入选项值' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="选项值" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'imageUrl']}
                      rules={[{ required: true, message: '请输入图片URL' }]}
                      style={{ marginBottom: 8 }}
                    >
                      <Input placeholder="图片URL" />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => handleImageUpload(index, file)}
                      >
                        <Button icon={<UploadOutlined />} size="small">
                          上传图片
                        </Button>
                      </Upload>
                      <Button
                        type="link"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeOption(index)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
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