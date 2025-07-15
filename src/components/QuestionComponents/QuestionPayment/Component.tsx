import React, { FC, useState } from 'react'
import { Card, Button, Select, InputNumber, Typography, Space, Tag, Modal, message } from 'antd'
import { CreditCardOutlined, AlipayOutlined, WechatOutlined, PayCircleOutlined } from '@ant-design/icons'
import { type QuestionPaymentPropsType, type PaymentMethod } from './interface'

const { Title, Text } = Typography

const QuestionPayment: FC<QuestionPaymentPropsType> = (props: QuestionPaymentPropsType) => {
  const { 
    title, 
    amount,
    currency = 'CNY',
    paymentMethods = [],
    allowCustomAmount = false,
    minAmount = 0,
    maxAmount = 10000,
    disabled,
    value,
    onChange 
  } = props

  const [selectedMethod, setSelectedMethod] = useState<string>(value?.paymentMethod || '')
  const [customAmount, setCustomAmount] = useState<number>(value?.amount || amount || 0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method)
    if (onChange) {
      onChange({
        paymentMethod: method,
        amount: customAmount,
        currency,
        status: 'pending'
      })
    }
  }

  const handleAmountChange = (newAmount: number) => {
    setCustomAmount(newAmount)
    if (onChange) {
      onChange({
        paymentMethod: selectedMethod,
        amount: newAmount,
        currency,
        status: 'pending'
      })
    }
  }

  const handlePayment = () => {
    if (!selectedMethod) {
      message.error('请选择支付方式')
      return
    }
    if (customAmount <= 0) {
      message.error('请输入有效金额')
      return
    }
    
    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = () => {
    // 模拟支付过程
    message.loading('正在处理支付...', 2)
    setTimeout(() => {
      message.success('支付成功！')
      if (onChange) {
        onChange({
          paymentMethod: selectedMethod,
          amount: customAmount,
          currency,
          status: 'completed',
          transactionId: `tx_${Date.now()}`
        })
      }
      setShowPaymentModal(false)
    }, 2000)
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'alipay':
        return <AlipayOutlined style={{ color: '#1677ff' }} />
      case 'wechat':
        return <WechatOutlined style={{ color: '#07c160' }} />
      case 'card':
        return <CreditCardOutlined style={{ color: '#722ed1' }} />
      default:
        return <PayCircleOutlined />
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>
            {formatAmount(customAmount)}
          </Title>
          {allowCustomAmount && (
            <Space>
              <Text>自定义金额：</Text>
              <InputNumber
                min={minAmount}
                max={maxAmount}
                value={customAmount}
                onChange={handleAmountChange}
                disabled={disabled}
                style={{ width: 120 }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Space>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>选择支付方式：</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                size="small"
                hoverable
                style={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: selectedMethod === method.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
                onClick={() => {
                  if (!disabled) {
                    handlePaymentMethodChange(method.id)
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getPaymentIcon(method)}
                  <div style={{ flex: 1 }}>
                    <Text strong>{method.name}</Text>
                    {method.description && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {method.description}
                      </div>
                    )}
                  </div>
                  {method.fee && (
                    <Tag color="orange" size="small">
                      手续费: {method.fee}
                    </Tag>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<PayCircleOutlined />}
            onClick={handlePayment}
            disabled={disabled || !selectedMethod || customAmount <= 0}
          >
            立即支付
          </Button>
        </div>

        {value?.status === 'completed' && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Tag color="success">支付成功</Tag>
            {value.transactionId && (
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
                交易号: {value.transactionId}
              </Text>
            )}
          </div>
        )}
      </Card>

      <Modal
        title="确认支付"
        open={showPaymentModal}
        onOk={handlePaymentConfirm}
        onCancel={() => setShowPaymentModal(false)}
        okText="确认支付"
        cancelText="取消"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={4}>支付金额: {formatAmount(customAmount)}</Title>
          <Text>支付方式: {paymentMethods.find(m => m.id === selectedMethod)?.name}</Text>
          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              这是一个演示支付组件，实际应用中需要集成真实的支付网关。
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default QuestionPayment