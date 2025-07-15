import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionSliderDefaultProps } from './interface'

export * from './interface'

export default {
  title: '滑块题',
  type: 'questionSlider',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionSliderDefaultProps,
}