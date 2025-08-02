# 代码审核

掌握小程序代码审核的核心要点，确保代码质量和应用稳定性。

## 📋 审核准备

### 提交前检查清单

```javascript
// utils/preSubmitChecker.js
class PreSubmitChecker {
  constructor() {
    this.checkItems = [
      { name: '代码格式化', check: this.checkCodeFormat },
      { name: '语法错误', check: this.checkSyntaxErrors },
      { name: '性能问题', check: this.checkPerformanceIssues },
      { name: '安全漏洞', check: this.checkSecurityIssues },
      { name: '兼容性问题', check: this.checkCompatibility },
      { name: '资源优化', check: this.checkResourceOptimization },
      { name: '用户体验', check: this.checkUserExperience }
    ]
  }

  // 执行完整检查
  async runFullCheck(projectPath) {
    const results = []
    
    console.log('开始代码审核检查...')
    
    for (const item of this.checkItems) {
      try {
        const result = await item.check.call(this, projectPath)
        results.push({
          name: item.name,
          status: result.passed ? 'passed' : 'failed',
          issues: result.issues || [],
          suggestions: result.suggestions || []
        })
        
        console.log(`✓ ${item.name}: ${result.passed ? '通过' : '发现问题'}`)
      } catch (error) {
        console.error(`检查 ${item.name} 时出错:`, error)
        results.push({
          name: item.name,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return this.generateReport(results)
  }

  // 检查代码格式化
  async checkCodeFormat(projectPath) {
    const issues = []
    const suggestions = []
    
    // 检查缩进一致性
    const files = await this.getJavaScriptFiles(projectPath)
    
    for (const file of files) {
      const content = await this.readFile(file)
      const lines = content.split('\n')
      
      let indentType = null // 'space' or 'tab'
      let indentSize = null
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const match = line.match(/^(\s+)/)
        
        if (match) {
          const indent = match[1]
          
          if (indentType === null) {
            indentType = indent.includes('\t') ? 'tab' : 'space'
            if (indentType === 'space') {
              indentSize = indent.length
            }
          } else {
            const currentType = indent.includes('\t') ? 'tab' : 'space'
            if (currentType !== indentType) {
              issues.push({
                file,
                line: i + 1,
                message: '缩进类型不一致',
                severity: 'warning'
              })
            }
          }
        }
      }
    }
    
    if (issues.length > 0) {
      suggestions.push('使用统一的代码格式化工具（如 Prettier）')
      suggestions.push('配置编辑器自动格式化')
    }
    
    return {
      passed: issues.length === 0,
      issues,
      suggestions
    }
  }

  // 检查语法错误
  async checkSyntaxErrors(projectPath) {
    const issues = []
    const suggestions = []
    
    try {
      // 这里可以集成 ESLint 或其他语法检查工具
      const files = await this.getJavaScriptFiles(projectPath)
      
      for (const file of files) {
        const content = await this.readFile(file)
        
        // 简单的语法检查
        try {
          // 检查 JSON 文件语法
          if (file.endsWith('.json')) {
            JSON.parse(content)
          }
          
          // 检查常见语法错误
          if (content.includes('console.log') && !file.includes('utils/')) {
            issues.push({
              file,
              message: '生产代码中包含 console.log',
              severity: 'warning'
            })
          }
          
          // 检查未使用的变量
          const unusedVars = this.findUnusedVariables(content)
          unusedVars.forEach(varName => {
            issues.push({
              file,
              message: `未使用的变量: ${varName}`,
              severity: 'info'
            })
          })
          
        } catch (error) {
          issues.push({
            file,
            message: `语法错误: ${error.message}`,
            severity: 'error'
          })
        }
      }
      
    } catch (error) {
      issues.push({
        message: `语法检查失败: ${error.message}`,
        severity: 'error'
      })
    }
    
    if (issues.length > 0) {
      suggestions.push('配置 ESLint 进行自动语法检查')
      suggestions.push('使用 TypeScript 提供更好的类型检查')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 检查性能问题
  async checkPerformanceIssues(projectPath) {
    const issues = []
    const suggestions = []
    
    const files = await this.getJavaScriptFiles(projectPath)
    
    for (const file of files) {
      const content = await this.readFile(file)
      
      // 检查频繁的 setData 调用
      const setDataMatches = content.match(/setData\s*\(/g)
      if (setDataMatches && setDataMatches.length > 10) {
        issues.push({
          file,
          message: `频繁调用 setData (${setDataMatches.length} 次)`,
          severity: 'warning'
        })
      }
      
      // 检查同步存储使用
      if (content.includes('getStorageSync') || content.includes('setStorageSync')) {
        issues.push({
          file,
          message: '使用同步存储可能阻塞主线程',
          severity: 'warning'
        })
      }
      
      // 检查大图片资源
      const imageMatches = content.match(/\.(jpg|jpeg|png|gif)/gi)
      if (imageMatches && imageMatches.length > 20) {
        issues.push({
          file,
          message: '包含大量图片资源，建议优化',
          severity: 'info'
        })
      }
      
      // 检查内存泄漏风险
      if (content.includes('setInterval') && !content.includes('clearInterval')) {
        issues.push({
          file,
          message: '可能存在定时器内存泄漏',
          severity: 'warning'
        })
      }
    }
    
    if (issues.length > 0) {
      suggestions.push('合并 setData 调用，减少渲染次数')
      suggestions.push('使用异步存储 API')
      suggestions.push('实现图片懒加载和压缩')
      suggestions.push('确保清理定时器和事件监听器')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 检查安全问题
  async checkSecurityIssues(projectPath) {
    const issues = []
    const suggestions = []
    
    const files = await this.getAllFiles(projectPath)
    
    for (const file of files) {
      const content = await this.readFile(file)
      
      // 检查硬编码的敏感信息
      const sensitivePatterns = [
        { pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi, message: '可能包含硬编码密码' },
        { pattern: /token\s*[:=]\s*['"][^'"]+['"]/gi, message: '可能包含硬编码 token' },
        { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/gi, message: '可能包含硬编码密钥' },
        { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, message: '可能包含硬编码 API 密钥' }
      ]
      
      sensitivePatterns.forEach(({ pattern, message }) => {
        const matches = content.match(pattern)
        if (matches) {
          issues.push({
            file,
            message,
            severity: 'error',
            matches: matches.length
          })
        }
      })
      
      // 检查不安全的网络请求
      if (content.includes('http://') && !content.includes('localhost')) {
        issues.push({
          file,
          message: '使用不安全的 HTTP 协议',
          severity: 'warning'
        })
      }
      
      // 检查用户输入验证
      if (content.includes('input') && !content.includes('validate')) {
        issues.push({
          file,
          message: '可能缺少用户输入验证',
          severity: 'info'
        })
      }
    }
    
    if (issues.length > 0) {
      suggestions.push('将敏感信息存储在服务器端')
      suggestions.push('使用 HTTPS 协议进行网络通信')
      suggestions.push('对所有用户输入进行验证和过滤')
      suggestions.push('实现适当的错误处理机制')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 检查兼容性问题
  async checkCompatibility(projectPath) {
    const issues = []
    const suggestions = []
    
    // 检查 app.json 配置
    const appJsonPath = `${projectPath}/app.json`
    const appJson = await this.readJsonFile(appJsonPath)
    
    if (appJson) {
      // 检查基础库版本要求
      if (!appJson.requiredBackgroundModes) {
        issues.push({
          file: 'app.json',
          message: '未设置最低基础库版本要求',
          severity: 'warning'
        })
      }
      
      // 检查权限配置
      const requiredPermissions = ['scope.userInfo', 'scope.userLocation']
      requiredPermissions.forEach(permission => {
        if (appJson.permission && !appJson.permission[permission]) {
          issues.push({
            file: 'app.json',
            message: `可能需要 ${permission} 权限`,
            severity: 'info'
          })
        }
      })
    }
    
    // 检查 API 兼容性
    const files = await this.getJavaScriptFiles(projectPath)
    
    for (const file of files) {
      const content = await this.readFile(file)
      
      // 检查新 API 使用
      const newApis = [
        'wx.getUserProfile',
        'wx.getPrivacySetting',
        'wx.requirePrivacyAuthorize'
      ]
      
      newApis.forEach(api => {
        if (content.includes(api)) {
          issues.push({
            file,
            message: `使用了较新的 API: ${api}，需要检查兼容性`,
            severity: 'info'
          })
        }
      })
      
      // 检查废弃 API
      const deprecatedApis = [
        'wx.getUserInfo',
        'wx.openSetting'
      ]
      
      deprecatedApis.forEach(api => {
        if (content.includes(api)) {
          issues.push({
            file,
            message: `使用了废弃的 API: ${api}`,
            severity: 'warning'
          })
        }
      })
    }
    
    if (issues.length > 0) {
      suggestions.push('设置合适的最低基础库版本')
      suggestions.push('使用 wx.canIUse() 检查 API 可用性')
      suggestions.push('提供降级方案处理兼容性问题')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 检查资源优化
  async checkResourceOptimization(projectPath) {
    const issues = []
    const suggestions = []
    
    // 检查图片资源
    const imageFiles = await this.getImageFiles(projectPath)
    let totalImageSize = 0
    
    for (const file of imageFiles) {
      const size = await this.getFileSize(file)
      totalImageSize += size
      
      if (size > 500 * 1024) { // 500KB
        issues.push({
          file,
          message: `图片文件过大: ${(size / 1024).toFixed(2)}KB`,
          severity: 'warning'
        })
      }
    }
    
    if (totalImageSize > 2 * 1024 * 1024) { // 2MB
      issues.push({
        message: `图片资源总大小过大: ${(totalImageSize / 1024 / 1024).toFixed(2)}MB`,
        severity: 'warning'
      })
    }
    
    // 检查代码包大小
    const jsFiles = await this.getJavaScriptFiles(projectPath)
    let totalCodeSize = 0
    
    for (const file of jsFiles) {
      const size = await this.getFileSize(file)
      totalCodeSize += size
      
      if (size > 100 * 1024) { // 100KB
        issues.push({
          file,
          message: `JavaScript 文件过大: ${(size / 1024).toFixed(2)}KB`,
          severity: 'info'
        })
      }
    }
    
    if (issues.length > 0) {
      suggestions.push('压缩和优化图片资源')
      suggestions.push('使用分包加载减少主包大小')
      suggestions.push('移除未使用的代码和资源')
      suggestions.push('使用 CDN 托管大型资源')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 检查用户体验
  async checkUserExperience(projectPath) {
    const issues = []
    const suggestions = []
    
    const files = await this.getJavaScriptFiles(projectPath)
    
    for (const file of files) {
      const content = await this.readFile(file)
      
      // 检查加载提示
      if (content.includes('wx.request') && !content.includes('showLoading')) {
        issues.push({
          file,
          message: '网络请求缺少加载提示',
          severity: 'info'
        })
      }
      
      // 检查错误处理
      if (content.includes('wx.request') && !content.includes('fail:')) {
        issues.push({
          file,
          message: '网络请求缺少错误处理',
          severity: 'warning'
        })
      }
      
      // 检查空状态处理
      if (content.includes('list') && !content.includes('empty')) {
        issues.push({
          file,
          message: '可能缺少空状态处理',
          severity: 'info'
        })
      }
    }
    
    // 检查页面配置
    const pageFiles = await this.getPageConfigFiles(projectPath)
    
    for (const file of pageFiles) {
      const config = await this.readJsonFile(file)
      
      if (config && !config.navigationBarTitleText) {
        issues.push({
          file,
          message: '页面缺少标题配置',
          severity: 'info'
        })
      }
      
      if (config && !config.enablePullDownRefresh && !config.onReachBottomDistance) {
        issues.push({
          file,
          message: '可能需要配置下拉刷新或上拉加载',
          severity: 'info'
        })
      }
    }
    
    if (issues.length > 0) {
      suggestions.push('为所有异步操作添加加载提示')
      suggestions.push('实现完善的错误处理和用户反馈')
      suggestions.push('设计合适的空状态和加载状态')
      suggestions.push('优化页面标题和导航体验')
    }
    
    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      suggestions
    }
  }

  // 生成审核报告
  generateReport(results) {
    const totalIssues = results.reduce((sum, result) => 
      sum + (result.issues ? result.issues.length : 0), 0)
    
    const errorCount = results.reduce((sum, result) => 
      sum + (result.issues ? result.issues.filter(i => i.severity === 'error').length : 0), 0)
    
    const warningCount = results.reduce((sum, result) => 
      sum + (result.issues ? result.issues.filter(i => i.severity === 'warning').length : 0), 0)
    
    const passed = errorCount === 0
    
    return {
      summary: {
        passed,
        totalChecks: results.length,
        totalIssues,
        errorCount,
        warningCount,
        infoCount: totalIssues - errorCount - warningCount
      },
      results,
      recommendations: this.generateRecommendations(results),
      generatedAt: new Date().toISOString()
    }
  }

  // 生成建议
  generateRecommendations(results) {
    const allSuggestions = []
    
    results.forEach(result => {
      if (result.suggestions) {
        allSuggestions.push(...result.suggestions)
      }
    })
    
    // 去重并按优先级排序
    const uniqueSuggestions = [...new Set(allSuggestions)]
    
    return uniqueSuggestions.map(suggestion => ({
      text: suggestion,
      priority: this.getSuggestionPriority(suggestion)
    })).sort((a, b) => b.priority - a.priority)
  }

  // 获取建议优先级
  getSuggestionPriority(suggestion) {
    if (suggestion.includes('错误') || suggestion.includes('安全')) {
      return 3 // 高优先级
    } else if (suggestion.includes('性能') || suggestion.includes('优化')) {
      return 2 // 中优先级
    } else {
      return 1 // 低优先级
    }
  }

  // 辅助方法
  async getJavaScriptFiles(projectPath) {
    // 实现获取 JavaScript 文件列表的逻辑
    return []
  }

  async getAllFiles(projectPath) {
    // 实现获取所有文件列表的逻辑
    return []
  }

  async getImageFiles(projectPath) {
    // 实现获取图片文件列表的逻辑
    return []
  }

  async getPageConfigFiles(projectPath) {
    // 实现获取页面配置文件列表的逻辑
    return []
  }

  async readFile(filePath) {
    // 实现读取文件内容的逻辑
    return ''
  }

  async readJsonFile(filePath) {
    // 实现读取 JSON 文件的逻辑
    return null
  }

  async getFileSize(filePath) {
    // 实现获取文件大小的逻辑
    return 0
  }

  findUnusedVariables(content) {
    // 实现查找未使用变量的逻辑
    return []
  }
}

module.exports = new PreSubmitChecker()
```

