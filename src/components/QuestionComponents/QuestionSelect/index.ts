import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionSelectDefaultProps } from './interface'

export * from './interface'

export default {
  title: '下拉选择',
  type: 'questionSelect',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionSelectDefaultProps,
}