// 增强统计分析功能

export interface StatisticsData {
  questionId: string
  responses: any[]
  totalResponses: number
  validResponses: number
  invalidResponses: number
  completionRate: number
  averageTimeSpent?: number
  responseDistribution: Record<string, number>
  statistics: QuestionStatistics
}

export interface QuestionStatistics {
  mean?: number
  median?: number
  mode?: any
  standardDeviation?: number
  variance?: number
  min?: number
  max?: number
  range?: number
  quartiles?: {
    q1: number
    q2: number
    q3: number
  }
  percentiles?: Record<number, number>
  outliers?: any[]
}

export interface TextAnalysis {
  wordCount: number
  characterCount: number
  averageWordLength: number
  sentenceCount: number
  readabilityScore: number
  sentiment: 'positive' | 'negative' | 'neutral'
  keyWords: Array<{ word: string; frequency: number }>
  topics: Array<{ topic: string; confidence: number }>
}

export interface CorrelationAnalysis {
  questionId1: string
  questionId2: string
  correlationCoefficient: number
  pValue: number
  significance: 'high' | 'medium' | 'low' | 'none'
  relationship: 'positive' | 'negative' | 'none'
}

export interface TrendAnalysis {
  questionId: string
  timeSeriesData: Array<{
    date: string
    value: number
    count: number
  }>
  trend: 'increasing' | 'decreasing' | 'stable'
  trendStrength: number
  seasonality?: {
    detected: boolean
    period?: number
    amplitude?: number
  }
  forecast?: Array<{
    date: string
    predictedValue: number
    confidence: number
  }>
}

export interface SegmentAnalysis {
  segmentName: string
  segmentCondition: string
  totalResponses: number
  questionStatistics: Record<string, QuestionStatistics>
  comparisonWithOverall: Record<string, {
    difference: number
    significance: number
  }>
}

export interface AdvancedReport {
  id: string
  title: string
  generatedAt: Date
  totalResponses: number
  completionRate: number
  averageCompletionTime: number
  questionStatistics: Record<string, StatisticsData>
  correlationMatrix: CorrelationAnalysis[]
  trendAnalysis: TrendAnalysis[]
  segmentAnalysis: SegmentAnalysis[]
  textAnalysis: Record<string, TextAnalysis>
  insights: ReportInsight[]
  recommendations: ReportRecommendation[]
}

export interface ReportInsight {
  id: string
  type: 'warning' | 'info' | 'success' | 'error'
  title: string
  description: string
  questionId?: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

export interface ReportRecommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'design' | 'content' | 'logic' | 'analysis'
  actionItems: string[]
  expectedImpact: string
}

