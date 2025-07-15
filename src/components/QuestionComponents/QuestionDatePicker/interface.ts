export type QuestionDatePickerPropsType = {
  title?: string
  placeholder?: string
  dateFormat?: string
  showTime?: boolean
  disabled?: boolean
  value?: string
  onChange?: (dateString: string) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionDatePickerPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionDatePickerDefaultProps: QuestionDatePickerPropsType = {
  title: '日期选择题',
  placeholder: '请选择日期',
  dateFormat: 'YYYY-MM-DD',
  showTime: false,
  disabled: false,
}