## 🔍 审核要点

### 代码质量检查

```javascript
// utils/codeQualityChecker.js
class CodeQualityChecker {
  constructor() {
    this.qualityMetrics = {
      complexity: 0,
      maintainability: 0,
      readability: 0,
      testability: 0
    }
  }

  // 检查代码复杂度
  checkComplexity(code, filePath) {
    const issues = []
    
    // 圈复杂度检查
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code)
    if (cyclomaticComplexity > 10) {
      issues.push({
        type: 'complexity',
        severity: 'warning',
        message: `圈复杂度过高: ${cyclomaticComplexity}`,
        file: filePath,
        suggestion: '考虑拆分函数或简化逻辑'
      })
    }
    
    // 函数长度检查
    const functions = this.extractFunctions(code)
    functions.forEach(func => {
      if (func.lines > 50) {
        issues.push({
          type: 'function_length',
          severity: 'info',
          message: `函数 ${func.name} 过长: ${func.lines} 行`,
          file: filePath,
          suggestion: '考虑拆分为更小的函数'
        })
      }
    })
    
    // 嵌套深度检查
    const maxNestingDepth = this.calculateNestingDepth(code)
    if (maxNestingDepth > 4) {
      issues.push({
        type: 'nesting_depth',
        severity: 'warning',
        message: `嵌套深度过深: ${maxNestingDepth}`,
        file: filePath,
        suggestion: '使用早期返回或提取函数减少嵌套'
      })
    }
    
    return issues
  }

  // 检查可维护性
  checkMaintainability(code, filePath) {
    const issues = []
    
    // 重复代码检查
    const duplicates = this.findDuplicateCode(code)
    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate_code',
        severity: 'info',
        message: `发现 ${duplicates.length} 处重复代码`,
        file: filePath,
        suggestion: '提取公共函数或常量'
      })
    }
    
    // 硬编码检查
    const hardcodedValues = this.findHardcodedValues(code)
    if (hardcodedValues.length > 0) {
      issues.push({
        type: 'hardcoded_values',
        severity: 'info',
        message: `发现 ${hardcodedValues.length} 个硬编码值`,
        file: filePath,
        suggestion: '使用配置文件或常量定义'
      })
    }
    
    // 注释覆盖率检查
    const commentCoverage = this.calculateCommentCoverage(code)
    if (commentCoverage < 0.1) { // 10%
      issues.push({
        type: 'comment_coverage',
        severity: 'info',
        message: `注释覆盖率过低: ${(commentCoverage * 100).toFixed(1)}%`,
        file: filePath,
        suggestion: '添加必要的代码注释'
      })
    }
    
    return issues
  }

  // 检查可读性
  checkReadability(code, filePath) {
    const issues = []
    
    // 命名规范检查
    const namingIssues = this.checkNamingConventions(code)
    if (namingIssues.length > 0) {
      issues.push({
        type: 'naming_convention',
        severity: 'info',
        message: `发现 ${namingIssues.length} 个命名规范问题`,
        file: filePath,
        details: namingIssues,
        suggestion: '使用一致的命名规范'
      })
    }
    
    // 代码格式检查
    const formatIssues = this.checkCodeFormat(code)
    if (formatIssues.length > 0) {
      issues.push({
        type: 'code_format',
        severity: 'info',
        message: `发现 ${formatIssues.length} 个格式问题`,
        file: filePath,
        suggestion: '使用代码格式化工具'
      })
    }
    
    // 魔法数字检查
    const magicNumbers = this.findMagicNumbers(code)
    if (magicNumbers.length > 0) {
      issues.push({
        type: 'magic_numbers',
        severity: 'info',
        message: `发现 ${magicNumbers.length} 个魔法数字`,
        file: filePath,
        suggestion: '使用命名常量替代魔法数字'
      })
    }
    
    return issues
  }

  // 检查可测试性
  checkTestability(code, filePath) {
    const issues = []
    
    // 函数纯度检查
    const impureFunctions = this.findImpureFunctions(code)
    if (impureFunctions.length > 0) {
      issues.push({
        type: 'impure_functions',
        severity: 'info',
        message: `发现 ${impureFunctions.length} 个非纯函数`,
        file: filePath,
        suggestion: '尽量使用纯函数提高可测试性'
      })
    }
    
    // 依赖注入检查
    const hardDependencies = this.findHardDependencies(code)
    if (hardDependencies.length > 0) {
      issues.push({
        type: 'hard_dependencies',
        severity: 'info',
        message: `发现 ${hardDependencies.length} 个硬依赖`,
        file: filePath,
        suggestion: '使用依赖注入提高可测试性'
      })
    }
    
    return issues
  }

  // 计算圈复杂度
  calculateCyclomaticComplexity(code) {
    let complexity = 1 // 基础复杂度
    
    // 条件语句
    complexity += (code.match(/if\s*\(/g) || []).length
    complexity += (code.match(/else\s+if/g) || []).length
    complexity += (code.match(/switch\s*\(/g) || []).length
    complexity += (code.match(/case\s+/g) || []).length
    
    // 循环语句
    complexity += (code.match(/for\s*\(/g) || []).length
    complexity += (code.match(/while\s*\(/g) || []).length
    complexity += (code.match(/do\s*{/g) || []).length
    
    // 逻辑操作符
    complexity += (code.match(/&&/g) || []).length
    complexity += (code.match(/\|\|/g) || []).length
    
    // 异常处理
    complexity += (code.match(/catch\s*\(/g) || []).length
    
    return complexity
  }

  // 提取函数信息
  extractFunctions(code) {
    const functions = []
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g
    let match
    
    while ((match = functionRegex.exec(code)) !== null) {
      const [, name, body] = match
      functions.push({
        name,
        lines: body.split('\n').length,
        complexity: this.calculateCyclomaticComplexity(body)
      })
    }
    
    return functions
  }

  // 计算嵌套深度
  calculateNestingDepth(code) {
    let maxDepth = 0
    let currentDepth = 0
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      
      if (char === '{') {
        currentDepth++
        maxDepth = Math.max(maxDepth, currentDepth)
      } else if (char === '}') {
        currentDepth--
      }
    }
    
    return maxDepth
  }

  // 查找重复代码
  findDuplicateCode(code) {
    const lines = code.split('\n')
    const duplicates = []
    const lineMap = new Map()
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (trimmedLine.length > 10) { // 忽略太短的行
        if (lineMap.has(trimmedLine)) {
          duplicates.push({
            line: trimmedLine,
            occurrences: [lineMap.get(trimmedLine), index + 1]
          })
        } else {
          lineMap.set(trimmedLine, index + 1)
        }
      }
    })
    
    return duplicates
  }

  // 查找硬编码值
  findHardcodedValues(code) {
    const hardcoded = []
    
    // 查找字符串字面量
    const stringMatches = code.match(/'[^']{10,}'|"[^"]{10,}"/g) || []
    hardcoded.push(...stringMatches.map(match => ({
      type: 'string',
      value: match
    })))
    
    // 查找数字字面量（排除常见的小数字）
    const numberMatches = code.match(/\b\d{3,}\b/g) || []
    hardcoded.push(...numberMatches.map(match => ({
      type: 'number',
      value: match
    })))
    
    return hardcoded
  }

  // 计算注释覆盖率
  calculateCommentCoverage(code) {
    const lines = code.split('\n')
    const commentLines = lines.filter(line => {
      const trimmed = line.trim()
      return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.includes('*/')
    })
    
    return commentLines.length / lines.length
  }

  // 检查命名规范
  checkNamingConventions(code) {
    const issues = []
    
    // 检查变量命名（应使用驼峰命名）
    const variableMatches = code.match(/(?:var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || []
    variableMatches.forEach(match => {
      const varName = match.split(/\s+/)[1]
      if (!/^[a-z][a-zA-Z0-9]*$/.test(varName) && varName !== '_') {
        issues.push({
          type: 'variable_naming',
          name: varName,
          suggestion: '使用驼峰命名法'
        })
      }
    })
    
    // 检查函数命名
    const functionMatches = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || []
    functionMatches.forEach(match => {
      const funcName = match.split(/\s+/)[1]
      if (!/^[a-z][a-zA-Z0-9]*$/.test(funcName)) {
        issues.push({
          type: 'function_naming',
          name: funcName,
          suggestion: '函数名应使用驼峰命名法'
        })
      }
    })
    
    return issues
  }

  // 检查代码格式
  checkCodeFormat(code) {
    const issues = []
    const lines = code.split('\n')
    
    lines.forEach((line, index) => {
      // 检查行尾空格
      if (line.endsWith(' ') || line.endsWith('\t')) {
        issues.push({
          type: 'trailing_whitespace',
          line: index + 1,
          message: '行尾有多余空格'
        })
      }
      
      // 检查缩进一致性
      const match = line.match(/^(\s+)/)
      if (match) {
        const indent = match[1]
        if (indent.includes(' ') && indent.includes('\t')) {
          issues.push({
            type: 'mixed_indentation',
            line: index + 1,
            message: '混合使用空格和制表符缩进'
          })
        }
      }
    })
    
    return issues
  }

  // 查找魔法数字
  findMagicNumbers(code) {
    const magicNumbers = []
    const numberMatches = code.match(/\b\d+\b/g) || []
    
    numberMatches.forEach(match => {
      const num = parseInt(match)
      // 排除常见的数字 0, 1, -1, 100 等
      if (num > 1 && num !== 100 && num !== 1000) {
        magicNumbers.push({
          value: match,
          suggestion: `定义常量 const ${this.generateConstantName(match)} = ${match}`
        })
      }
    })
    
    return magicNumbers
  }

  // 生成常量名
  generateConstantName(value) {
    // 简单的常量名生成逻辑
    return `CONSTANT_${value}`
  }

  // 查找非纯函数
  findImpureFunctions(code) {
    const impureFunctions = []
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g
    let match
    
    while ((match = functionRegex.exec(code)) !== null) {
      const [, name, body] = match
      
      // 检查是否有副作用
      const hasSideEffects = 
        body.includes('console.log') ||
        body.includes('wx.') ||
        body.includes('setData') ||
        body.includes('localStorage') ||
        body.includes('sessionStorage')
      
      if (hasSideEffects) {
        impureFunctions.push({
          name,
          reason: '函数包含副作用'
        })
      }
    }
    
    return impureFunctions
  }

  // 查找硬依赖
  findHardDependencies(code) {
    const hardDependencies = []
    
    // 检查直接的全局对象使用
    const globalUsages = [
      'wx.',
      'console.',
      'window.',
      'document.',
      'localStorage.',
      'sessionStorage.'
    ]
    
    globalUsages.forEach(usage => {
      if (code.includes(usage)) {
        hardDependencies.push({
          type: 'global_dependency',
          dependency: usage,
          suggestion: '考虑通过参数传入或依赖注入'
        })
      }
    })
    
    return hardDependencies
  }

  // 生成质量报告
  generateQualityReport(allIssues) {
    const issuesByType = {}
    const issuesBySeverity = { error: 0, warning: 0, info: 0 }
    
    allIssues.forEach(issue => {
      // 按类型分组
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = []
      }
      issuesByType[issue.type].push(issue)
      
      // 按严重程度统计
      issuesBySeverity[issue.severity]++
    })
    
    // 计算质量分数
    const qualityScore = this.calculateQualityScore(issuesBySeverity)
    
    return {
      summary: {
        totalIssues: allIssues.length,
        qualityScore,
        ...issuesBySeverity
      },
      issuesByType,
      recommendations: this.generateQualityRecommendations(issuesByType),
      generatedAt: new Date().toISOString()
    }
  }

  // 计算质量分数
  calculateQualityScore(issuesBySeverity) {
    let score = 100
    
    // 根据问题严重程度扣分
    score -= issuesBySeverity.error * 10
    score -= issuesBySeverity.warning * 5
    score -= issuesBySeverity.info * 1
    
    return Math.max(0, score)
  }

  // 生成质量改进建议
  generateQualityRecommendations(issuesByType) {
    const recommendations = []
    
    Object.keys(issuesByType).forEach(type => {
      const issues = issuesByType[type]
      const count = issues.length
      
      switch (type) {
        case 'complexity':
          recommendations.push({
            priority: 'high',
            title: '降低代码复杂度',
            description: `发现 ${count} 个复杂度问题，建议拆分复杂函数`
          })
          break
        case 'duplicate_code':
          recommendations.push({
            priority: 'medium',
            title: '消除重复代码',
            description: `发现 ${count} 处重复代码，建议提取公共函数`
          })
          break
        case 'naming_convention':
          recommendations.push({
            priority: 'low',
            title: '统一命名规范',
            description: `发现 ${count} 个命名问题，建议使用一致的命名规范`
          })
          break
        default:
          recommendations.push({
            priority: 'medium',
            title: `修复 ${type} 问题`,
            description: `发现 ${count} 个相关问题`
          })
      }
    })
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
}

module.exports = new CodeQualityChecker()
```