// 计算基础统计量
export function calculateBasicStatistics(values: number[]): QuestionStatistics {
  if (values.length === 0) return {}
  
  const sortedValues = [...values].sort((a, b) => a - b)
  const n = values.length
  
  // 均值
  const mean = values.reduce((sum, val) => sum + val, 0) / n
  
  // 中位数
  const median = n % 2 === 0 
    ? (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2
    : sortedValues[Math.floor(n / 2)]
  
  // 众数
  const frequency: Record<number, number> = {}
  values.forEach(val => frequency[val] = (frequency[val] || 0) + 1)
  const maxFreq = Math.max(...Object.values(frequency))
  const mode = Object.keys(frequency)
    .filter(key => frequency[Number(key)] === maxFreq)
    .map(Number)[0]
  
  // 方差和标准差
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
  const standardDeviation = Math.sqrt(variance)
  
  // 最小值、最大值、范围
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  
  // 四分位数
  const q1 = calculatePercentile(sortedValues, 25)
  const q2 = median
  const q3 = calculatePercentile(sortedValues, 75)
  
  // 百分位数
  const percentiles: Record<number, number> = {}
  for (let p = 10; p <= 90; p += 10) {
    percentiles[p] = calculatePercentile(sortedValues, p)
  }
  
  // 异常值检测 (使用IQR方法)
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  const outliers = values.filter(val => val < lowerBound || val > upperBound)
  
  return {
    mean,
    median,
    mode,
    standardDeviation,
    variance,
    min,
    max,
    range,
    quartiles: { q1, q2, q3 },
    percentiles,
    outliers
  }
}

// 计算百分位数
function calculatePercentile(sortedValues: number[], percentile: number): number {
  const index = (percentile / 100) * (sortedValues.length - 1)
  if (Number.isInteger(index)) {
    return sortedValues[index]
  }
  
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower
  
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

// 文本分析
export function analyzeText(text: string): TextAnalysis {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // 基础统计
  const wordCount = words.length
  const characterCount = text.length
  const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount
  const sentenceCount = sentences.length
  
  // 词频分析
  const wordFrequency: Record<string, number> = {}
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })
  
  const keyWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, frequency]) => ({ word, frequency }))
  
  // 简单可读性评分 (基于平均句长和词长)
  const averageSentenceLength = wordCount / sentenceCount
  const readabilityScore = Math.max(0, 100 - (averageSentenceLength * 2) - (averageWordLength * 5))
  
  // 简单情感分析
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'satisfied']
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'disappointed', 'frustrated', 'poor', 'worst']
  
  const positiveCount = words.filter(word => positiveWords.includes(word)).length
  const negativeCount = words.filter(word => negativeWords.includes(word)).length
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  if (positiveCount > negativeCount) sentiment = 'positive'
  else if (negativeCount > positiveCount) sentiment = 'negative'
  
  // 主题提取 (简单关键词聚类)
  const topics = extractTopics(keyWords)
  
  return {
    wordCount,
    characterCount,
    averageWordLength,
    sentenceCount,
    readabilityScore,
    sentiment,
    keyWords,
    topics
  }
}

// 主题提取
function extractTopics(keyWords: Array<{ word: string; frequency: number }>): Array<{ topic: string; confidence: number }> {
  const topicKeywords: Record<string, string[]> = {
    'product': ['product', 'feature', 'quality', 'design', 'functionality'],
    'service': ['service', 'support', 'help', 'staff', 'team'],
    'experience': ['experience', 'feeling', 'impression', 'satisfaction', 'journey'],
    'price': ['price', 'cost', 'value', 'expensive', 'cheap', 'affordable'],
    'delivery': ['delivery', 'shipping', 'fast', 'slow', 'time', 'quick']
  }
  
  const topics: Array<{ topic: string; confidence: number }> = []
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    const matches = keyWords.filter(kw => keywords.includes(kw.word.toLowerCase()))
    if (matches.length > 0) {
      const confidence = matches.reduce((sum, match) => sum + match.frequency, 0) / keyWords.length
      topics.push({ topic, confidence })
    }
  })
  
  return topics.sort((a, b) => b.confidence - a.confidence)
}

// 相关性分析
export function calculateCorrelation(values1: number[], values2: number[]): CorrelationAnalysis {
  if (values1.length !== values2.length || values1.length === 0) {
    return {
      questionId1: '',
      questionId2: '',
      correlationCoefficient: 0,
      pValue: 1,
      significance: 'none',
      relationship: 'none'
    }
  }
  
  const n = values1.length
  const mean1 = values1.reduce((sum, val) => sum + val, 0) / n
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / n
  
  let numerator = 0
  let denominator1 = 0
  let denominator2 = 0
  
  for (let i = 0; i < n; i++) {
    const diff1 = values1[i] - mean1
    const diff2 = values2[i] - mean2
    numerator += diff1 * diff2
    denominator1 += diff1 * diff1
    denominator2 += diff2 * diff2
  }
  
  const correlationCoefficient = numerator / Math.sqrt(denominator1 * denominator2)
  
  // 简单的p值估算
  const tStatistic = correlationCoefficient * Math.sqrt((n - 2) / (1 - correlationCoefficient * correlationCoefficient))
  const pValue = 2 * (1 - normalCDF(Math.abs(tStatistic)))
  
  let significance: 'high' | 'medium' | 'low' | 'none' = 'none'
  if (pValue < 0.01) significance = 'high'
  else if (pValue < 0.05) significance = 'medium'
  else if (pValue < 0.1) significance = 'low'
  
  const relationship = correlationCoefficient > 0.1 ? 'positive' : 
                     correlationCoefficient < -0.1 ? 'negative' : 'none'
  
  return {
    questionId1: '',
    questionId2: '',
    correlationCoefficient,
    pValue,
    significance,
    relationship
  }
}

