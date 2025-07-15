import React, { FC } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { type QuestionFileUploadPropsType } from './interface'

const QuestionFileUpload: FC<QuestionFileUploadPropsType> = (props: QuestionFileUploadPropsType) => {
  const { 
    title, 
    maxCount = 1, 
    maxSize = 10,
    accept = '*',
    disabled,
    buttonText = '点击上传',
    value = [],
    onChange 
  } = props

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: maxCount > 1,
    maxCount,
    accept,
    disabled,
    fileList: value,
    beforeUpload: (file) => {
      const isValidSize = file.size / 1024 / 1024 < maxSize
      if (!isValidSize) {
        message.error(`文件大小不能超过 ${maxSize}MB`)
      }
      return isValidSize
    },
    onChange: (info) => {
      if (onChange) {
        onChange(info.fileList)
      }
    },
    onRemove: (file) => {
      if (onChange) {
        const newFileList = value.filter(item => item.uid !== file.uid)
        onChange(newFileList)
      }
    }
  }

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 8 }}>
        <span>{title}</span>
      </div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} disabled={disabled}>
          {buttonText}
        </Button>
      </Upload>
      <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
        {maxCount > 1 ? `最多上传 ${maxCount} 个文件` : '最多上传 1 个文件'}
        {maxSize && ` · 单个文件大小不超过 ${maxSize}MB`}
      </div>
    </div>
  )
}

export default QuestionFileUpload