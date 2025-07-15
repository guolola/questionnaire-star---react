// 第三方API集成系统

export interface APIIntegration {
  id: string
  name: string
  type: 'webhook' | 'crm' | 'email' | 'analytics' | 'storage' | 'payment' | 'custom'
  provider: string
  config: APIConfig
  enabled: boolean
  triggers: APITrigger[]
  lastExecuted?: Date
  status: 'active' | 'inactive' | 'error' | 'pending'
  errorMessage?: string
}

export interface APIConfig {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers: Record<string, string>
  authentication: {
    type: 'none' | 'bearer' | 'basic' | 'apikey' | 'oauth2'
    credentials: Record<string, string>
  }
  timeout: number
  retryCount: number
  retryDelay: number
}

export interface APITrigger {
  id: string
  event: 'response_submitted' | 'response_updated' | 'form_completed' | 'form_abandoned' | 'custom_event'
  conditions: TriggerCondition[]
  dataMapping: DataMapping
  enabled: boolean
}

export interface TriggerCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: any
}

export interface DataMapping {
  responseData: ResponseDataMapping
  customFields: Record<string, string>
  transformations: DataTransformation[]
}

export interface ResponseDataMapping {
  includeAll: boolean
  includeFields: string[]
  excludeFields: string[]
  flattenStructure: boolean
  customMapping: Record<string, string>
}

export interface DataTransformation {
  id: string
  type: 'format' | 'calculate' | 'lookup' | 'validate' | 'custom'
  sourceField: string
  targetField: string
  parameters: Record<string, any>
}

export interface APIResponse {
  success: boolean
  statusCode: number
  data?: any
  error?: string
  headers?: Record<string, string>
  executionTime: number
  timestamp: Date
}

export interface WebhookEndpoint {
  id: string
  url: string
  secret: string
  events: string[]
  headers: Record<string, string>
  enabled: boolean
  lastTriggered?: Date
  successCount: number
  errorCount: number
}

