import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionImageChoiceDefaultProps } from './interface'

export * from './interface'

export default {
  title: '图片选择',
  type: 'questionImageChoice',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionImageChoiceDefaultProps,
}