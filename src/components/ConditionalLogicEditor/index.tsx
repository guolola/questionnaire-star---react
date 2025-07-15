import React, { FC, useState } from 'react'
import { Modal, Form, Select, Input, Button, Space, Card, Typography, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type ConditionalRule, createConditionalRule } from '../../utils/conditionalLogic'

const { Title, Text } = Typography

interface ConditionalLogicEditorProps {
  visible: boolean
  onClose: () => void
  onSave: (rules: ConditionalRule[]) => void
  rules: ConditionalRule[]
  questions: Array<{ id: string; title: string; type: string }>
  currentQuestionId?: string
}

const ConditionalLogicEditor: FC<ConditionalLogicEditorProps> = ({
  visible,
  onClose,
  onSave,
  rules,
  questions,
  currentQuestionId
}) => {
  const [form] = Form.useForm()
  const [localRules, setLocalRules] = useState<ConditionalRule[]>(rules)

  const operatorOptions = [
    { label: '等于', value: 'equals' },
    { label: '不等于', value: 'not_equals' },
    { label: '包含', value: 'contains' },
    { label: '不包含', value: 'not_contains' },
    { label: '大于', value: 'greater_than' },
    { label: '小于', value: 'less_than' },
    { label: '为空', value: 'is_empty' },
    { label: '不为空', value: 'is_not_empty' }
  ]

  const actionOptions = [
    { label: '显示', value: 'show' },
    { label: '隐藏', value: 'hide' },
    { label: '设为必填', value: 'required' },
    { label: '设为非必填', value: 'not_required' }
  ]

  const handleAddRule = () => {
    const values = form.getFieldsValue()
    if (values.sourceQuestionId && values.operator && values.action) {
      const newRule = createConditionalRule(
        currentQuestionId || '',
        values.sourceQuestionId,
        values.operator,
        values.value || '',
        values.action
      )
      setLocalRules([...localRules, newRule])
      form.resetFields()
    }
  }

  const handleDeleteRule = (ruleId: string) => {
    setLocalRules(localRules.filter(rule => rule.id !== ruleId))
  }

  const handleSave = () => {
    onSave(localRules)
    onClose()
  }

  const getSourceQuestionOptions = () => {
    return questions
      .filter(q => q.id !== currentQuestionId)
      .map(q => ({
        label: q.title,
        value: q.id
      }))
  }

  return (
    <Modal
      title="条件逻辑设置"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      width={800}
      okText="保存"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>当前问题的条件规则</Title>
        <Text type="secondary">
          设置在什么条件下显示、隐藏或修改当前问题的必填状态
        </Text>
      </div>

      <Divider />

      <Form form={form} layout="vertical">
        <Title level={5}>添加新规则</Title>
        <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 16 }}>
          <Form.Item label="当" name="sourceQuestionId" style={{ flex: 1 }}>
            <Select
              placeholder="选择源问题"
              options={getSourceQuestionOptions()}
            />
          </Form.Item>
          <Form.Item label="条件" name="operator" style={{ flex: 1 }}>
            <Select
              placeholder="选择条件"
              options={operatorOptions}
            />
          </Form.Item>
          <Form.Item label="值" name="value" style={{ flex: 1 }}>
            <Input placeholder="输入值" />
          </Form.Item>
          <Form.Item label="则" name="action" style={{ flex: 1 }}>
            <Select
              placeholder="选择动作"
              options={actionOptions}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
              添加
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Title level={5}>已有规则</Title>
      {localRules.length === 0 ? (
        <Text type="secondary">暂无规则</Text>
      ) : (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {localRules.map((rule, index) => {
            const sourceQuestion = questions.find(q => q.id === rule.condition.sourceQuestionId)
            const operatorLabel = operatorOptions.find(op => op.value === rule.condition.operator)?.label
            const actionLabel = actionOptions.find(action => action.value === rule.action)?.label

            return (
              <Card key={rule.id} size="small" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text>
                      当 <Text strong>{sourceQuestion?.title}</Text> {operatorLabel}{' '}
                      {!['is_empty', 'is_not_empty'].includes(rule.condition.operator) && (
                        <Text code>{rule.condition.value}</Text>
                      )}{' '}
                      则 <Text strong>{actionLabel}</Text>
                    </Text>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRule(rule.id)}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export default ConditionalLogicEditor