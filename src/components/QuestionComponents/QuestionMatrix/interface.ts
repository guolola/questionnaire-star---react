export type MatrixRowType = {
  key: string
  label: string
}

export type MatrixColumnType = {
  key: string
  label: string
}

export type QuestionMatrixPropsType = {
  title?: string
  rows?: MatrixRowType[]
  columns?: MatrixColumnType[]
  matrixType?: 'radio' | 'checkbox'
  disabled?: boolean
  value?: Record<string, string | string[]>
  onChange?: (value: Record<string, string | string[]>) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionMatrixPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionMatrixDefaultProps: QuestionMatrixPropsType = {
  title: '矩阵题',
  rows: [
    { key: 'row1', label: '问题1' },
    { key: 'row2', label: '问题2' },
    { key: 'row3', label: '问题3' }
  ],
  columns: [
    { key: 'col1', label: '非常不满意' },
    { key: 'col2', label: '不满意' },
    { key: 'col3', label: '一般' },
    { key: 'col4', label: '满意' },
    { key: 'col5', label: '非常满意' }
  ],
  matrixType: 'radio',
  disabled: false,
}