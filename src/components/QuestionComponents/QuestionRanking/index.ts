import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionRankingDefaultProps } from './interface'

export * from './interface'

export default {
  title: '排序题',
  type: 'questionRanking',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionRankingDefaultProps,
}