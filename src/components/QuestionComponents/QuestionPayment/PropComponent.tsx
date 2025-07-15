import React, { FC, useEffect } from 'react'
import { Form, Input, InputNumber, Select, Switch, Button, Space, Card } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type QuestionPaymentPropsType, type PaymentMethod } from './interface'

const PropComponent: FC<QuestionPaymentPropsType> = (props: QuestionPaymentPropsType) => {
  const { 
    title, 
    amount, 
    currency, 
    paymentMethods, 
    allowCustomAmount, 
    minAmount, 
    maxAmount, 
    disabled, 
    onChange 
  } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title,
      amount,
      currency,
      paymentMethods,
      allowCustomAmount,
      minAmount,
      maxAmount,
      disabled
    })
  }, [title, amount, currency, paymentMethods, allowCustomAmount, minAmount, maxAmount, disabled])

  const handleValuesChange = () => {
    if (onChange) {
      const newValues = form.getFieldsValue()
      onChange(newValues)
    }
  }

  const addPaymentMethod = () => {
    const currentMethods = form.getFieldValue('paymentMethods') || []
    const newMethod: PaymentMethod = {
      id: `method_${Date.now()}`,
      name: '新支付方式',
      type: 'other',
      description: '',
      enabled: true
    }
    form.setFieldsValue({ paymentMethods: [...currentMethods, newMethod] })
    handleValuesChange()
  }

  const removePaymentMethod = (index: number) => {
    const currentMethods = form.getFieldValue('paymentMethods') || []
    const newMethods = currentMethods.filter((_: any, i: number) => i !== index)
    form.setFieldsValue({ paymentMethods: newMethods })
    handleValuesChange()
  }

  const paymentTypeOptions = [
    { label: '支付宝', value: 'alipay' },
    { label: '微信支付', value: 'wechat' },
    { label: '银行卡', value: 'card' },
    { label: '其他', value: 'other' }
  ]

  const currencyOptions = [
    { label: '人民币 (CNY)', value: 'CNY' },
    { label: '美元 (USD)', value: 'USD' },
    { label: '欧元 (EUR)', value: 'EUR' }
  ]

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{
        title,
        amount,
        currency,
        paymentMethods,
        allowCustomAmount,
        minAmount,
        maxAmount,
        disabled
      }}
    >
      <Form.Item label="标题" name="title">
        <Input placeholder="请输入标题" />
      </Form.Item>

      <Form.Item label="默认金额" name="amount">
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item label="货币类型" name="currency">
        <Select options={currencyOptions} />
      </Form.Item>

      <Form.Item label="允许自定义金额" name="allowCustomAmount" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Space style={{ width: '100%' }}>
        <Form.Item label="最小金额" name="minAmount" style={{ flex: 1 }}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="最大金额" name="maxAmount" style={{ flex: 1 }}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Space>

      <Form.Item label="支付方式">
        <Form.List name="paymentMethods">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card key={field.key} size="small" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <Space style={{ width: '100%', marginBottom: 8 }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          rules={[{ required: true, message: '请输入支付方式名称' }]}
                          style={{ marginBottom: 0, flex: 1 }}
                        >
                          <Input placeholder="支付方式名称" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'type']}
                          style={{ marginBottom: 0, width: 120 }}
                        >
                          <Select options={paymentTypeOptions} />
                        </Form.Item>
                      </Space>

                      <Form.Item
                        {...field}
                        name={[field.name, 'description']}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="描述信息（可选）" />
                      </Form.Item>

                      <Space style={{ width: '100%' }}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'fee']}
                          style={{ marginBottom: 0, flex: 1 }}
                        >
                          <Input placeholder="手续费（可选）" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'enabled']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                        >
                          <Switch size="small" />
                        </Form.Item>
                        <span style={{ fontSize: '12px', color: '#666' }}>启用</span>
                      </Space>
                    </div>

                    <Button
                      type="link"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removePaymentMethod(index)}
                    />
                  </div>
                </Card>
              ))}

              <Button
                type="dashed"
                onClick={addPaymentMethod}
                icon={<PlusOutlined />}
                style={{ width: '100%' }}
              >
                添加支付方式
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