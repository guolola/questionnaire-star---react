import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionPaymentDefaultProps } from './interface'

export * from './interface'

export default {
  title: '支付',
  type: 'questionPayment',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionPaymentDefaultProps,
}