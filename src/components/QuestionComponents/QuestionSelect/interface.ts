export type OptionType = {
  value: string
  text: string
}

export type QuestionSelectPropsType = {
  title?: string
  placeholder?: string
  options?: OptionType[]
  allowClear?: boolean
  showSearch?: boolean
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionSelectPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionSelectDefaultProps: QuestionSelectPropsType = {
  title: '下拉选择题',
  placeholder: '请选择...',
  options: [
    { value: 'option1', text: '选项1' },
    { value: 'option2', text: '选项2' },
    { value: 'option3', text: '选项3' }
  ],
  allowClear: true,
  showSearch: false,
  disabled: false,
}