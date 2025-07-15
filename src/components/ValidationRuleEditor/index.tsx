import React, { FC, useState } from 'react'
import { Modal, Form, Select, Input, InputNumber, Switch, Button, Card, Typography, Divider, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { type ValidationRule, createValidationRule, COMMON_REGEX_PATTERNS } from '../../utils/advancedValidation'

const { Title, Text } = Typography
const { TextArea } = Input

interface ValidationRuleEditorProps {
  visible: boolean
  onClose: () => void
  onSave: (rules: ValidationRule[]) => void
  rules: ValidationRule[]
  currentQuestionId?: string
}

const ValidationRuleEditor: FC<ValidationRuleEditorProps> = ({
  visible,
  onClose,
  onSave,
  rules,
  currentQuestionId
}) => {
  const [form] = Form.useForm()
  const [localRules, setLocalRules] = useState<ValidationRule[]>(
    rules.filter(rule => rule.questionId === currentQuestionId)
  )
  const [selectedRuleType, setSelectedRuleType] = useState<ValidationRule['type']>('required')

  const ruleTypeOptions = [
    { label: '必填验证', value: 'required' },
    { label: '正则表达式', value: 'regex' },
    { label: '长度验证', value: 'length' },
    { label: '数值范围', value: 'range' },
    { label: '自定义验证', value: 'custom' }
  ]

  const presetRegexOptions = [
    { label: '自定义', value: 'custom' },
    { label: '邮箱地址', value: 'email' },
    { label: '手机号码', value: 'phone' },
    { label: 'URL地址', value: 'url' },
    { label: '身份证号', value: 'idCard' },
    { label: '中文字符', value: 'chinese' },
    { label: '字母数字', value: 'alphanumeric' }
  ]

  const handleAddRule = () => {
    form.validateFields().then(values => {
      if (!currentQuestionId) {
        message.error('请先选择问题')
        return
      }

      const config: ValidationRule['config'] = { message: values.message }

      switch (selectedRuleType) {
        case 'regex':
          if (values.presetRegex && values.presetRegex !== 'custom') {
            const preset = COMMON_REGEX_PATTERNS[values.presetRegex as keyof typeof COMMON_REGEX_PATTERNS]
            config.pattern = preset.pattern
            config.message = config.message || preset.message
          } else {
            config.pattern = values.pattern
          }
          break
        case 'length':
          config.min = values.minLength
          config.max = values.maxLength
          break
        case 'range':
          config.min = values.minValue
          config.max = values.maxValue
          break
        case 'custom':
          config.customFunction = values.customFunction
          break
      }

      const newRule = createValidationRule(currentQuestionId, selectedRuleType, config)
      setLocalRules([...localRules, newRule])
      form.resetFields()
      message.success('验证规则添加成功')
    })
  }

  const handleDeleteRule = (ruleId: string) => {
    setLocalRules(localRules.filter(rule => rule.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    setLocalRules(localRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const handleSave = () => {
    // 合并其他问题的规则和当前问题的规则
    const otherRules = rules.filter(rule => rule.questionId !== currentQuestionId)
    const allRules = [...otherRules, ...localRules]
    onSave(allRules)
    onClose()
  }

  const renderRuleConfig = () => {
    switch (selectedRuleType) {
      case 'required':
        return (
          <Form.Item label="错误提示" name="message">
            <Input placeholder="此项为必填项" />
          </Form.Item>
        )
      
      case 'regex':
        return (
          <>
            <Form.Item label="预设模式" name="presetRegex">
              <Select
                options={presetRegexOptions}
                onChange={(value) => {
                  if (value !== 'custom') {
                    const preset = COMMON_REGEX_PATTERNS[value as keyof typeof COMMON_REGEX_PATTERNS]
                    form.setFieldsValue({ 
                      pattern: preset.pattern,
                      message: preset.message
                    })
                  }
                }}
              />
            </Form.Item>
            <Form.Item 
              label="正则表达式" 
              name="pattern"
              rules={[{ required: true, message: '请输入正则表达式' }]}
            >
              <Input placeholder="^[a-zA-Z0-9]+$" />
            </Form.Item>
            <Form.Item label="错误提示" name="message">
              <Input placeholder="格式不正确" />
            </Form.Item>
          </>
        )
      
      case 'length':
        return (
          <>
            <Form.Item label="最小长度" name="minLength">
              <InputNumber min={0} placeholder="最小长度" />
            </Form.Item>
            <Form.Item label="最大长度" name="maxLength">
              <InputNumber min={0} placeholder="最大长度" />
            </Form.Item>
            <Form.Item label="错误提示" name="message">
              <Input placeholder="长度不符合要求" />
            </Form.Item>
          </>
        )
      
      case 'range':
        return (
          <>
            <Form.Item label="最小值" name="minValue">
              <InputNumber placeholder="最小值" />
            </Form.Item>
            <Form.Item label="最大值" name="maxValue">
              <InputNumber placeholder="最大值" />
            </Form.Item>
            <Form.Item label="错误提示" name="message">
              <Input placeholder="数值超出范围" />
            </Form.Item>
          </>
        )
      
      case 'custom':
        return (
          <>
            <Form.Item 
              label="验证函数" 
              name="customFunction"
              rules={[{ required: true, message: '请输入验证函数' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="return value && value.length > 0; // 返回 true 表示验证通过"
              />
            </Form.Item>
            <Form.Item label="错误提示" name="message">
              <Input placeholder="自定义验证失败" />
            </Form.Item>
          </>
        )
      
      default:
        return null
    }
  }

  const getRuleDescription = (rule: ValidationRule) => {
    switch (rule.type) {
      case 'required':
        return '必填验证'
      case 'regex':
        return `正则验证: ${rule.config.pattern}`
      case 'length':
        return `长度验证: ${rule.config.min || 0}-${rule.config.max || '∞'}`
      case 'range':
        return `范围验证: ${rule.config.min || '-∞'}-${rule.config.max || '∞'}`
      case 'custom':
        return '自定义验证'
      default:
        return rule.type
    }
  }

  return (
    <Modal
      title="验证规则设置"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      width={800}
      okText="保存"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>问题验证规则</Title>
        <Text type="secondary">
          为当前问题设置验证规则，确保用户输入符合要求
        </Text>
      </div>

      <Divider />

      <Form form={form} layout="vertical">
        <Title level={5}>添加验证规则</Title>
        <Form.Item label="规则类型" name="ruleType">
          <Select
            value={selectedRuleType}
            onChange={setSelectedRuleType}
            options={ruleTypeOptions}
          />
        </Form.Item>
        
        {renderRuleConfig()}

        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
            添加规则
          </Button>
        </Form.Item>
      </Form>

      <Title level={5}>当前规则</Title>
      {localRules.length === 0 ? (
        <Text type="secondary">暂无验证规则</Text>
      ) : (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {localRules.map((rule) => (
            <Card key={rule.id} size="small" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Switch
                      size="small"
                      checked={rule.enabled}
                      onChange={() => handleToggleRule(rule.id)}
                    />
                    <Text strong>{getRuleDescription(rule)}</Text>
                  </div>
                  {rule.config.message && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      错误提示: {rule.config.message}
                    </Text>
                  )}
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteRule(rule.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default ValidationRuleEditor