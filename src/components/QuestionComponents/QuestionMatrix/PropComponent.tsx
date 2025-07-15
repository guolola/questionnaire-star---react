import React, { FC, useEffect } from 'react'
import { Form, Input, Select, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type QuestionMatrixPropsType, type MatrixRowType, type MatrixColumnType } from './interface'

const PropComponent: FC<QuestionMatrixPropsType> = (props: QuestionMatrixPropsType) => {
  const { title, rows, columns, matrixType, disabled, onChange } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, rows, columns, matrixType, disabled })
  }, [title, rows, columns, matrixType, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addRow = () => {
    const currentRows = form.getFieldValue('rows') || []
    const newRows = [...currentRows, { key: `row${currentRows.length + 1}`, label: `问题${currentRows.length + 1}` }]
    form.setFieldsValue({ rows: newRows })
    handleValuesChange()
  }

  const removeRow = (index: number) => {
    const currentRows = form.getFieldValue('rows') || []
    const newRows = currentRows.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ rows: newRows })
    handleValuesChange()
  }

  const addColumn = () => {
    const currentColumns = form.getFieldValue('columns') || []
    const newColumns = [...currentColumns, { key: `col${currentColumns.length + 1}`, label: `选项${currentColumns.length + 1}` }]
    form.setFieldsValue({ columns: newColumns })
    handleValuesChange()
  }

  const removeColumn = (index: number) => {
    const currentColumns = form.getFieldValue('columns') || []
    const newColumns = currentColumns.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ columns: newColumns })
    handleValuesChange()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ title, rows, columns, matrixType, disabled }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>
      
      <Form.Item label="矩阵类型" name="matrixType">
        <Select>
          <Select.Option value="radio">单选</Select.Option>
          <Select.Option value="checkbox">多选</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="行选项（问题）">
        <Form.List name="rows">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'label']}
                    rules={[{ required: true, message: '请输入行标签' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="行标签" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'key']}
                    rules={[{ required: true, message: '请输入行键值' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="行键值" />
                  </Form.Item>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => removeRow(index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={addRow}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                添加行
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="列选项（答案）">
        <Form.List name="columns">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'label']}
                    rules={[{ required: true, message: '请输入列标签' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="列标签" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'key']}
                    rules={[{ required: true, message: '请输入列键值' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="列键值" />
                  </Form.Item>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => removeColumn(index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={addColumn}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                添加列
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
    </Form>
  )
}

export default PropComponent