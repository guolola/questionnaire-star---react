import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionDatePickerDefaultProps } from './interface'

export * from './interface'

export default {
  title: '日期选择',
  type: 'questionDatePicker',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionDatePickerDefaultProps,
}