// 正态分布累积密度函数近似
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

// 误差函数近似
function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
  return sign * y
}

// 趋势分析
export function analyzeTrend(timeSeriesData: Array<{ date: string; value: number }>): TrendAnalysis {
  if (timeSeriesData.length < 2) {
    return {
      questionId: '',
      timeSeriesData: [],
      trend: 'stable',
      trendStrength: 0
    }
  }
  
  const n = timeSeriesData.length
  const xValues = timeSeriesData.map((_, index) => index)
  const yValues = timeSeriesData.map(item => item.value)
  
  // 线性回归计算趋势
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n
  
  let numerator = 0
  let denominator = 0
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean)
    denominator += (xValues[i] - xMean) * (xValues[i] - xMean)
  }
  
  const slope = numerator / denominator
  const trendStrength = Math.abs(slope)
  
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (slope > 0.1) trend = 'increasing'
  else if (slope < -0.1) trend = 'decreasing'
  
  // 季节性检测 (简单周期性分析)
  const seasonality = detectSeasonality(yValues)
  
  return {
    questionId: '',
    timeSeriesData: timeSeriesData.map(item => ({
      ...item,
      count: 1 // 简化处理
    })),
    trend,
    trendStrength,
    seasonality
  }
}

// 季节性检测
function detectSeasonality(values: number[]): { detected: boolean; period?: number; amplitude?: number } {
  const n = values.length
  if (n < 12) return { detected: false }
  
  // 使用自相关函数检测周期性
  const autocorrelations: number[] = []
  
  for (let lag = 1; lag <= Math.min(n / 2, 12); lag++) {
    let sum = 0
    let count = 0
    
    for (let i = 0; i < n - lag; i++) {
      sum += values[i] * values[i + lag]
      count++
    }
    
    autocorrelations.push(sum / count)
  }
  
  // 查找最大自相关值
  const maxCorrelation = Math.max(...autocorrelations)
  const maxIndex = autocorrelations.indexOf(maxCorrelation) + 1
  
  const detected = maxCorrelation > 0.3
  const period = detected ? maxIndex : undefined
  const amplitude = detected ? maxCorrelation : undefined
  
  return { detected, period, amplitude }
}

// 生成报告洞察
export function generateInsights(report: AdvancedReport): ReportInsight[] {
  const insights: ReportInsight[] = []
  
  // 完成率分析
  if (report.completionRate < 0.7) {
    insights.push({
      id: `insight_${Date.now()}_1`,
      type: 'warning',
      title: '完成率偏低',
      description: `问卷完成率仅为 ${(report.completionRate * 100).toFixed(1)}%，建议优化问卷设计以提高完成率`,
      impact: 'high',
      confidence: 0.9
    })
  }
  
  // 完成时间分析
  if (report.averageCompletionTime > 600) { // 10分钟
    insights.push({
      id: `insight_${Date.now()}_2`,
      type: 'warning',
      title: '完成时间过长',
      description: `平均完成时间为 ${Math.round(report.averageCompletionTime / 60)} 分钟，可能影响用户体验`,
      impact: 'medium',
      confidence: 0.8
    })
  }
  
  // 异常值检测
  Object.entries(report.questionStatistics).forEach(([questionId, stats]) => {
    if (stats.statistics.outliers && stats.statistics.outliers.length > stats.totalResponses * 0.05) {
      insights.push({
        id: `insight_${Date.now()}_${questionId}`,
        type: 'info',
        title: '发现异常值',
        description: `问题存在 ${stats.statistics.outliers.length} 个异常值，建议检查数据质量`,
        questionId,
        impact: 'medium',
        confidence: 0.7
      })
    }
  })
  
  // 相关性分析
  const strongCorrelations = report.correlationMatrix.filter(corr => 
    Math.abs(corr.correlationCoefficient) > 0.7 && corr.significance === 'high'
  )
  
  if (strongCorrelations.length > 0) {
    insights.push({
      id: `insight_${Date.now()}_correlation`,
      type: 'success',
      title: '发现强相关性',
      description: `发现 ${strongCorrelations.length} 对问题之间存在强相关性，可用于预测分析`,
      impact: 'high',
      confidence: 0.9
    })
  }
  
  return insights
}

