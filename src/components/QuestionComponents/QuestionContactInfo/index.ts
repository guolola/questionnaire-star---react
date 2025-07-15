import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionContactInfoDefaultProps } from './interface'

export * from './interface'

export default {
  title: '联系信息',
  type: 'questionContactInfo',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionContactInfoDefaultProps,
}