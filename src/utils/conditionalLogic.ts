// 条件逻辑系统

export interface ConditionalRule {
  id: string
  questionId: string // 目标问题ID
  condition: {
    sourceQuestionId: string // 源问题ID
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty'
    value: string | number | string[]
  }
  action: 'show' | 'hide' | 'required' | 'not_required'
}

export interface ConditionalLogicState {
  rules: ConditionalRule[]
  responses: Record<string, any> // 用户答案
}

// 评估单个条件
export function evaluateCondition(
  condition: ConditionalRule['condition'],
  responses: Record<string, any>
): boolean {
  const { sourceQuestionId, operator, value } = condition
  const response = responses[sourceQuestionId]

  switch (operator) {
    case 'equals':
      return response === value
    case 'not_equals':
      return response !== value
    case 'contains':
      if (Array.isArray(response)) {
        return response.includes(value)
      }
      return String(response || '').includes(String(value))
    case 'not_contains':
      if (Array.isArray(response)) {
        return !response.includes(value)
      }
      return !String(response || '').includes(String(value))
    case 'greater_than':
      return Number(response) > Number(value)
    case 'less_than':
      return Number(response) < Number(value)
    case 'is_empty':
      return !response || response === '' || (Array.isArray(response) && response.length === 0)
    case 'is_not_empty':
      return response && response !== '' && (!Array.isArray(response) || response.length > 0)
    default:
      return false
  }
}

// 评估所有规则，返回每个问题的状态
export function evaluateConditionalLogic(
  rules: ConditionalRule[],
  responses: Record<string, any>
): Record<string, { visible: boolean; required: boolean }> {
  const questionStates: Record<string, { visible: boolean; required: boolean }> = {}

  // 初始化所有问题状态
  rules.forEach(rule => {
    if (!questionStates[rule.questionId]) {
      questionStates[rule.questionId] = { visible: true, required: false }
    }
  })

  // 应用规则
  rules.forEach(rule => {
    const conditionMet = evaluateCondition(rule.condition, responses)
    const state = questionStates[rule.questionId]

    switch (rule.action) {
      case 'show':
        if (conditionMet) state.visible = true
        break
      case 'hide':
        if (conditionMet) state.visible = false
        break
      case 'required':
        if (conditionMet) state.required = true
        break
      case 'not_required':
        if (conditionMet) state.required = false
        break
    }
  })

  return questionStates
}

// 获取问题的可见性
export function isQuestionVisible(
  questionId: string,
  rules: ConditionalRule[],
  responses: Record<string, any>
): boolean {
  const questionStates = evaluateConditionalLogic(rules, responses)
  return questionStates[questionId]?.visible !== false
}

// 获取问题的必填状态
export function isQuestionRequired(
  questionId: string,
  rules: ConditionalRule[],
  responses: Record<string, any>
): boolean {
  const questionStates = evaluateConditionalLogic(rules, responses)
  return questionStates[questionId]?.required === true
}

// 创建条件规则的辅助函数
export function createConditionalRule(
  questionId: string,
  sourceQuestionId: string,
  operator: ConditionalRule['condition']['operator'],
  value: string | number | string[],
  action: ConditionalRule['action']
): ConditionalRule {
  return {
    id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    questionId,
    condition: {
      sourceQuestionId,
      operator,
      value
    },
    action
  }
}