// 预定义API集成模板
export const API_TEMPLATES: Record<string, Partial<APIIntegration>> = {
  salesforce: {
    name: 'Salesforce CRM',
    type: 'crm',
    provider: 'Salesforce',
    config: {
      endpoint: 'https://your-instance.salesforce.com/services/data/v54.0/sobjects/Lead',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      authentication: {
        type: 'oauth2',
        credentials: {
          clientId: '',
          clientSecret: '',
          refreshToken: ''
        }
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  },
  hubspot: {
    name: 'HubSpot CRM',
    type: 'crm',
    provider: 'HubSpot',
    config: {
      endpoint: 'https://api.hubapi.com/crm/v3/objects/contacts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      authentication: {
        type: 'bearer',
        credentials: {
          token: ''
        }
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  },
  mailchimp: {
    name: 'Mailchimp',
    type: 'email',
    provider: 'Mailchimp',
    config: {
      endpoint: 'https://us1.api.mailchimp.com/3.0/lists/{list_id}/members',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      authentication: {
        type: 'basic',
        credentials: {
          username: 'anystring',
          password: ''
        }
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  },
  zapier: {
    name: 'Zapier Webhook',
    type: 'webhook',
    provider: 'Zapier',
    config: {
      endpoint: 'https://hooks.zapier.com/hooks/catch/your-webhook-url',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      authentication: {
        type: 'none',
        credentials: {}
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  },
  googleSheets: {
    name: 'Google Sheets',
    type: 'storage',
    provider: 'Google',
    config: {
      endpoint: 'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{range}:append',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      authentication: {
        type: 'oauth2',
        credentials: {
          clientId: '',
          clientSecret: '',
          refreshToken: ''
        }
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  },
  slack: {
    name: 'Slack',
    type: 'webhook',
    provider: 'Slack',
    config: {
      endpoint: 'https://hooks.slack.com/services/your-webhook-url',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      authentication: {
        type: 'none',
        credentials: {}
      },
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000
    }
  }
}

// API集成管理器
export class APIIntegrationManager {
  private integrations: Map<string, APIIntegration> = new Map()
  private webhooks: Map<string, WebhookEndpoint> = new Map()
  private executionHistory: Array<{
    integrationId: string
    trigger: string
    timestamp: Date
    success: boolean
    error?: string
  }> = []

  // 添加API集成
  addIntegration(integration: APIIntegration): void {
    this.integrations.set(integration.id, integration)
  }

  // 获取API集成
  getIntegration(id: string): APIIntegration | undefined {
    return this.integrations.get(id)
  }

  // 获取所有集成
  getAllIntegrations(): APIIntegration[] {
    return Array.from(this.integrations.values())
  }

  // 启用/禁用集成
  toggleIntegration(id: string, enabled: boolean): void {
    const integration = this.integrations.get(id)
    if (integration) {
      integration.enabled = enabled
      integration.status = enabled ? 'active' : 'inactive'
    }
  }

  // 测试API连接
  async testConnection(integration: APIIntegration): Promise<APIResponse> {
    const startTime = Date.now()
    
    try {
      const response = await this.makeAPICall(integration.config, {
        test: true,
        timestamp: new Date().toISOString()
      })
      
      return {
        success: true,
        statusCode: response.status,
        data: response.data,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      }
    }
  }

  // 执行API调用
  private async makeAPICall(config: APIConfig, data: any): Promise<any> {
    const { endpoint, method, headers, authentication, timeout } = config
    
    // 构建请求头
    const requestHeaders = { ...headers }
    
    // 添加认证
    switch (authentication.type) {
      case 'bearer':
        requestHeaders['Authorization'] = `Bearer ${authentication.credentials.token}`
        break
      case 'basic':
        const credentials = btoa(`${authentication.credentials.username}:${authentication.credentials.password}`)
        requestHeaders['Authorization'] = `Basic ${credentials}`
        break
      case 'apikey':
        requestHeaders['X-API-Key'] = authentication.credentials.apiKey
        break
      case 'oauth2':
        requestHeaders['Authorization'] = `Bearer ${authentication.credentials.accessToken}`
        break
    }

    // 创建请求选项
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    }

    // 添加请求体
    if (method !== 'GET' && method !== 'DELETE') {
      requestOptions.body = JSON.stringify(data)
    }

    // 发送请求
    const response = await fetch(endpoint, requestOptions)
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    return {
      status: response.status,
      data: await response.json(),
      headers: Object.fromEntries(response.headers.entries())
    }
  }

  // 触发API集成
  async triggerIntegration(
    integrationId: string,
    event: string,
    responseData: any,
    context: Record<string, any> = {}
  ): Promise<APIResponse[]> {
    const integration = this.integrations.get(integrationId)
    if (!integration || !integration.enabled) {
      return []
    }

    const results: APIResponse[] = []
    
    // 查找匹配的触发器
    const matchingTriggers = integration.triggers.filter(trigger => 
      trigger.event === event && 
      trigger.enabled && 
      this.evaluateTriggerConditions(trigger.conditions, responseData, context)
    )

    // 执行每个匹配的触发器
    for (const trigger of matchingTriggers) {
      try {
        const mappedData = this.mapResponseData(responseData, trigger.dataMapping)
        const result = await this.executeWithRetry(integration.config, mappedData)
        
        results.push(result)
        
        // 记录执行历史
        this.executionHistory.push({
          integrationId,
          trigger: trigger.id,
          timestamp: new Date(),
          success: result.success,
          error: result.error
        })
        
        // 更新集成状态
        integration.lastExecuted = new Date()
        integration.status = result.success ? 'active' : 'error'
        if (!result.success) {
          integration.errorMessage = result.error
        }
        
      } catch (error) {
        const errorResult: APIResponse = {
          success: false,
          statusCode: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: 0,
          timestamp: new Date()
        }
        
        results.push(errorResult)
        
        // 记录错误
        this.executionHistory.push({
          integrationId,
          trigger: trigger.id,
          timestamp: new Date(),
          success: false,
          error: errorResult.error
        })
        
        integration.status = 'error'
        integration.errorMessage = errorResult.error
      }
    }

    return results
  }

  // 带重试的执行
  private async executeWithRetry(config: APIConfig, data: any): Promise<APIResponse> {
    const { retryCount, retryDelay } = config
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const startTime = Date.now()
        const response = await this.makeAPICall(config, data)
        
        return {
          success: true,
          statusCode: response.status,
          data: response.data,
          headers: response.headers,
          executionTime: Date.now() - startTime,
          timestamp: new Date()
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
        }
      }
    }
    
    return {
      success: false,
      statusCode: 0,
      error: lastError?.message || 'Unknown error',
      executionTime: 0,
      timestamp: new Date()
    }
  }

  // 评估触发条件
  private evaluateTriggerConditions(
    conditions: TriggerCondition[],
    responseData: any,
    context: Record<string, any>
  ): boolean {
    if (conditions.length === 0) return true
    
    return conditions.every(condition => {
      const value = this.getValueByPath(responseData, condition.field) || 
                   this.getValueByPath(context, condition.field)
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'not_equals':
          return value !== condition.value
        case 'contains':
          return String(value).includes(String(condition.value))
        case 'greater_than':
          return Number(value) > Number(condition.value)
        case 'less_than':
          return Number(value) < Number(condition.value)
        case 'exists':
          return value !== undefined && value !== null
        case 'not_exists':
          return value === undefined || value === null
        default:
          return false
      }
    })
  }

  // 获取嵌套路径的值
  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // 映射响应数据
  private mapResponseData(responseData: any, mapping: DataMapping): any {
    let mappedData: any = {}
    
    // 应用响应数据映射
    if (mapping.responseData.includeAll) {
      mappedData = { ...responseData }
    } else {
      // 包含指定字段
      if (mapping.responseData.includeFields.length > 0) {
        mapping.responseData.includeFields.forEach(field => {
          const value = this.getValueByPath(responseData, field)
          if (value !== undefined) {
            this.setValueByPath(mappedData, field, value)
          }
        })
      }
    }
    
    // 排除指定字段
    mapping.responseData.excludeFields.forEach(field => {
      this.deleteValueByPath(mappedData, field)
    })
    
    // 自定义字段映射
    Object.entries(mapping.responseData.customMapping).forEach(([sourceField, targetField]) => {
      const value = this.getValueByPath(responseData, sourceField)
      if (value !== undefined) {
        this.setValueByPath(mappedData, targetField, value)
      }
    })
    
    // 添加自定义字段
    Object.entries(mapping.customFields).forEach(([field, value]) => {
      this.setValueByPath(mappedData, field, value)
    })
    
    // 应用数据转换
    mapping.transformations.forEach(transformation => {
      const value = this.getValueByPath(mappedData, transformation.sourceField)
      if (value !== undefined) {
        const transformedValue = this.applyTransformation(value, transformation)
        this.setValueByPath(mappedData, transformation.targetField, transformedValue)
      }
    })
    
    // 扁平化结构
    if (mapping.responseData.flattenStructure) {
      mappedData = this.flattenObject(mappedData)
    }
    
    return mappedData
  }

  // 设置嵌套路径的值
  private setValueByPath(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    
    let current = obj
    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[lastKey] = value
  }

  // 删除嵌套路径的值
  private deleteValueByPath(obj: any, path: string): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    
    let current = obj
    for (const key of keys) {
      if (!(key in current)) {
        return
      }
      current = current[key]
    }
    
    delete current[lastKey]
  }

  // 应用数据转换
  private applyTransformation(value: any, transformation: DataTransformation): any {
    switch (transformation.type) {
      case 'format':
        return this.formatValue(value, transformation.parameters)
      case 'calculate':
        return this.calculateValue(value, transformation.parameters)
      case 'lookup':
        return this.lookupValue(value, transformation.parameters)
      case 'validate':
        return this.validateValue(value, transformation.parameters)
      case 'custom':
        return this.customTransformation(value, transformation.parameters)
      default:
        return value
    }
  }

  // 格式化值
  private formatValue(value: any, parameters: Record<string, any>): any {
    const { type, format } = parameters
    
    switch (type) {
      case 'date':
        return new Date(value).toISOString().split('T')[0]
      case 'datetime':
        return new Date(value).toISOString()
      case 'number':
        return Number(value).toFixed(parameters.decimals || 0)
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: parameters.currency || 'USD'
        }).format(Number(value))
      case 'percentage':
        return (Number(value) * 100).toFixed(parameters.decimals || 2) + '%'
      case 'uppercase':
        return String(value).toUpperCase()
      case 'lowercase':
        return String(value).toLowerCase()
      case 'capitalize':
        return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
      default:
        return value
    }
  }

  // 计算值
  private calculateValue(value: any, parameters: Record<string, any>): any {
    const { operation, operand } = parameters
    const numValue = Number(value)
    const numOperand = Number(operand)
    
    switch (operation) {
      case 'add':
        return numValue + numOperand
      case 'subtract':
        return numValue - numOperand
      case 'multiply':
        return numValue * numOperand
      case 'divide':
        return numOperand !== 0 ? numValue / numOperand : 0
      case 'modulo':
        return numValue % numOperand
      case 'power':
        return Math.pow(numValue, numOperand)
      case 'round':
        return Math.round(numValue)
      case 'floor':
        return Math.floor(numValue)
      case 'ceil':
        return Math.ceil(numValue)
      default:
        return value
    }
  }

  // 查找值
  private lookupValue(value: any, parameters: Record<string, any>): any {
    const { lookupTable, defaultValue } = parameters
    return lookupTable[value] || defaultValue || value
  }

  // 验证值
  private validateValue(value: any, parameters: Record<string, any>): any {
    const { rules, defaultValue } = parameters
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value) return defaultValue
          break
        case 'minLength':
          if (String(value).length < rule.value) return defaultValue
          break
        case 'maxLength':
          if (String(value).length > rule.value) return defaultValue
          break
        case 'pattern':
          if (!new RegExp(rule.value).test(String(value))) return defaultValue
          break
        case 'range':
          if (Number(value) < rule.min || Number(value) > rule.max) return defaultValue
          break
      }
    }
    
    return value
  }

  // 自定义转换
  private customTransformation(value: any, parameters: Record<string, any>): any {
    const { code } = parameters
    
    try {
      // 创建安全的执行环境
      const func = new Function('value', 'parameters', code)
      return func(value, parameters)
    } catch (error) {
      console.error('Custom transformation error:', error)
      return value
    }
  }

  // 扁平化对象
  private flattenObject(obj: any, prefix: string = ''): any {
    const flattened: any = {}
    
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value, newKey))
      } else {
        flattened[newKey] = value
      }
    })
    
    return flattened
  }

  // 获取执行历史
  getExecutionHistory(integrationId?: string): Array<{
    integrationId: string
    trigger: string
    timestamp: Date
    success: boolean
    error?: string
  }> {
    if (integrationId) {
      return this.executionHistory.filter(entry => entry.integrationId === integrationId)
    }
    return this.executionHistory
  }

  // 清理历史记录
  clearHistory(integrationId?: string): void {
    if (integrationId) {
      this.executionHistory = this.executionHistory.filter(entry => entry.integrationId !== integrationId)
    } else {
      this.executionHistory = []
    }
  }
}

