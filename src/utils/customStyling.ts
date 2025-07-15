// 自定义样式系统

export interface StyleRule {
  id: string
  name: string
  selector: string
  properties: StyleProperty[]
  conditions?: StyleCondition[]
  responsive?: ResponsiveBreakpoint[]
  hover?: StyleProperty[]
  focus?: StyleProperty[]
  active?: StyleProperty[]
}

export interface StyleProperty {
  property: string
  value: string
  important?: boolean
}

export interface StyleCondition {
  questionId: string
  operator: 'equals' | 'not_equals' | 'contains'
  value: string | number
}

export interface ResponsiveBreakpoint {
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'large'
  properties: StyleProperty[]
}

export interface ThemeConfig {
  id: string
  name: string
  description?: string
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    background: string
    surface: string
    text: {
      primary: string
      secondary: string
      disabled: string
    }
  }
  typography: {
    fontFamily: string
    fontSize: {
      small: string
      medium: string
      large: string
      xlarge: string
    }
    fontWeight: {
      normal: string
      medium: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      loose: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface CustomStyleConfig {
  theme: ThemeConfig
  rules: StyleRule[]
  globalStyles: StyleProperty[]
  animations: AnimationRule[]
}

export interface AnimationRule {
  id: string
  name: string
  keyframes: KeyframeRule[]
  duration: string
  timingFunction: string
  delay?: string
  iterationCount?: string
  direction?: string
  fillMode?: string
}

export interface KeyframeRule {
  percentage: number
  properties: StyleProperty[]
}

// 预设主题
export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: '默认主题',
    description: '简洁的默认样式',
    colors: {
      primary: '#1890ff',
      secondary: '#722ed1',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#ffffff',
      surface: '#fafafa',
      text: {
        primary: '#262626',
        secondary: '#595959',
        disabled: '#bfbfbf'
      }
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '600'
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        loose: '1.8'
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '6px',
      lg: '12px',
      full: '50%'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  },
  {
    id: 'dark',
    name: '深色主题',
    description: '深色背景主题',
    colors: {
      primary: '#1890ff',
      secondary: '#722ed1',
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      background: '#141414',
      surface: '#1f1f1f',
      text: {
        primary: '#ffffff',
        secondary: '#a6a6a6',
        disabled: '#666666'
      }
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '600'
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        loose: '1.8'
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '6px',
      lg: '12px',
      full: '50%'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'modern',
    name: '现代主题',
    description: '现代简约风格',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#f9fafb',
      surface: '#ffffff',
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        disabled: '#d1d5db'
      }
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '20px'
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '600'
      },
      lineHeight: {
        tight: '1.2',
        normal: '1.5',
        loose: '1.8'
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '50%'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  }
]

// 生成CSS样式规则
export function generateStyleRule(rule: StyleRule): string {
  let css = `${rule.selector} {\n`
  
  rule.properties.forEach(prop => {
    css += `  ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
  })
  
  css += '}\n'
  
  // 响应式样式
  if (rule.responsive) {
    const breakpoints = {
      mobile: '(max-width: 768px)',
      tablet: '(min-width: 769px) and (max-width: 1024px)',
      desktop: '(min-width: 1025px)',
      large: '(min-width: 1440px)'
    }
    
    rule.responsive.forEach(responsive => {
      css += `@media ${breakpoints[responsive.breakpoint]} {\n`
      css += `  ${rule.selector} {\n`
      responsive.properties.forEach(prop => {
        css += `    ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
      })
      css += '  }\n'
      css += '}\n'
    })
  }
  
  // 伪类样式
  if (rule.hover) {
    css += `${rule.selector}:hover {\n`
    rule.hover.forEach(prop => {
      css += `  ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
    })
    css += '}\n'
  }
  
  if (rule.focus) {
    css += `${rule.selector}:focus {\n`
    rule.focus.forEach(prop => {
      css += `  ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
    })
    css += '}\n'
  }
  
  if (rule.active) {
    css += `${rule.selector}:active {\n`
    rule.active.forEach(prop => {
      css += `  ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
    })
    css += '}\n'
  }
  
  return css
}

// 生成主题CSS变量
export function generateThemeCSS(theme: ThemeConfig): string {
  let css = ':root {\n'
  
  // 颜色变量
  css += `  --color-primary: ${theme.colors.primary};\n`
  css += `  --color-secondary: ${theme.colors.secondary};\n`
  css += `  --color-success: ${theme.colors.success};\n`
  css += `  --color-warning: ${theme.colors.warning};\n`
  css += `  --color-error: ${theme.colors.error};\n`
  css += `  --color-background: ${theme.colors.background};\n`
  css += `  --color-surface: ${theme.colors.surface};\n`
  css += `  --color-text-primary: ${theme.colors.text.primary};\n`
  css += `  --color-text-secondary: ${theme.colors.text.secondary};\n`
  css += `  --color-text-disabled: ${theme.colors.text.disabled};\n`
  
  // 字体变量
  css += `  --font-family: ${theme.typography.fontFamily};\n`
  css += `  --font-size-small: ${theme.typography.fontSize.small};\n`
  css += `  --font-size-medium: ${theme.typography.fontSize.medium};\n`
  css += `  --font-size-large: ${theme.typography.fontSize.large};\n`
  css += `  --font-size-xlarge: ${theme.typography.fontSize.xlarge};\n`
  css += `  --font-weight-normal: ${theme.typography.fontWeight.normal};\n`
  css += `  --font-weight-medium: ${theme.typography.fontWeight.medium};\n`
  css += `  --font-weight-bold: ${theme.typography.fontWeight.bold};\n`
  css += `  --line-height-tight: ${theme.typography.lineHeight.tight};\n`
  css += `  --line-height-normal: ${theme.typography.lineHeight.normal};\n`
  css += `  --line-height-loose: ${theme.typography.lineHeight.loose};\n`
  
  // 间距变量
  css += `  --spacing-xs: ${theme.spacing.xs};\n`
  css += `  --spacing-sm: ${theme.spacing.sm};\n`
  css += `  --spacing-md: ${theme.spacing.md};\n`
  css += `  --spacing-lg: ${theme.spacing.lg};\n`
  css += `  --spacing-xl: ${theme.spacing.xl};\n`
  
  // 圆角变量
  css += `  --border-radius-none: ${theme.borderRadius.none};\n`
  css += `  --border-radius-sm: ${theme.borderRadius.sm};\n`
  css += `  --border-radius-md: ${theme.borderRadius.md};\n`
  css += `  --border-radius-lg: ${theme.borderRadius.lg};\n`
  css += `  --border-radius-full: ${theme.borderRadius.full};\n`
  
  // 阴影变量
  css += `  --shadow-none: ${theme.shadows.none};\n`
  css += `  --shadow-sm: ${theme.shadows.sm};\n`
  css += `  --shadow-md: ${theme.shadows.md};\n`
  css += `  --shadow-lg: ${theme.shadows.lg};\n`
  css += `  --shadow-xl: ${theme.shadows.xl};\n`
  
  css += '}\n'
  
  return css
}

// 生成动画CSS
export function generateAnimationCSS(animation: AnimationRule): string {
  let css = `@keyframes ${animation.name} {\n`
  
  animation.keyframes.forEach(keyframe => {
    css += `  ${keyframe.percentage}% {\n`
    keyframe.properties.forEach(prop => {
      css += `    ${prop.property}: ${prop.value};\n`
    })
    css += '  }\n'
  })
  
  css += '}\n'
  
  // 生成动画类
  css += `.animation-${animation.name} {\n`
  css += `  animation-name: ${animation.name};\n`
  css += `  animation-duration: ${animation.duration};\n`
  css += `  animation-timing-function: ${animation.timingFunction};\n`
  if (animation.delay) css += `  animation-delay: ${animation.delay};\n`
  if (animation.iterationCount) css += `  animation-iteration-count: ${animation.iterationCount};\n`
  if (animation.direction) css += `  animation-direction: ${animation.direction};\n`
  if (animation.fillMode) css += `  animation-fill-mode: ${animation.fillMode};\n`
  css += '}\n'
  
  return css
}

// 应用自定义样式
export function applyCustomStyles(config: CustomStyleConfig): void {
  // 移除旧的样式
  const oldStyle = document.getElementById('questionnaire-custom-styles')
  if (oldStyle) {
    oldStyle.remove()
  }
  
  // 生成新的样式
  let css = ''
  
  // 主题样式
  css += generateThemeCSS(config.theme)
  
  // 全局样式
  if (config.globalStyles.length > 0) {
    css += 'body {\n'
    config.globalStyles.forEach(prop => {
      css += `  ${prop.property}: ${prop.value}${prop.important ? ' !important' : ''};\n`
    })
    css += '}\n'
  }
  
  // 自定义规则
  config.rules.forEach(rule => {
    css += generateStyleRule(rule)
  })
  
  // 动画
  config.animations.forEach(animation => {
    css += generateAnimationCSS(animation)
  })
  
  // 创建并应用样式
  const styleElement = document.createElement('style')
  styleElement.id = 'questionnaire-custom-styles'
  styleElement.textContent = css
  document.head.appendChild(styleElement)
}

// 创建样式规则的辅助函数
export function createStyleRule(
  name: string,
  selector: string,
  properties: StyleProperty[]
): StyleRule {
  return {
    id: `style_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    selector,
    properties
  }
}

// 创建样式属性的辅助函数
export function createStyleProperty(
  property: string,
  value: string,
  important: boolean = false
): StyleProperty {
  return {
    property,
    value,
    important
  }
}

// 验证CSS属性
export function validateCSSProperty(property: string, value: string): boolean {
  try {
    const element = document.createElement('div')
    element.style.setProperty(property, value)
    return element.style.getPropertyValue(property) !== ''
  } catch {
    return false
  }
}

// 导出样式配置
export function exportStyleConfig(config: CustomStyleConfig): string {
  return JSON.stringify(config, null, 2)
}

// 导入样式配置
export function importStyleConfig(configJson: string): CustomStyleConfig {
  try {
    return JSON.parse(configJson) as CustomStyleConfig
  } catch (error) {
    throw new Error('样式配置格式错误')
  }
}