export type QuestionRatingPropsType = {
  title?: string
  allowHalf?: boolean
  allowClear?: boolean
  count?: number
  disabled?: boolean
  value?: number
  onChange?: (value: number) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionRatingPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionRatingDefaultProps: QuestionRatingPropsType = {
  title: '评分题',
  allowHalf: false,
  allowClear: true,
  count: 5,
  disabled: false,
}