// 创建API集成的辅助函数
export function createAPIIntegration(
  name: string,
  type: APIIntegration['type'],
  provider: string,
  config: APIConfig
): APIIntegration {
  return {
    id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    provider,
    config,
    enabled: true,
    triggers: [],
    status: 'pending'
  }
}

// 创建触发器的辅助函数
export function createAPITrigger(
  event: APITrigger['event'],
  conditions: TriggerCondition[] = [],
  dataMapping: Partial<DataMapping> = {}
): APITrigger {
  return {
    id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    event,
    conditions,
    dataMapping: {
      responseData: {
        includeAll: true,
        includeFields: [],
        excludeFields: [],
        flattenStructure: false,
        customMapping: {}
      },
      customFields: {},
      transformations: [],
      ...dataMapping
    },
    enabled: true
  }
}

// 全局API集成管理器实例
export const apiIntegrationManager = new APIIntegrationManager()

// 常用集成快速创建函数
export function createSalesforceIntegration(credentials: Record<string, string>): APIIntegration {
  const template = API_TEMPLATES.salesforce
  const integration = createAPIIntegration(
    template.name!,
    template.type!,
    template.provider!,
    {
      ...template.config!,
      authentication: {
        ...template.config!.authentication,
        credentials
      }
    }
  )
  
  // 添加默认触发器
  integration.triggers.push(
    createAPITrigger('response_submitted', [], {
      responseData: {
        includeAll: false,
        includeFields: ['name', 'email', 'phone', 'company'],
        excludeFields: [],
        flattenStructure: true,
        customMapping: {
          'name': 'FirstName',
          'email': 'Email',
          'phone': 'Phone',
          'company': 'Company'
        }
      }
    })
  )
  
  return integration
}

