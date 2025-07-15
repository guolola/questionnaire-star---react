import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionMatrixDefaultProps } from './interface'

export * from './interface'

export default {
  title: '矩阵题',
  type: 'questionMatrix',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionMatrixDefaultProps,
}