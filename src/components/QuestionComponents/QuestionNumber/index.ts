import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionNumberDefaultProps } from './interface'

export * from './interface'

export default {
  title: '数字输入',
  type: 'questionNumber',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionNumberDefaultProps,
}