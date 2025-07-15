import React, { FC } from 'react'
import { Radio, Checkbox, Table } from 'antd'
import { type QuestionMatrixPropsType, type MatrixRowType, type MatrixColumnType } from './interface'

const QuestionMatrix: FC<QuestionMatrixPropsType> = (props: QuestionMatrixPropsType) => {
  const { 
    title, 
    rows = [], 
    columns = [], 
    matrixType = 'radio',
    disabled,
    value = {},
    onChange 
  } = props

  const handleChange = (rowKey: string, columnKey: string, checked?: boolean) => {
    const newValue = { ...value }
    
    if (matrixType === 'radio') {
      newValue[rowKey] = columnKey
    } else {
      if (!newValue[rowKey]) {
        newValue[rowKey] = []
      }
      if (checked) {
        newValue[rowKey] = [...newValue[rowKey], columnKey]
      } else {
        newValue[rowKey] = newValue[rowKey].filter((item: string) => item !== columnKey)
      }
    }
    
    if (onChange) {
      onChange(newValue)
    }
  }

  const renderCell = (row: MatrixRowType, column: MatrixColumnType) => {
    const rowValue = value[row.key] || (matrixType === 'radio' ? '' : [])
    
    if (matrixType === 'radio') {
      return (
        <Radio
          checked={rowValue === column.key}
          disabled={disabled}
          onChange={() => handleChange(row.key, column.key)}
        />
      )
    } else {
      return (
        <Checkbox
          checked={rowValue.includes(column.key)}
          disabled={disabled}
          onChange={(e) => handleChange(row.key, column.key, e.target.checked)}
        />
      )
    }
  }

  const tableColumns = [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      width: 200,
      render: (text: string) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    ...columns.map((column) => ({
      title: column.label,
      dataIndex: column.key,
      key: column.key,
      align: 'center' as const,
      render: (_: any, record: MatrixRowType) => renderCell(record, column)
    }))
  ]

  return (
    <div>
      <div className="question-title" style={{ marginBottom: 16 }}>
        <span>{title}</span>
      </div>
      <Table
        dataSource={rows}
        columns={tableColumns}
        pagination={false}
        bordered
        size="small"
        rowKey="key"
        style={{ marginBottom: 16 }}
      />
    </div>
  )
}

export default QuestionMatrix