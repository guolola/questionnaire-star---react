export type QuestionNumberPropsType = {
  title?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  precision?: number
  disabled?: boolean
  value?: number | null
  onChange?: (value: number | null) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionNumberPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionNumberDefaultProps: QuestionNumberPropsType = {
  title: '数字输入题',
  placeholder: '请输入数字',
  step: 1,
  disabled: false,
}