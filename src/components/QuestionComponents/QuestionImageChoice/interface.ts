export type ImageOptionType = {
  value: string
  text: string
  imageUrl: string
}

export type QuestionImageChoicePropsType = {
  title?: string
  options?: ImageOptionType[]
  selectionType?: 'single' | 'multiple'
  showLabels?: boolean
  imageSize?: 'small' | 'medium' | 'large'
  columns?: number
  disabled?: boolean
  value?: string | string[]
  onChange?: (value: string | string[]) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionImageChoicePropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionImageChoiceDefaultProps: QuestionImageChoicePropsType = {
  title: '图片选择题',
  options: [
    {
      value: 'option1',
      text: '选项1',
      imageUrl: 'https://via.placeholder.com/120x120/1890ff/white?text=1'
    },
    {
      value: 'option2',
      text: '选项2',
      imageUrl: 'https://via.placeholder.com/120x120/52c41a/white?text=2'
    },
    {
      value: 'option3',
      text: '选项3',
      imageUrl: 'https://via.placeholder.com/120x120/faad14/white?text=3'
    }
  ],
  selectionType: 'single',
  showLabels: true,
  imageSize: 'medium',
  columns: 2,
  disabled: false,
}