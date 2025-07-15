import type { UploadFile } from 'antd'

export type QuestionFileUploadPropsType = {
  title?: string
  maxCount?: number
  maxSize?: number
  accept?: string
  disabled?: boolean
  buttonText?: string
  value?: UploadFile[]
  onChange?: (fileList: UploadFile[]) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionFileUploadPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionFileUploadDefaultProps: QuestionFileUploadPropsType = {
  title: '文件上传题',
  maxCount: 1,
  maxSize: 10,
  accept: '*',
  disabled: false,
  buttonText: '点击上传',
  value: [],
}