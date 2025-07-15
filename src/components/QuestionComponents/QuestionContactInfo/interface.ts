export type ContactField = {
  key: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  span?: number // 栅格布局占用列数
  options?: Array<{ label: string; value: string }> // 用于select类型
}

export type QuestionContactInfoPropsType = {
  title?: string
  fields?: ContactField[]
  layout?: 'horizontal' | 'vertical'
  required?: boolean
  disabled?: boolean
  value?: Record<string, string>
  onChange?: (value: Record<string, string>) => void

  // 用于 PropComponent
  fe_id?: string
  props?: QuestionContactInfoPropsType

  // 用于 StatComponent
  stat?: Array<{ name: string; count: number }>
}

export const QuestionContactInfoDefaultProps: QuestionContactInfoPropsType = {
  title: '联系信息',
  fields: [
    {
      key: 'name',
      label: '姓名',
      type: 'text',
      placeholder: '请输入姓名',
      required: true,
      span: 12
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: '请输入邮箱地址',
      required: true,
      span: 12
    },
    {
      key: 'phone',
      label: '手机号',
      type: 'phone',
      placeholder: '请输入手机号',
      required: false,
      span: 12
    },
    {
      key: 'company',
      label: '公司/组织',
      type: 'text',
      placeholder: '请输入公司或组织名称',
      required: false,
      span: 12
    },
    {
      key: 'address',
      label: '地址',
      type: 'textarea',
      placeholder: '请输入详细地址',
      required: false,
      span: 24
    }
  ],
  layout: 'horizontal',
  required: false,
  disabled: false,
  value: {},
}