// 生成改进建议
export function generateRecommendations(report: AdvancedReport): ReportRecommendation[] {
  const recommendations: ReportRecommendation[] = []
  
  // 基于完成率的建议
  if (report.completionRate < 0.8) {
    recommendations.push({
      id: `rec_${Date.now()}_1`,
      title: '优化问卷长度',
      description: '当前问卷完成率偏低，建议缩短问卷长度或优化问题设计',
      priority: 'high',
      category: 'design',
      actionItems: [
        '移除非必要问题',
        '合并相似问题',
        '增加进度指示器',
        '优化问题表述'
      ],
      expectedImpact: '提高完成率10-15%'
    })
  }
  
  // 基于响应质量的建议
  const lowResponseQuestions = Object.entries(report.questionStatistics)
    .filter(([, stats]) => stats.validResponses / stats.totalResponses < 0.9)
    .map(([questionId]) => questionId)
  
  if (lowResponseQuestions.length > 0) {
    recommendations.push({
      id: `rec_${Date.now()}_2`,
      title: '改进问题质量',
      description: '某些问题的有效响应率较低，建议重新设计这些问题',
      priority: 'medium',
      category: 'content',
      actionItems: [
        '重新审视问题表述',
        '添加帮助文本',
        '优化选项设计',
        '增加验证提示'
      ],
      expectedImpact: '提高数据质量5-10%'
    })
  }
  
  // 基于用户体验的建议
  if (report.averageCompletionTime > 300) { // 5分钟
    recommendations.push({
      id: `rec_${Date.now()}_3`,
      title: '优化用户体验',
      description: '问卷完成时间较长，建议优化交互设计',
      priority: 'medium',
      category: 'design',
      actionItems: [
        '使用分页设计',
        '添加自动保存功能',
        '优化加载速度',
        '简化操作步骤'
      ],
      expectedImpact: '减少完成时间20-30%'
    })
  }
  
  return recommendations
}

// 生成完整报告
export function generateAdvancedReport(
  responses: any[],
  questions: Array<{ id: string; title: string; type: string }>
): AdvancedReport {
  const report: AdvancedReport = {
    id: `report_${Date.now()}`,
    title: '问卷数据分析报告',
    generatedAt: new Date(),
    totalResponses: responses.length,
    completionRate: calculateCompletionRate(responses),
    averageCompletionTime: calculateAverageCompletionTime(responses),
    questionStatistics: {},
    correlationMatrix: [],
    trendAnalysis: [],
    segmentAnalysis: [],
    textAnalysis: {},
    insights: [],
    recommendations: []
  }
  
  // 计算每个问题的统计量
  questions.forEach(question => {
    const questionResponses = responses.map(r => r[question.id]).filter(v => v !== undefined)
    const validResponses = questionResponses.filter(v => v !== null && v !== '')
    
    const statistics: StatisticsData = {
      questionId: question.id,
      responses: questionResponses,
      totalResponses: responses.length,
      validResponses: validResponses.length,
      invalidResponses: questionResponses.length - validResponses.length,
      completionRate: validResponses.length / responses.length,
      responseDistribution: calculateResponseDistribution(questionResponses),
      statistics: question.type === 'number' ? calculateBasicStatistics(validResponses.map(Number)) : {}
    }
    
    report.questionStatistics[question.id] = statistics
    
    // 文本分析
    if (question.type === 'text' || question.type === 'textarea') {
      const textData = validResponses.join(' ')
      if (textData.length > 0) {
        report.textAnalysis[question.id] = analyzeText(textData)
      }
    }
  })
  
  // 相关性分析
  const numericQuestions = questions.filter(q => q.type === 'number' || q.type === 'rating')
  for (let i = 0; i < numericQuestions.length; i++) {
    for (let j = i + 1; j < numericQuestions.length; j++) {
      const q1 = numericQuestions[i]
      const q2 = numericQuestions[j]
      const values1 = responses.map(r => Number(r[q1.id]) || 0)
      const values2 = responses.map(r => Number(r[q2.id]) || 0)
      
      const correlation = calculateCorrelation(values1, values2)
      correlation.questionId1 = q1.id
      correlation.questionId2 = q2.id
      
      report.correlationMatrix.push(correlation)
    }
  }
  
  // 生成洞察和建议
  report.insights = generateInsights(report)
  report.recommendations = generateRecommendations(report)
  
  return report
}

