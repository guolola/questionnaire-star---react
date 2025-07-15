import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionRatingDefaultProps } from './interface'

export * from './interface'

export default {
  title: '评分题',
  type: 'questionRating',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionRatingDefaultProps,
}