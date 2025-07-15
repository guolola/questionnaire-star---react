import Component from './Component'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'
import { QuestionFileUploadDefaultProps } from './interface'

export * from './interface'

export default {
  title: '文件上传',
  type: 'questionFileUpload',
  Component,
  PropComponent,
  StatComponent,
  defaultProps: QuestionFileUploadDefaultProps,
}