## 📝 审核流程

### 审核工作流

```javascript
// utils/reviewWorkflow.js
class ReviewWorkflow {
  constructor() {
    this.reviewStages = [
      { name: '自动检查', handler: this.runAutomatedChecks },
      { name: '代码审查', handler: this.runCodeReview },
      { name: '功能测试', handler: this.runFunctionalTests },
      { name: '性能测试', handler: this.runPerformanceTests },
      { name: '安全检查', handler: this.runSecurityChecks },
      { name: '最终审核', handler: this.runFinalReview }
    ]
    
    this.reviewResults = new Map()
  }

  // 执行完整审核流程
  async executeFullReview(projectPath, options = {}) {
    const {
      skipStages = [],
      parallel = false,
      reportFormat = 'json'
    } = options

    console.log('开始执行审核流程...')
    
    const results = []
    const startTime = Date.now()

    try {
      if (parallel) {
        // 并行执行（适用于独立的检查）
        const promises = this.reviewStages
          .filter(stage => !skipStages.includes(stage.name))
          .map(stage => this.executeStage(stage, projectPath))
        
        const stageResults = await Promise.allSettled(promises)
        results.push(...stageResults.map((result, index) => ({
          stage: this.reviewStages[index].name,
          status: result.status,
          data: result.status === 'fulfilled' ? result.value : null,
          error: result.status === 'rejected' ? result.reason : null
        })))
      } else {
        // 串行执行（默认）
        for (const stage of this.reviewStages) {
          if (skipStages.includes(stage.name)) {
            continue
          }

          try {
            console.log(`执行阶段: ${stage.name}`)
            const stageResult = await this.executeStage(stage, projectPath)
            
            results.push({
              stage: stage.name,
              status: 'completed',
              data: stageResult,
              duration: Date.now() - startTime
            })

            // 如果发现严重问题，可以选择提前终止
            if (stageResult.criticalIssues && stageResult.criticalIssues.length > 0) {
              console.warn(`阶段 ${stage.name} 发现严重问题，考虑终止审核`)
              
              if (options.stopOnCritical) {
                break
              }
            }
          } catch (error) {
            console.error(`阶段 ${stage.name} 执行失败:`, error)
            results.push({
              stage: stage.name,
              status: 'failed',
              error: error.message,
              duration: Date.now() - startTime
            })
            
            if (options.stopOnError) {
              break
            }
          }
        }
      }

      const totalDuration = Date.now() - startTime
      const finalReport = this.generateFinalReport(results, totalDuration)

      // 保存审核结果
      await this.saveReviewResults(finalReport, reportFormat)

      console.log(`审核流程完成，耗时 ${totalDuration}ms`)
      return finalReport

    } catch (error) {
      console.error('审核流程执行失败:', error)
      throw error
    }
  }

  // 执行单个阶段
  async executeStage(stage, projectPath) {
    const stageStartTime = Date.now()
    
    try {
      const result = await stage.handler.call(this, projectPath)
      const duration = Date.now() - stageStartTime
      
      return {
        ...result,
        duration,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error(`阶段 ${stage.name} 执行出错:`, error)
      throw error
    }
  }

  // 自动检查阶段
  async runAutomatedChecks(projectPath) {
    const preSubmitChecker = require('./preSubmitChecker')
    const result = await preSubmitChecker.runFullCheck(projectPath)
    
    return {
      type: 'automated_checks',
      passed: result.summary.passed,
      issues: result.results.flatMap(r => r.issues || []),
      criticalIssues: result.results
        .flatMap(r => r.issues || [])
        .filter(issue => issue.severity === 'error')
    }
  }

  // 代码审查阶段
  async runCodeReview(projectPath) {
    const codeQualityChecker = require('./codeQualityChecker')
    const files = await this.getSourceFiles(projectPath)
    
    const allIssues = []
    
    for (const file of files) {
      const content = await this.readFile(file)
      
      const complexityIssues = codeQualityChecker.checkComplexity(content, file)
      const maintainabilityIssues = codeQualityChecker.checkMaintainability(content, file)
      const readabilityIssues = codeQualityChecker.checkReadability(content, file)
      const testabilityIssues = codeQualityChecker.checkTestability(content, file)
      
      allIssues.push(
        ...complexityIssues,
        ...maintainabilityIssues,
        ...readabilityIssues,
        ...testabilityIssues
      )
    }
    
    const qualityReport = codeQualityChecker.generateQualityReport(allIssues)
    
    return {
      type: 'code_review',
      qualityScore: qualityReport.summary.qualityScore,
      issues: allIssues,
      recommendations: qualityReport.recommendations,
      criticalIssues: allIssues.filter(issue => issue.severity === 'error')
    }
  }

  // 功能测试阶段
  async runFunctionalTests(projectPath) {
    // 这里可以集成自动化测试框架
    const testResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testCoverage: 0
    }
    
    // 模拟测试执行
    try {
      // 执行单元测试
      const unitTestResults = await this.runUnitTests(projectPath)
      
      // 执行集成测试
      const integrationTestResults = await this.runIntegrationTests(projectPath)
      
      testResults.totalTests = unitTestResults.total + integrationTestResults.total
      testResults.passedTests = unitTestResults.passed + integrationTestResults.passed
      testResults.failedTests = unitTestResults.failed + integrationTestResults.failed
      testResults.testCoverage = (unitTestResults.coverage + integrationTestResults.coverage) / 2
      
    } catch (error) {
      console.error('功能测试执行失败:', error)
    }
    
    return {
      type: 'functional_tests',
      passed: testResults.failedTests === 0,
      results: testResults,
      criticalIssues: testResults.failedTests > 0 ? [
        {
          type: 'test_failure',
          message: `${testResults.failedTests} 个测试失败`,
          severity: 'error'
        }
      ] : []
    }
  }

  // 性能测试阶段
  async runPerformanceTests(projectPath) {
    const performanceTester = require('./performanceTester')
    
    const testSuites = [
      {
        name: 'page_load_performance',
        fn: () => this.testPageLoadPerformance(projectPath)
      },
      {
        name: 'api_response_performance',
        fn: () => this.testApiResponsePerformance(projectPath)
      },
      {
        name: 'memory_usage',
        fn: () => this.testMemoryUsage(projectPath)
      }
    ]
    
    const results = await performanceTester.runBatchTests(testSuites)
    const performanceReport = performanceTester.generateReport()
    
    // 检查性能指标是否达标
    const performanceIssues = []
    results.forEach(result => {
      if (result.average > 3000) { // 3秒阈值
        performanceIssues.push({
          type: 'performance_issue',
          test: result.name,
          message: `性能测试 ${result.name} 平均耗时 ${result.average}ms，超过阈值`,
          severity: 'warning'
        })
      }
    })
    
    return {
      type: 'performance_tests',
      passed: performanceIssues.length === 0,
      results: performanceReport,
      issues: performanceIssues,
      criticalIssues: performanceIssues.filter(issue => issue.severity === 'error')
    }
  }

  // 安全检查阶段
  async runSecurityChecks(projectPath) {
    const securityIssues = []
    
    // 检查敏感信息泄露
    const sensitiveDataIssues = await this.checkSensitiveData(projectPath)
    securityIssues.push(...sensitiveDataIssues)
    
    // 检查权限使用
    const permissionIssues = await this.checkPermissionUsage(projectPath)
    securityIssues.push(...permissionIssues)
    
    // 检查网络安全
    const networkSecurityIssues = await this.checkNetworkSecurity(projectPath)
    securityIssues.push(...networkSecurityIssues)
    
    return {
      type: 'security_checks',
      passed: securityIssues.filter(issue => issue.severity === 'error').length === 0,
      issues: securityIssues,
      criticalIssues: securityIssues.filter(issue => issue.severity === 'error')
    }
  }

  // 最终审核阶段
  async runFinalReview(projectPath) {
    // 汇总所有阶段的结果
    const allResults = Array.from(this.reviewResults.values())
    
    const totalIssues = allResults.reduce((sum, result) => 
      sum + (result.issues ? result.issues.length : 0), 0)
    
    const criticalIssues = allResults.reduce((sum, result) => 
      sum + (result.criticalIssues ? result.criticalIssues.length : 0), 0)
    
    const overallPassed = criticalIssues === 0
    
    // 生成最终建议
    const finalRecommendations = this.generateFinalRecommendations(allResults)
    
    return {
      type: 'final_review',
      passed: overallPassed,
      summary: {
        totalIssues,
        criticalIssues,
        overallScore: this.calculateOverallScore(allResults)
      },
      recommendations: finalRecommendations,
      readyForSubmission: overallPassed && totalIssues < 10 // 示例标准
    }
  }

  // 生成最终报告
  generateFinalReport(results, totalDuration) {
    const summary = {
      totalStages: results.length,
      completedStages: results.filter(r => r.status === 'completed').length,
      failedStages: results.filter(r => r.status === 'failed').length,
      totalDuration,
      timestamp: new Date().toISOString()
    }
    
    const allIssues = results
      .filter(r => r.data && r.data.issues)
      .flatMap(r => r.data.issues)
    
    const criticalIssues = results
      .filter(r => r.data && r.data.criticalIssues)
      .flatMap(r => r.data.criticalIssues)
    
    const overallPassed = criticalIssues.length === 0
    const overallScore = this.calculateOverallScore(results.map(r => r.data).filter(Boolean))
    
    return {
      summary: {
        ...summary,
        overallPassed,
        overallScore,
        totalIssues: allIssues.length,
        criticalIssues: criticalIssues.length
      },
      stageResults: results,
      issues: allIssues,
      criticalIssues,
      recommendations: this.generateFinalRecommendations(results.map(r => r.data).filter(Boolean)),
      conclusion: this.generateConclusion(overallPassed, overallScore, criticalIssues.length)
    }
  }

  // 计算总体分数
  calculateOverallScore(results) {
    const scores = results
      .map(result => result.qualityScore || result.score || 0)
      .filter(score => score > 0)
    
    if (scores.length === 0) return 0
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  // 生成最终建议
  generateFinalRecommendations(results) {
    const allRecommendations = results
      .filter(result => result.recommendations)
      .flatMap(result => result.recommendations)
    
    // 去重并按优先级排序
    const uniqueRecommendations = allRecommendations.reduce((unique, rec) => {
      if (!unique.find(u => u.title === rec.title)) {
        unique.push(rec)
      }
      return unique
    }, [])
    
    return uniqueRecommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    })
  }

  // 生成结论
  generateConclusion(passed, score, criticalIssues) {
    if (criticalIssues > 0) {
      return {
        status: 'rejected',
        message: `发现 ${criticalIssues} 个严重问题，需要修复后重新提交`,
        nextSteps: ['修复所有严重问题', '重新运行审核流程', '确保所有测试通过']
      }
    } else if (score >= 80) {
      return {
        status: 'approved',
        message: '代码质量良好，可以提交审核',
        nextSteps: ['准备提交材料', '填写版本说明', '提交审核']
      }
    } else {
      return {
        status: 'conditional',
        message: '代码质量一般，建议优化后提交',
        nextSteps: ['处理主要问题', '提升代码质量', '重新评估后提交']
      }
    }
  }

  // 保存审核结果
  async saveReviewResults(report, format = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `review-report-${timestamp}.${format}`
    
    try {
      if (format === 'json') {
        await this.writeFile(filename, JSON.stringify(report, null, 2))
      } else if (format === 'html') {
        const htmlReport = this.generateHtmlReport(report)
        await this.writeFile(filename, htmlReport)
      }
      
      console.log(`审核报告已保存: ${filename}`)
    } catch (error) {
      console.error('保存审核报告失败:', error)
    }
  }

  // 生成 HTML 报告
  generateHtmlReport(report) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>代码审核报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .passed { color: green; }
        .failed { color: red; }
        .warning { color: orange; }
        .issue { margin: 10px 0; padding: 10px; border-left: 3px solid #ccc; }
        .critical { border-left-color: red; }
        .recommendation { background: #e8f4fd; padding: 10px; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>代码审核报告</h1>
    
    <div class="summary">
        <h2>审核摘要</h2>
        <p>总体状态: <span class="${report.summary.overallPassed ? 'passed' : 'failed'}">
            ${report.summary.overallPassed ? '通过' : '未通过'}
        </span></p>
        <p>总体评分: ${report.summary.overallScore}/100</p>
        <p>总问题数: ${report.summary.totalIssues}</p>
        <p>严重问题: ${report.summary.criticalIssues}</p>
        <p>审核耗时: ${report.summary.totalDuration}ms</p>
    </div>
    
    <h2>审核阶段结果</h2>
    ${report.stageResults.map(stage => `
        <div class="stage">
            <h3>${stage.stage}</h3>
            <p>状态: <span class="${stage.status === 'completed' ? 'passed' : 'failed'}">
                ${stage.status === 'completed' ? '完成' : '失败'}
            </span></p>
            ${stage.error ? `<p class="failed">错误: ${stage.error}</p>` : ''}
        </div>
    `).join('')}
    
    ${report.criticalIssues.length > 0 ? `
        <h2>严重问题</h2>
        ${report.criticalIssues.map(issue => `
            <div class="issue critical">
                <strong>${issue.type || '未知类型'}</strong>: ${issue.message}
                ${issue.file ? `<br>文件: ${issue.file}` : ''}
            </div>
        `).join('')}
    ` : ''}
    
    <h2>改进建议</h2>
    ${report.recommendations.map(rec => `
        <div class="recommendation">
            <strong>${rec.title}</strong> (${rec.priority})<br>
            ${rec.description}
        </div>
    `).join('')}
    
    <h2>结论</h2>
    <div class="conclusion">
        <p><strong>状态:</strong> ${report.conclusion.status}</p>
        <p><strong>说明:</strong> ${report.conclusion.message}</p>
        <p><strong>下一步:</strong></p>
        <ul>
            ${report.conclusion.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>
    </div>
    
    <footer>
        <p>报告生成时间: ${report.summary.timestamp}</p>
    </footer>
</body>
</html>
    `
  }

  // 辅助方法
  async getSourceFiles(projectPath) {
    // 实现获取源文件列表的逻辑
    return []
  }

  async readFile(filePath) {
    // 实现读取文件的逻辑
    return ''
  }

  async writeFile(filename, content) {
    // 实现写入文件的逻辑
  }

  async runUnitTests(projectPath) {
    // 实现单元测试的逻辑
    return { total: 0, passed: 0, failed: 0, coverage: 0 }
  }

  async runIntegrationTests(projectPath) {
    // 实现集成测试的逻辑
    return { total: 0, passed: 0, failed: 0, coverage: 0 }
  }

  async testPageLoadPerformance(projectPath) {
    // 实现页面加载性能测试
    return Promise.resolve()
  }

  async testApiResponsePerformance(projectPath) {
    // 实现API响应性能测试
    return Promise.resolve()
  }

  async testMemoryUsage(projectPath) {
    // 实现内存使用测试
    return Promise.resolve()
  }

  async checkSensitiveData(projectPath) {
    // 实现敏感数据检查
    return []
  }

  async checkPermissionUsage(projectPath) {
    // 实现权限使用检查
    return []
  }

  async checkNetworkSecurity(projectPath) {
    // 实现网络安全检查
    return []
  }
}

module.exports = new ReviewWorkflow()
```

## 📚 相关文档

- [版本管理](./version-control.md)
- [发布流程](./deployment.md)
- [性能优化](./performance.md)
- [项目结构](./project-structure.md)

---

通过系统的代码审核流程，确保小程序代码质量和稳定性！🚀
