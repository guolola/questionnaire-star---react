// 高级逻辑分支系统

export interface LogicCondition {
  id: string
  questionId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in' | 'is_empty' | 'is_not_empty' | 'matches_regex'
  value: string | number | string[] | { min: number; max: number }
  dataType: 'string' | 'number' | 'boolean' | 'array' | 'date'
}

export interface LogicGroup {
  id: string
  type: 'AND' | 'OR'
  conditions: LogicCondition[]
  groups: LogicGroup[]
}

export interface LogicBranch {
  id: string
  name: string
  description?: string
  rootGroup: LogicGroup
  actions: LogicAction[]
  priority: number
}

export interface LogicAction {
  id: string
  type: 'show' | 'hide' | 'enable' | 'disable' | 'set_value' | 'add_class' | 'remove_class' | 'redirect' | 'calculate' | 'validate'
  targetId: string
  targetType: 'question' | 'page' | 'form' | 'element'
  params?: Record<string, any>
}

export interface LogicExecutionContext {
  responses: Record<string, any>
  currentPage: number
  formData: Record<string, any>
  userAgent: string
  timestamp: number
  customVariables: Record<string, any>
}

// 评估单个条件
export function evaluateCondition(
  condition: LogicCondition, 
  context: LogicExecutionContext
): boolean {
  const { questionId, operator, value, dataType } = condition
  const response = context.responses[questionId]

  // 处理空值
  if (operator === 'is_empty') {
    return !response || response === '' || (Array.isArray(response) && response.length === 0)
  }
  if (operator === 'is_not_empty') {
    return response && response !== '' && (!Array.isArray(response) || response.length > 0)
  }

  // 如果响应为空且不是检查空值的操作符，返回false
  if (!response && response !== 0 && response !== false) {
    return false
  }

  // 根据数据类型处理值
  let processedResponse = response
  let processedValue = value

  switch (dataType) {
    case 'number':
      processedResponse = Number(response)
      processedValue = typeof value === 'number' ? value : Number(value)
      break
    case 'date':
      processedResponse = new Date(response)
      processedValue = typeof value === 'string' ? new Date(value) : value
      break
    case 'boolean':
      processedResponse = Boolean(response)
      processedValue = Boolean(value)
      break
    case 'array':
      processedResponse = Array.isArray(response) ? response : [response]
      break
    default:
      processedResponse = String(response)
      processedValue = String(value)
  }

  // 执行比较
  switch (operator) {
    case 'equals':
      return processedResponse === processedValue
    case 'not_equals':
      return processedResponse !== processedValue
    case 'contains':
      if (Array.isArray(processedResponse)) {
        return processedResponse.includes(processedValue)
      }
      return String(processedResponse).includes(String(processedValue))
    case 'not_contains':
      if (Array.isArray(processedResponse)) {
        return !processedResponse.includes(processedValue)
      }
      return !String(processedResponse).includes(String(processedValue))
    case 'greater_than':
      return processedResponse > processedValue
    case 'less_than':
      return processedResponse < processedValue
    case 'between':
      if (typeof processedValue === 'object' && 'min' in processedValue && 'max' in processedValue) {
        return processedResponse >= processedValue.min && processedResponse <= processedValue.max
      }
      return false
    case 'in':
      if (Array.isArray(processedValue)) {
        return processedValue.includes(processedResponse)
      }
      return false
    case 'not_in':
      if (Array.isArray(processedValue)) {
        return !processedValue.includes(processedResponse)
      }
      return true
    case 'matches_regex':
      try {
        const regex = new RegExp(String(processedValue))
        return regex.test(String(processedResponse))
      } catch {
        return false
      }
    default:
      return false
  }
}

// 评估逻辑组
export function evaluateLogicGroup(
  group: LogicGroup, 
  context: LogicExecutionContext
): boolean {
  const conditionResults = group.conditions.map(condition => 
    evaluateCondition(condition, context)
  )
  
  const groupResults = group.groups.map(subGroup => 
    evaluateLogicGroup(subGroup, context)
  )
  
  const allResults = [...conditionResults, ...groupResults]
  
  if (allResults.length === 0) return true
  
  switch (group.type) {
    case 'AND':
      return allResults.every(result => result)
    case 'OR':
      return allResults.some(result => result)
    default:
      return false
  }
}

// 评估逻辑分支
export function evaluateLogicBranch(
  branch: LogicBranch, 
  context: LogicExecutionContext
): boolean {
  return evaluateLogicGroup(branch.rootGroup, context)
}

