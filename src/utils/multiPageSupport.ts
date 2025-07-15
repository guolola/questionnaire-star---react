// 多页面支持系统

export interface QuestionnairePage {
  id: string
  title: string
  description?: string
  questionIds: string[]
  order: number
  condition?: {
    sourceQuestionId: string
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains'
    value: string | number | string[]
  }
}

export interface MultiPageState {
  pages: QuestionnairePage[]
  currentPageIndex: number
  responses: Record<string, any>
  pageHistory: string[] // 页面访问历史
}

export interface PageNavigation {
  canGoPrevious: boolean
  canGoNext: boolean
  canSubmit: boolean
  totalPages: number
  currentPage: number
}

// 创建新页面
export function createPage(
  title: string,
  questionIds: string[],
  order: number,
  description?: string
): QuestionnairePage {
  return {
    id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    questionIds,
    order
  }
}

// 评估页面显示条件
export function evaluatePageCondition(
  page: QuestionnairePage,
  responses: Record<string, any>
): boolean {
  if (!page.condition) return true

  const { sourceQuestionId, operator, value } = page.condition
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
    default:
      return true
  }
}

// 获取可见页面列表
export function getVisiblePages(
  pages: QuestionnairePage[],
  responses: Record<string, any>
): QuestionnairePage[] {
  return pages
    .filter(page => evaluatePageCondition(page, responses))
    .sort((a, b) => a.order - b.order)
}

// 获取当前页面
export function getCurrentPage(
  pages: QuestionnairePage[],
  currentPageIndex: number,
  responses: Record<string, any>
): QuestionnairePage | null {
  const visiblePages = getVisiblePages(pages, responses)
  return visiblePages[currentPageIndex] || null
}

// 获取导航状态
export function getPageNavigation(
  pages: QuestionnairePage[],
  currentPageIndex: number,
  responses: Record<string, any>,
  requiredQuestions: string[] = []
): PageNavigation {
  const visiblePages = getVisiblePages(pages, responses)
  const currentPage = visiblePages[currentPageIndex]
  
  // 检查当前页面是否已完成必填项
  const currentPageCompleted = currentPage
    ? currentPage.questionIds.every(questionId => {
        if (requiredQuestions.includes(questionId)) {
          const response = responses[questionId]
          return response !== undefined && response !== null && response !== ''
        }
        return true
      })
    : false

  return {
    canGoPrevious: currentPageIndex > 0,
    canGoNext: currentPageIndex < visiblePages.length - 1 && currentPageCompleted,
    canSubmit: currentPageIndex === visiblePages.length - 1 && currentPageCompleted,
    totalPages: visiblePages.length,
    currentPage: currentPageIndex + 1
  }
}

// 导航到下一页
export function navigateToNextPage(
  pages: QuestionnairePage[],
  currentPageIndex: number,
  responses: Record<string, any>,
  pageHistory: string[]
): { newPageIndex: number; newPageHistory: string[] } {
  const visiblePages = getVisiblePages(pages, responses)
  const newPageIndex = Math.min(currentPageIndex + 1, visiblePages.length - 1)
  const currentPage = visiblePages[newPageIndex]
  
  const newPageHistory = currentPage
    ? [...pageHistory, currentPage.id]
    : pageHistory

  return {
    newPageIndex,
    newPageHistory
  }
}

// 导航到上一页
export function navigateToPreviousPage(
  currentPageIndex: number,
  pageHistory: string[]
): { newPageIndex: number; newPageHistory: string[] } {
  const newPageIndex = Math.max(currentPageIndex - 1, 0)
  const newPageHistory = pageHistory.slice(0, -1)

  return {
    newPageIndex,
    newPageHistory
  }
}

// 验证页面完成状态
export function validatePageCompletion(
  page: QuestionnairePage,
  responses: Record<string, any>,
  requiredQuestions: string[]
): { isComplete: boolean; missingQuestions: string[] } {
  const missingQuestions: string[] = []

  for (const questionId of page.questionIds) {
    if (requiredQuestions.includes(questionId)) {
      const response = responses[questionId]
      if (response === undefined || response === null || response === '') {
        missingQuestions.push(questionId)
      }
    }
  }

  return {
    isComplete: missingQuestions.length === 0,
    missingQuestions
  }
}

// 获取页面进度
export function getPageProgress(
  pages: QuestionnairePage[],
  currentPageIndex: number,
  responses: Record<string, any>
): number {
  const visiblePages = getVisiblePages(pages, responses)
  if (visiblePages.length === 0) return 0
  
  return Math.round(((currentPageIndex + 1) / visiblePages.length) * 100)
}

// 重新组织问题到页面
export function reorganizeQuestionsToPages(
  questionIds: string[],
  pageSize: number = 5
): QuestionnairePage[] {
  const pages: QuestionnairePage[] = []
  
  for (let i = 0; i < questionIds.length; i += pageSize) {
    const pageQuestions = questionIds.slice(i, i + pageSize)
    const pageNumber = Math.floor(i / pageSize) + 1
    
    pages.push(createPage(
      `第${pageNumber}页`,
      pageQuestions,
      pageNumber
    ))
  }
  
  return pages
}

// 导出页面配置
export function exportPageConfig(pages: QuestionnairePage[]): string {
  return JSON.stringify(pages, null, 2)
}

// 导入页面配置
export function importPageConfig(configJson: string): QuestionnairePage[] {
  try {
    const pages = JSON.parse(configJson) as QuestionnairePage[]
    return pages.map(page => ({
      ...page,
      id: page.id || `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }))
  } catch (error) {
    throw new Error('页面配置格式错误')
  }
}