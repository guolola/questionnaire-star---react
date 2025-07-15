export type PaymentMethod = {
  id: string
  name: string
  type: 'alipay' | 'wechat' | 'card' | 'other'
  description?: string
  fee?: string
  enabled: boolean
}

export type PaymentValue = {
  paymentMethod: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  transactionId?: string
  timestamp?: number
}

export type QuestionPaymentPropsType = {
  title?: string
  amount?: number
  currency?: string
  paymentMethods?: PaymentMethod[]
  allowCustomAmount?: boolean
  minAmount?: number
  maxAmount?: number
  disabled?: boolean
  value?: PaymentValue
  onChange?: (value: PaymentValue) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionPaymentPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number; amount?: number }>
}

export const QuestionPaymentDefaultProps: QuestionPaymentPropsType = {
  title: '支付',
  amount: 100,
  currency: 'CNY',
  paymentMethods: [
    {
      id: 'alipay',
      name: '支付宝',
      type: 'alipay',
      description: '使用支付宝快捷支付',
      enabled: true
    },
    {
      id: 'wechat',
      name: '微信支付',
      type: 'wechat',
      description: '使用微信支付',
      enabled: true
    },
    {
      id: 'card',
      name: '银行卡',
      type: 'card',
      description: '使用银行卡支付',
      fee: '0.6%',
      enabled: true
    }
  ],
  allowCustomAmount: false,
  minAmount: 0.01,
  maxAmount: 10000,
  disabled: false,
}