// 执行逻辑动作
export function executeLogicAction(
  action: LogicAction, 
  context: LogicExecutionContext
): {
  success: boolean
  result?: any
  error?: string
} {
  try {
    switch (action.type) {
      case 'show':
      case 'hide':
      case 'enable':
      case 'disable':
        return {
          success: true,
          result: {
            type: action.type,
            targetId: action.targetId,
            targetType: action.targetType
          }
        }
      
      case 'set_value':
        return {
          success: true,
          result: {
            type: 'set_value',
            targetId: action.targetId,
            value: action.params?.value
          }
        }
      
      case 'add_class':
      case 'remove_class':
        return {
          success: true,
          result: {
            type: action.type,
            targetId: action.targetId,
            className: action.params?.className
          }
        }
      
      case 'redirect':
        return {
          success: true,
          result: {
            type: 'redirect',
            url: action.params?.url
          }
        }
      
      case 'calculate':
        const expression = action.params?.expression
        const calculatedValue = evaluateExpression(expression, context)
        return {
          success: true,
          result: {
            type: 'calculate',
            targetId: action.targetId,
            value: calculatedValue
          }
        }
      
      case 'validate':
        return {
          success: true,
          result: {
            type: 'validate',
            targetId: action.targetId,
            validation: action.params?.validation
          }
        }
      
      default:
        return {
          success: false,
          error: `Unknown action type: ${action.type}`
        }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// 简单的表达式计算器
function evaluateExpression(expression: string, context: LogicExecutionContext): number {
  try {
    // 替换表达式中的变量
    let processedExpression = expression
    
    // 替换问题引用 {{questionId}}
    processedExpression = processedExpression.replace(/\{\{(\w+)\}\}/g, (match, questionId) => {
      const value = context.responses[questionId]
      return String(Number(value) || 0)
    })
    
    // 替换自定义变量 {$variableName}
    processedExpression = processedExpression.replace(/\{\$(\w+)\}/g, (match, variableName) => {
      const value = context.customVariables[variableName]
      return String(Number(value) || 0)
    })
    
    // 使用Function构造函数安全地计算表达式
    const func = new Function('return ' + processedExpression)
    const result = func()
    
    return typeof result === 'number' ? result : 0
  } catch {
    return 0
  }
}

// 执行所有匹配的逻辑分支
export function executeLogicBranches(
  branches: LogicBranch[], 
  context: LogicExecutionContext
): Array<{
  branchId: string
  executed: boolean
  actions: Array<{
    actionId: string
    success: boolean
    result?: any
    error?: string
  }>
}> {
  // 按优先级排序分支
  const sortedBranches = [...branches].sort((a, b) => b.priority - a.priority)
  
  return sortedBranches.map(branch => {
    const shouldExecute = evaluateLogicBranch(branch, context)
    
    if (shouldExecute) {
      const actionResults = branch.actions.map(action => ({
        actionId: action.id,
        ...executeLogicAction(action, context)
      }))
      
      return {
        branchId: branch.id,
        executed: true,
        actions: actionResults
      }
    }
    
    return {
      branchId: branch.id,
      executed: false,
      actions: []
    }
  })
}

// 创建逻辑条件的辅助函数
export function createLogicCondition(
  questionId: string,
  operator: LogicCondition['operator'],
  value: LogicCondition['value'],
  dataType: LogicCondition['dataType'] = 'string'
): LogicCondition {
  return {
    id: `condition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    questionId,
    operator,
    value,
    dataType
  }
}

// 创建逻辑组的辅助函数
export function createLogicGroup(
  type: LogicGroup['type'],
  conditions: LogicCondition[] = [],
  groups: LogicGroup[] = []
): LogicGroup {
  return {
    id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    conditions,
    groups
  }
}

// 创建逻辑分支的辅助函数
export function createLogicBranch(
  name: string,
  rootGroup: LogicGroup,
  actions: LogicAction[] = [],
  priority: number = 0
): LogicBranch {
  return {
    id: `branch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    rootGroup,
    actions,
    priority
  }
}

// 创建逻辑动作的辅助函数
export function createLogicAction(
  type: LogicAction['type'],
  targetId: string,
  targetType: LogicAction['targetType'],
  params?: Record<string, any>
): LogicAction {
  return {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    targetId,
    targetType,
    params
  }
}

// 验证逻辑分支
export function validateLogicBranch(branch: LogicBranch): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!branch.name) {
    errors.push('分支名称不能为空')
  }
  
  if (!branch.rootGroup) {
    errors.push('根逻辑组不能为空')
  }
  
  if (branch.actions.length === 0) {
    errors.push('至少需要一个动作')
  }
  
  // 递归验证逻辑组
  function validateGroup(group: LogicGroup, path: string = ''): void {
    if (group.conditions.length === 0 && group.groups.length === 0) {
      errors.push(`${path} 逻辑组不能为空`)
    }
    
    group.conditions.forEach((condition, index) => {
      if (!condition.questionId) {
        errors.push(`${path} 条件${index + 1} 问题ID不能为空`)
      }
      if (!condition.operator) {
        errors.push(`${path} 条件${index + 1} 操作符不能为空`)
      }
    })
    
    group.groups.forEach((subGroup, index) => {
      validateGroup(subGroup, `${path} 子组${index + 1}`)
    })
  }
  
  validateGroup(branch.rootGroup, '根组')
  
  return {
    isValid: errors.length === 0,
    errors
  }
}