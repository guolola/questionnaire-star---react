// 答案引用系统 (Response Piping)

export interface PipingVariable {
  id: string
  name: string
  questionId: string
  format?: 'text' | 'number' | 'date' | 'list' | 'first' | 'last'
  defaultValue?: string
}

export interface PipingRule {
  id: string
  targetQuestionId: string
  sourceQuestionId: string
  pipingType: 'title' | 'content' | 'options' | 'placeholder'
  template: string // 包含占位符的模板字符串
  variables: PipingVariable[]
}

// 解析模板中的变量
export function parseTemplate(template: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const matches = []
  let match

  while ((match = variableRegex.exec(template)) !== null) {
    matches.push(match[1].trim())
  }

  return matches
}

// 格式化答案值
export function formatAnswerValue(
  value: any,
  format: PipingVariable['format'] = 'text'
): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  switch (format) {
    case 'text':
      return String(value)
    
    case 'number':
      const num = Number(value)
      return isNaN(num) ? '0' : num.toString()
    
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }
      return String(value)
    
    case 'list':
      if (Array.isArray(value)) {
        return value.join(', ')
      }
      return String(value)
    
    case 'first':
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0])
      }
      return String(value)
    
    case 'last':
      if (Array.isArray(value) && value.length > 0) {
        return String(value[value.length - 1])
      }
      return String(value)
    
    default:
      return String(value)
  }
}

// 处理答案引用
export function processPiping(
  template: string,
  variables: PipingVariable[],
  responses: Record<string, any>
): string {
  let result = template

  variables.forEach(variable => {
    const placeholder = `{{${variable.name}}}`
    const response = responses[variable.questionId]
    const formattedValue = response !== undefined 
      ? formatAnswerValue(response, variable.format)
      : (variable.defaultValue || '')
    
    result = result.replace(new RegExp(placeholder, 'g'), formattedValue)
  })

  return result
}

// 应用引用规则到问题
export function applyPipingRules(
  rules: PipingRule[],
  responses: Record<string, any>,
  questions: Array<{ id: string; title: string; [key: string]: any }>
): Array<{ id: string; title: string; [key: string]: any }> {
  return questions.map(question => {
    const applicableRules = rules.filter(rule => rule.targetQuestionId === question.id)
    
    let updatedQuestion = { ...question }
    
    applicableRules.forEach(rule => {
      const processedContent = processPiping(rule.template, rule.variables, responses)
      
      switch (rule.pipingType) {
        case 'title':
          updatedQuestion.title = processedContent
          break
        case 'content':
          updatedQuestion.content = processedContent
          break
        case 'placeholder':
          updatedQuestion.placeholder = processedContent
          break
        case 'options':
          // 处理选项引用，可能需要更复杂的逻辑
          if (updatedQuestion.options && Array.isArray(updatedQuestion.options)) {
            updatedQuestion.options = updatedQuestion.options.map((option: any) => ({
              ...option,
              text: processPiping(option.text, rule.variables, responses)
            }))
          }
          break
      }
    })
    
    return updatedQuestion
  })
}

// 创建引用变量
export function createPipingVariable(
  name: string,
  questionId: string,
  format: PipingVariable['format'] = 'text',
  defaultValue?: string
): PipingVariable {
  return {
    id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    questionId,
    format,
    defaultValue
  }
}

// 创建引用规则
export function createPipingRule(
  targetQuestionId: string,
  sourceQuestionId: string,
  pipingType: PipingRule['pipingType'],
  template: string,
  variables: PipingVariable[]
): PipingRule {
  return {
    id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    targetQuestionId,
    sourceQuestionId,
    pipingType,
    template,
    variables
  }
}

// 验证引用规则
export function validatePipingRule(rule: PipingRule): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!rule.targetQuestionId) {
    errors.push('目标问题ID不能为空')
  }
  
  if (!rule.template) {
    errors.push('模板不能为空')
  }
  
  const templateVariables = parseTemplate(rule.template)
  const ruleVariables = rule.variables.map(v => v.name)
  
  templateVariables.forEach(varName => {
    if (!ruleVariables.includes(varName)) {
      errors.push(`模板中的变量 "${varName}" 未定义`)
    }
  })
  
  rule.variables.forEach(variable => {
    if (!variable.name) {
      errors.push('变量名不能为空')
    }
    if (!variable.questionId) {
      errors.push(`变量 "${variable.name}" 的问题ID不能为空`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 获取问题依赖关系
export function getQuestionDependencies(rules: PipingRule[]): Record<string, string[]> {
  const dependencies: Record<string, string[]> = {}
  
  rules.forEach(rule => {
    if (!dependencies[rule.targetQuestionId]) {
      dependencies[rule.targetQuestionId] = []
    }
    
    rule.variables.forEach(variable => {
      if (!dependencies[rule.targetQuestionId].includes(variable.questionId)) {
        dependencies[rule.targetQuestionId].push(variable.questionId)
      }
    })
  })
  
  return dependencies
}

// 检测循环依赖
export function detectCircularDependencies(rules: PipingRule[]): string[] {
  const dependencies = getQuestionDependencies(rules)
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycles: string[] = []
  
  function dfs(questionId: string, path: string[] = []): void {
    if (recursionStack.has(questionId)) {
      cycles.push(`循环依赖: ${path.join(' -> ')} -> ${questionId}`)
      return
    }
    
    if (visited.has(questionId)) {
      return
    }
    
    visited.add(questionId)
    recursionStack.add(questionId)
    
    const deps = dependencies[questionId] || []
    deps.forEach(depId => {
      dfs(depId, [...path, questionId])
    })
    
    recursionStack.delete(questionId)
  }
  
  Object.keys(dependencies).forEach(questionId => {
    dfs(questionId)
  })
  
  return cycles
}

// 预览引用效果
export function previewPiping(
  rule: PipingRule,
  responses: Record<string, any>
): string {
  return processPiping(rule.template, rule.variables, responses)
}

// 批量应用引用规则
export function batchApplyPiping(
  rules: PipingRule[],
  responses: Record<string, any>
): Record<string, { title?: string; content?: string; placeholder?: string; options?: any[] }> {
  const results: Record<string, any> = {}
  
  rules.forEach(rule => {
    if (!results[rule.targetQuestionId]) {
      results[rule.targetQuestionId] = {}
    }
    
    const processedContent = processPiping(rule.template, rule.variables, responses)
    results[rule.targetQuestionId][rule.pipingType] = processedContent
  })
  
  return results
}