export function createHubSpotIntegration(apiKey: string): APIIntegration {
  const template = API_TEMPLATES.hubspot
  const integration = createAPIIntegration(
    template.name!,
    template.type!,
    template.provider!,
    {
      ...template.config!,
      authentication: {
        type: 'bearer',
        credentials: { token: apiKey }
      }
    }
  )
  
  integration.triggers.push(
    createAPITrigger('response_submitted', [], {
      responseData: {
        includeAll: false,
        includeFields: ['email', 'firstname', 'lastname', 'company'],
        excludeFields: [],
        flattenStructure: false,
        customMapping: {}
      }
    })
  )
  
  return integration
}

export function createZapierIntegration(webhookUrl: string): APIIntegration {
  const template = API_TEMPLATES.zapier
  const integration = createAPIIntegration(
    template.name!,
    template.type!,
    template.provider!,
    {
      ...template.config!,
      endpoint: webhookUrl
    }
  )
  
  integration.triggers.push(
    createAPITrigger('response_submitted', [], {
      responseData: {
        includeAll: true,
        includeFields: [],
        excludeFields: [],
        flattenStructure: false,
        customMapping: {}
      }
    })
  )
  
  return integration
}

// 批量操作函数
export function createBatchIntegration(integrations: APIIntegration[]): {
  success: number
  failed: number
  errors: string[]
} {
  let success = 0
  let failed = 0
  const errors: string[] = []
  
  integrations.forEach(integration => {
    try {
      apiIntegrationManager.addIntegration(integration)
      success++
    } catch (error) {
      failed++
      errors.push(`Failed to add ${integration.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })
  
  return { success, failed, errors }
}