// 计算完成率
function calculateCompletionRate(responses: any[]): number {
  if (responses.length === 0) return 0
  
  const completedResponses = responses.filter(response => {
    const values = Object.values(response)
    return values.some(value => value !== undefined && value !== null && value !== '')
  })
  
  return completedResponses.length / responses.length
}

// 计算平均完成时间
function calculateAverageCompletionTime(responses: any[]): number {
  const times = responses
    .map(r => r.completionTime)
    .filter(t => typeof t === 'number' && t > 0)
  
  if (times.length === 0) return 0
  
  return times.reduce((sum, time) => sum + time, 0) / times.length
}

// 计算响应分布
function calculateResponseDistribution(responses: any[]): Record<string, number> {
  const distribution: Record<string, number> = {}
  
  responses.forEach(response => {
    const key = String(response)
    distribution[key] = (distribution[key] || 0) + 1
  })
  
  return distribution
}

// 导出报告
export function exportReport(report: AdvancedReport, format: 'json' | 'csv' | 'pdf'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(report, null, 2)
    case 'csv':
      return convertReportToCSV(report)
    case 'pdf':
      return convertReportToPDF(report)
    default:
      return JSON.stringify(report, null, 2)
  }
}

// 转换为CSV格式
function convertReportToCSV(report: AdvancedReport): string {
  const lines: string[] = []
  
  // 基本信息
  lines.push('报告信息')
  lines.push(`标题,${report.title}`)
  lines.push(`生成时间,${report.generatedAt.toLocaleString()}`)
  lines.push(`总响应数,${report.totalResponses}`)
  lines.push(`完成率,${(report.completionRate * 100).toFixed(2)}%`)
  lines.push(`平均完成时间,${Math.round(report.averageCompletionTime / 60)}分钟`)
  lines.push('')
  
  // 问题统计
  lines.push('问题统计')
  lines.push('问题ID,总响应数,有效响应数,完成率,平均值,标准差')
  Object.entries(report.questionStatistics).forEach(([questionId, stats]) => {
    lines.push([
      questionId,
      stats.totalResponses,
      stats.validResponses,
      `${(stats.completionRate * 100).toFixed(2)}%`,
      stats.statistics.mean?.toFixed(2) || '',
      stats.statistics.standardDeviation?.toFixed(2) || ''
    ].join(','))
  })
  
  return lines.join('\n')
}

// 转换为PDF格式 (简化实现)
function convertReportToPDF(report: AdvancedReport): string {
  // 这里应该使用专门的PDF生成库
  // 为了演示，返回HTML格式
  return `
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <p>生成时间: ${report.generatedAt.toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h2>概览</h2>
          <p>总响应数: ${report.totalResponses}</p>
          <p>完成率: ${(report.completionRate * 100).toFixed(2)}%</p>
          <p>平均完成时间: ${Math.round(report.averageCompletionTime / 60)}分钟</p>
        </div>
        
        <div class="section">
          <h2>洞察</h2>
          ${report.insights.map(insight => `
            <div style="margin: 10px 0; padding: 10px; border-left: 4px solid ${getInsightColor(insight.type)};">
              <strong>${insight.title}</strong>
              <p>${insight.description}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>建议</h2>
          ${report.recommendations.map(rec => `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
              <strong>${rec.title}</strong>
              <p>${rec.description}</p>
              <p><strong>预期影响:</strong> ${rec.expectedImpact}</p>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `
}

// 获取洞察颜色
function getInsightColor(type: string): string {
  switch (type) {
    case 'warning': return '#ff9800'
    case 'error': return '#f44336'
    case 'success': return '#4caf50'
    case 'info': return '#2196f3'
    default: return '#666'
  }
}