import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionSignatureDefaultProps } from './interface'

export * from './interface'

export default {
  title: '电子签名',
  type: 'questionSignature',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionSignatureDefaultProps,
}