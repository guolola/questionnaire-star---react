export type QuestionSliderPropsType = {
  title?: string
  min?: number
  max?: number
  step?: number
  range?: boolean
  showMarks?: boolean
  disabled?: boolean
  value?: number | number[]
  onChange?: (value: number | number[]) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionSliderPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionSliderDefaultProps: QuestionSliderPropsType = {
  title: '滑块题',
  min: 0,
  max: 100,
  step: 1,
  range: false,
  showMarks: false,
  disabled: false,
}