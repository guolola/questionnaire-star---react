// 高级验证系统

export interface ValidationRule {
  id: string
  questionId: string
  type: 'required' | 'regex' | 'length' | 'range' | 'custom'
  config: {
    pattern?: string // 正则表达式
    message?: string // 错误信息
    min?: number // 最小值/长度
    max?: number // 最大值/长度
    customFunction?: string // 自定义验证函数代码
  }
  enabled: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// 预定义的常用正则表达式
export const COMMON_REGEX_PATTERNS = {
  email: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    message: '请输入有效的邮箱地址'
  },
  phone: {
    pattern: '^1[3-9]\\d{9}$',
    message: '请输入有效的手机号码'
  },
  url: {
    pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
    message: '请输入有效的URL地址'
  },
  idCard: {
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
    message: '请输入有效的身份证号码'
  },
  chinese: {
    pattern: '^[\\u4e00-\\u9fa5]+$',
    message: '只能输入中文字符'
  },
  alphanumeric: {
    pattern: '^[a-zA-Z0-9]+$',
    message: '只能输入字母和数字'
  }
}

// 验证单个规则
export function validateRule(rule: ValidationRule, value: any): ValidationResult {
  const { type, config } = rule
  const errors: string[] = []

  if (!rule.enabled) {
    return { isValid: true, errors: [] }
  }

  switch (type) {
    case 'required':
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        errors.push(config.message || '此项为必填项')
      }
      break

    case 'regex':
      if (config.pattern && value) {
        const regex = new RegExp(config.pattern)
        if (!regex.test(String(value))) {
          errors.push(config.message || '格式不正确')
        }
      }
      break

    case 'length':
      if (value) {
        const length = String(value).length
        if (config.min !== undefined && length < config.min) {
          errors.push(config.message || `长度不能少于${config.min}个字符`)
        }
        if (config.max !== undefined && length > config.max) {
          errors.push(config.message || `长度不能超过${config.max}个字符`)
        }
      }
      break

    case 'range':
      if (value !== undefined && value !== null && value !== '') {
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          if (config.min !== undefined && numValue < config.min) {
            errors.push(config.message || `值不能小于${config.min}`)
          }
          if (config.max !== undefined && numValue > config.max) {
            errors.push(config.message || `值不能大于${config.max}`)
          }
        }
      }
      break

    case 'custom':
      if (config.customFunction && value) {
        try {
          // 创建安全的执行环境
          const func = new Function('value', config.customFunction)
          const result = func(value)
          if (!result) {
            errors.push(config.message || '自定义验证失败')
          }
        } catch (error) {
          errors.push('自定义验证函数执行错误')
        }
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// 验证问题的所有规则
export function validateQuestion(
  questionId: string,
  value: any,
  rules: ValidationRule[]
): ValidationResult {
  const questionRules = rules.filter(rule => rule.questionId === questionId)
  const allErrors: string[] = []

  for (const rule of questionRules) {
    const result = validateRule(rule, value)
    if (!result.isValid) {
      allErrors.push(...result.errors)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  }
}

// 验证整个表单
export function validateForm(
  responses: Record<string, any>,
  rules: ValidationRule[]
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}
  
  // 获取所有涉及的问题ID
  const questionIds = Array.from(new Set(rules.map(rule => rule.questionId)))
  
  for (const questionId of questionIds) {
    const value = responses[questionId]
    results[questionId] = validateQuestion(questionId, value, rules)
  }

  return results
}

// 创建验证规则的辅助函数
export function createValidationRule(
  questionId: string,
  type: ValidationRule['type'],
  config: ValidationRule['config']
): ValidationRule {
  return {
    id: `validation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    questionId,
    type,
    config,
    enabled: true
  }
}

// 预设验证规则创建函数
export const createPresetValidationRules = {
  required: (questionId: string, message?: string) => 
    createValidationRule(questionId, 'required', { message }),
  
  email: (questionId: string, message?: string) => 
    createValidationRule(questionId, 'regex', {
      pattern: COMMON_REGEX_PATTERNS.email.pattern,
      message: message || COMMON_REGEX_PATTERNS.email.message
    }),
  
  phone: (questionId: string, message?: string) => 
    createValidationRule(questionId, 'regex', {
      pattern: COMMON_REGEX_PATTERNS.phone.pattern,
      message: message || COMMON_REGEX_PATTERNS.phone.message
    }),
  
  minLength: (questionId: string, min: number, message?: string) => 
    createValidationRule(questionId, 'length', {
      min,
      message: message || `长度不能少于${min}个字符`
    }),
  
  maxLength: (questionId: string, max: number, message?: string) => 
    createValidationRule(questionId, 'length', {
      max,
      message: message || `长度不能超过${max}个字符`
    }),
  
  range: (questionId: string, min?: number, max?: number, message?: string) => 
    createValidationRule(questionId, 'range', {
      min,
      max,
      message: message || `值必须在${min || ''}到${max || ''}之间`
    })
}