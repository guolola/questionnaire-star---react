export type QuestionSignaturePropsType = {
  title?: string
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  backgroundColor?: string
  disabled?: boolean
  required?: boolean
  value?: string // base64 图片数据
  onChange?: (value: string) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionSignaturePropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionSignatureDefaultProps: QuestionSignaturePropsType = {
  title: '电子签名',
  width: 400,
  height: 200,
  strokeColor: '#000000',
  strokeWidth: 2,
  backgroundColor: '#ffffff',
  disabled: false,
  required: false,
  value: '',
}