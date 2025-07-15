export type RankingOptionType = {
  key: string
  text: string
}

export type QuestionRankingPropsType = {
  title?: string
  options?: RankingOptionType[]
  disabled?: boolean
  value?: RankingOptionType[]
  onChange?: (value: RankingOptionType[]) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionRankingPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionRankingDefaultProps: QuestionRankingPropsType = {
  title: '排序题',
  options: [
    { key: 'option1', text: '选项1' },
    { key: 'option2', text: '选项2' },
    { key: 'option3', text: '选项3' },
    { key: 'option4', text: '选项4' }
  ],
  disabled: false,
  value: [],
}