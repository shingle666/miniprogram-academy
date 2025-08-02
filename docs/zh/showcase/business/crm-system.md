# CRM客户管理系统

一个专为中小企业设计的客户关系管理小程序，集成客户信息管理、销售跟进、数据分析等功能，帮助企业提升销售效率。

## 📱 项目概览

### 项目信息
- **项目名称**: CRM客户管理系统
- **开发周期**: 5个月
- **团队规模**: 10人
- **技术栈**: Taro + React + TypeScript + Spring Boot
- **用户规模**: 5000+ 企业用户，50万+ 客户数据
- **行业覆盖**: 零售、服务业、制造业、房地产等

### 核心功能
- 👥 客户信息全生命周期管理
- 📞 销售跟进与任务管理
- 📊 销售数据分析与报表
- 🎯 营销活动管理
- 📱 移动端随时随地办公
- 🔄 多系统数据同步

## 🎯 项目亮点

### 1. 智能客户画像系统
基于客户行为数据，自动生成客户画像和标签。

**技术实现**:
```typescript
// utils/customerProfile.ts
interface CustomerData {
  id: string
  name: string
  phone: string
  email: string
  company: string
  industry: string
  position: string
  source: string
  createTime: Date
  lastContactTime: Date
  purchaseHistory: Purchase[]
  behaviorData: BehaviorRecord[]
  tags: string[]
}

interface BehaviorRecord {
  type: 'visit' | 'call' | 'email' | 'meeting' | 'purchase'
  timestamp: Date
  details: any
  value: number
}

interface CustomerProfile {
  customerId: string
  rfmScore: {
    recency: number    // 最近购买时间
    frequency: number  // 购买频率
    monetary: number   // 购买金额
  }
  lifecycle: 'prospect' | 'new' | 'active' | 'loyal' | 'at_risk' | 'lost'
  preferences: string[]
  predictedValue: number
  churnRisk: number
  recommendedActions: string[]
}

class CustomerProfileAnalyzer {
  // 计算RFM分数
  calculateRFMScore(customer: CustomerData): CustomerProfile['rfmScore'] {
    const now = new Date()
    const purchases = customer.purchaseHistory
    
    if (purchases.length === 0) {
      return { recency: 0, frequency: 0, monetary: 0 }
    }

    // 计算最近购买时间分数 (1-5分)
    const lastPurchase = Math.max(...purchases.map(p => p.date.getTime()))
    const daysSinceLastPurchase = (now.getTime() - lastPurchase) / (1000 * 60 * 60 * 24)
    const recency = Math.max(1, Math.min(5, 6 - Math.floor(daysSinceLastPurchase / 30)))

    // 计算购买频率分数 (1-5分)
    const frequency = Math.min(5, Math.max(1, Math.floor(purchases.length / 2) + 1))

    // 计算购买金额分数 (1-5分)
    const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0)
    const monetary = Math.min(5, Math.max(1, Math.floor(totalAmount / 1000) + 1))

    return { recency, frequency, monetary }
  }

  // 分析客户生命周期阶段
  analyzeLifecycle(customer: CustomerData, rfmScore: CustomerProfile['rfmScore']): CustomerProfile['lifecycle'] {
    const { recency, frequency, monetary } = rfmScore
    const daysSinceLastContact = (new Date().getTime() - customer.lastContactTime.getTime()) / (1000 * 60 * 60 * 24)

    // 新客户
    if (customer.purchaseHistory.length === 0 && daysSinceLastContact <= 30) {
      return 'prospect'
    }

    // 首次购买客户
    if (customer.purchaseHistory.length === 1 && daysSinceLastContact <= 60) {
      return 'new'
    }

    // 活跃客户
    if (recency >= 4 && frequency >= 3) {
      return 'active'
    }

    // 忠诚客户
    if (recency >= 4 && frequency >= 4 && monetary >= 4) {
      return 'loyal'
    }

    // 流失风险客户
    if (recency <= 2 && frequency >= 2) {
      return 'at_risk'
    }

    // 已流失客户
    if (recency <= 1 && daysSinceLastContact > 180) {
      return 'lost'
    }

    return 'active'
  }

  // 预测客户价值
  predictCustomerValue(customer: CustomerData): number {
    const purchases = customer.purchaseHistory
    if (purchases.length === 0) return 0

    // 计算平均订单价值
    const avgOrderValue = purchases.reduce((sum, p) => sum + p.amount, 0) / purchases.length

    // 计算购买频率（每月）
    const firstPurchase = Math.min(...purchases.map(p => p.date.getTime()))
    const monthsSinceFirst = (Date.now() - firstPurchase) / (1000 * 60 * 60 * 24 * 30)
    const purchaseFrequency = purchases.length / Math.max(1, monthsSinceFirst)

    // 预测未来12个月价值
    return avgOrderValue * purchaseFrequency * 12
  }

  // 计算流失风险
  calculateChurnRisk(customer: CustomerData): number {
    const daysSinceLastContact = (Date.now() - customer.lastContactTime.getTime()) / (1000 * 60 * 60 * 24)
    const daysSinceLastPurchase = customer.purchaseHistory.length > 0 
      ? (Date.now() - Math.max(...customer.purchaseHistory.map(p => p.date.getTime()))) / (1000 * 60 * 60 * 24)
      : 365

    // 基于时间的流失风险
    let riskScore = 0
    
    if (daysSinceLastContact > 90) riskScore += 0.3
    if (daysSinceLastContact > 180) riskScore += 0.3
    if (daysSinceLastPurchase > 180) riskScore += 0.4

    return Math.min(1, riskScore)
  }

  // 生成推荐行动
  generateRecommendedActions(profile: CustomerProfile, customer: CustomerData): string[] {
    const actions: string[] = []

    switch (profile.lifecycle) {
      case 'prospect':
        actions.push('安排产品演示', '发送欢迎邮件', '电话跟进需求')
        break
      case 'new':
        actions.push('客户满意度调研', '推荐相关产品', '建立定期联系')
        break
      case 'active':
        actions.push('推荐升级服务', '邀请参加活动', '收集反馈意见')
        break
      case 'loyal':
        actions.push('VIP专属服务', '推荐给朋友奖励', '新产品优先体验')
        break
      case 'at_risk':
        actions.push('紧急联系挽回', '提供特别优惠', '了解不满原因')
        break
      case 'lost':
        actions.push('重新激活营销', '问卷调研流失原因', '特价回归活动')
        break
    }

    // 基于流失风险添加行动
    if (profile.churnRisk > 0.7) {
      actions.push('高优先级跟进', '客户关怀电话')
    }

    return actions
  }

  // 生成完整的客户画像
  generateProfile(customer: CustomerData): CustomerProfile {
    const rfmScore = this.calculateRFMScore(customer)
    const lifecycle = this.analyzeLifecycle(customer, rfmScore)
    const predictedValue = this.predictCustomerValue(customer)
    const churnRisk = this.calculateChurnRisk(customer)
    
    const profile: CustomerProfile = {
      customerId: customer.id,
      rfmScore,
      lifecycle,
      preferences: this.analyzePreferences(customer),
      predictedValue,
      churnRisk,
      recommendedActions: []
    }

    profile.recommendedActions = this.generateRecommendedActions(profile, customer)

    return profile
  }

  private analyzePreferences(customer: CustomerData): string[] {
    const preferences: string[] = []
    
    // 基于购买历史分析偏好
    const productCategories = customer.purchaseHistory.map(p => p.category)
    const categoryCount = productCategories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // 找出购买最多的产品类别
    const sortedCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    preferences.push(...sortedCategories)

    // 基于行为数据分析偏好
    const behaviorTypes = customer.behaviorData.map(b => b.type)
    if (behaviorTypes.includes('email')) preferences.push('邮件沟通')
    if (behaviorTypes.includes('call')) preferences.push('电话沟通')
    if (behaviorTypes.includes('meeting')) preferences.push('面对面会议')

    return preferences
  }
}

export default new CustomerProfileAnalyzer()
```

### 2. 销售漏斗管理
可视化销售流程，跟踪每个阶段的转化率。

**组件实现**:
```tsx
// components/SalesFunnel/SalesFunnel.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './SalesFunnel.scss'

interface FunnelStage {
  id: string
  name: string
  color: string
  customers: Customer[]
  conversionRate: number
  avgDealSize: number
  avgCycleTime: number
}

interface Customer {
  id: string
  name: string
  company: string
  dealValue: number
  probability: number
  lastActivity: Date
  assignedTo: string
  tags: string[]
}

const SalesFunnel: React.FC = () => {
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([])
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [draggedCustomer, setDraggedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultStages: Omit<FunnelStage, 'customers' | 'conversionRate' | 'avgDealSize' | 'avgCycleTime'>[] = [
    { id: 'lead', name: '潜在客户', color: '#e6f7ff' },
    { id: 'qualified', name: '合格线索', color: '#bae7ff' },
    { id: 'proposal', name: '方案阶段', color: '#91d5ff' },
    { id: 'negotiation', name: '商务谈判', color: '#69c0ff' },
    { id: 'closed_won', name: '成交', color: '#40a9ff' },
    { id: 'closed_lost', name: '失败', color: '#ff7875' }
  ]

  useEffect(() => {
    loadFunnelData()
  }, [])

  const loadFunnelData = async () => {
    setLoading(true)
    try {
      const response = await Taro.request({
        url: '/api/sales/funnel',
        method: 'GET'
      })

      const data = response.data
      const stages = defaultStages.map(stage => ({
        ...stage,
        customers: data.customers.filter((c: Customer) => c.stage === stage.id) || [],
        conversionRate: data.conversionRates[stage.id] || 0,
        avgDealSize: data.avgDealSizes[stage.id] || 0,
        avgCycleTime: data.avgCycleTimes[stage.id] || 0
      }))

      setFunnelStages(stages)
    } catch (error) {
      console.error('加载销售漏斗数据失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStageClick = (stageId: string) => {
    setSelectedStage(selectedStage === stageId ? null : stageId)
  }

  const handleCustomerDragStart = (customer: Customer) => {
    setDraggedCustomer(customer)
  }

  const handleCustomerDrop = async (targetStageId: string) => {
    if (!draggedCustomer) return

    try {
      await Taro.request({
        url: `/api/customers/${draggedCustomer.id}/stage`,
        method: 'PUT',
        data: { stage: targetStageId }
      })

      // 更新本地状态
      setFunnelStages(prevStages => 
        prevStages.map(stage => ({
          ...stage,
          customers: stage.id === targetStageId
            ? [...stage.customers, draggedCustomer]
            : stage.customers.filter(c => c.id !== draggedCustomer.id)
        }))
      )

      Taro.showToast({
        title: '更新成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('更新客户阶段失败:', error)
      Taro.showToast({
        title: '更新失败',
        icon: 'error'
      })
    } finally {
      setDraggedCustomer(null)
    }
  }

  const calculateTotalValue = (customers: Customer[]): number => {
    return customers.reduce((sum, customer) => sum + customer.dealValue, 0)
  }

  const formatCurrency = (amount: number): string => {
    return `¥${(amount / 10000).toFixed(1)}万`
  }

  const formatDays = (days: number): string => {
    return `${days}天`
  }

  const getCustomersByStage = (stageId: string): Customer[] => {
    const stage = funnelStages.find(s => s.id === stageId)
    return stage?.customers || []
  }

  return (
    <View className="sales-funnel">
      <View className="funnel-header">
        <Text className="title">销售漏斗</Text>
        <View className="funnel-stats">
          <View className="stat-item">
            <Text className="stat-value">
              {funnelStages.reduce((sum, stage) => sum + stage.customers.length, 0)}
            </Text>
            <Text className="stat-label">总客户数</Text>
          </View>
          <View className="stat-item">
            <Text className="stat-value">
              {formatCurrency(funnelStages.reduce((sum, stage) => sum + calculateTotalValue(stage.customers), 0))}
            </Text>
            <Text className="stat-label">总金额</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollX className="funnel-container">
        {funnelStages.map((stage, index) => (
          <View key={stage.id} className="funnel-stage">
            <View 
              className="stage-header"
              style={{ backgroundColor: stage.color }}
              onClick={() => handleStageClick(stage.id)}
            >
              <Text className="stage-name">{stage.name}</Text>
              <Text className="stage-count">{stage.customers.length}</Text>
            </View>

            <View className="stage-stats">
              <View className="stat-row">
                <Text className="stat-label">转化率:</Text>
                <Text className="stat-value">{(stage.conversionRate * 100).toFixed(1)}%</Text>
              </View>
              <View className="stat-row">
                <Text className="stat-label">平均金额:</Text>
                <Text className="stat-value">{formatCurrency(stage.avgDealSize)}</Text>
              </View>
              <View className="stat-row">
                <Text className="stat-label">平均周期:</Text>
                <Text className="stat-value">{formatDays(stage.avgCycleTime)}</Text>
              </View>
            </View>

            <View className="stage-total">
              <Text className="total-label">总金额:</Text>
              <Text className="total-value">
                {formatCurrency(calculateTotalValue(stage.customers))}
              </Text>
            </View>

            {/* 客户列表 */}
            <ScrollView 
              scrollY 
              className="customers-list"
              onDrop={() => handleCustomerDrop(stage.id)}
            >
              {stage.customers.map(customer => (
                <View 
                  key={customer.id}
                  className="customer-card"
                  onTouchStart={() => handleCustomerDragStart(customer)}
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/customer/detail?id=${customer.id}`
                    })
                  }}
                >
                  <View className="customer-info">
                    <Text className="customer-name">{customer.name}</Text>
                    <Text className="customer-company">{customer.company}</Text>
                  </View>
                  
                  <View className="customer-details">
                    <Text className="deal-value">
                      {formatCurrency(customer.dealValue)}
                    </Text>
                    <Text className="probability">
                      {(customer.probability * 100).toFixed(0)}%
                    </Text>
                  </View>

                  <View className="customer-tags">
                    {customer.tags.slice(0, 2).map(tag => (
                      <Text key={tag} className="tag">{tag}</Text>
                    ))}
                  </View>

                  <View className="customer-meta">
                    <Text className="assigned-to">负责人: {customer.assignedTo}</Text>
                    <Text className="last-activity">
                      {new Date(customer.lastActivity).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* 阶段间的转化箭头 */}
            {index < funnelStages.length - 2 && (
              <View className="conversion-arrow">
                <Text className="arrow-icon">→</Text>
                <Text className="conversion-rate">
                  {(stage.conversionRate * 100).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 详细视图 */}
      {selectedStage && (
        <View className="stage-detail-modal">
          <View className="modal-content">
            <View className="modal-header">
              <Text className="modal-title">
                {funnelStages.find(s => s.id === selectedStage)?.name}详情
              </Text>
              <Text 
                className="close-btn"
                onClick={() => setSelectedStage(null)}
              >
                ✕
              </Text>
            </View>

            <ScrollView scrollY className="modal-body">
              {getCustomersByStage(selectedStage).map(customer => (
                <View key={customer.id} className="detail-customer-card">
                  <View className="customer-header">
                    <Text className="name">{customer.name}</Text>
                    <Text className="company">{customer.company}</Text>
                  </View>
                  
                  <View className="customer-metrics">
                    <View className="metric">
                      <Text className="metric-label">预期金额</Text>
                      <Text className="metric-value">
                        {formatCurrency(customer.dealValue)}
                      </Text>
                    </View>
                    <View className="metric">
                      <Text className="metric-label">成交概率</Text>
                      <Text className="metric-value">
                        {(customer.probability * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>

                  <View className="customer-actions">
                    <Text 
                      className="action-btn"
                      onClick={() => {
                        Taro.makePhoneCall({
                          phoneNumber: customer.phone
                        })
                      }}
                    >
                      📞 拨打电话
                    </Text>
                    <Text 
                      className="action-btn"
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/customer/edit?id=${customer.id}`
                        })
                      }}
                    >
                      ✏️ 编辑信息
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  )
}

export default SalesFunnel
```

### 3. 数据报表分析
多维度的销售数据分析和可视化报表。

## 📊 业务成果

### 关键指标
- **客户管理效率提升**: 40%
- **销售转化率提升**: 25%
- **客户满意度**: 4.6/5.0
- **系统使用率**: 95%

### 用户反馈
- "界面简洁易用，功能很实用"
- "移动端操作很方便，随时可以查看客户信息"
- "数据分析功能帮助我们更好地了解客户"
- "自动化的跟进提醒大大提高了工作效率"

## 🛠️ 技术架构

### 系统架构
```
移动端小程序 (Taro + React)
    ↓
API网关 (Spring Cloud Gateway)
    ↓
微服务集群
    ├── 用户服务
    ├── 客户服务
    ├── 销售服务
    ├── 分析服务
    └── 通知服务
    ↓
数据存储
    ├── MySQL (业务数据)
    ├── Redis (缓存)
    ├── Elasticsearch (搜索)
    └── ClickHouse (数据分析)
```

### 数据库设计
```sql
-- 客户表
CREATE TABLE customers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  company VARCHAR(200),
  industry VARCHAR(50),
  source VARCHAR(50),
  stage VARCHAR(20) DEFAULT 'lead',
  assigned_to VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_stage (stage),
  INDEX idx_created_at (created_at)
);

-- 销售机会表
CREATE TABLE opportunities (
  id VARCHAR(32) PRIMARY KEY,
  customer_id VARCHAR(32) NOT NULL,
  name VARCHAR(200) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0,
  probability DECIMAL(3,2) DEFAULT 0,
  stage VARCHAR(20) DEFAULT 'prospecting',
  expected_close_date DATE,
  assigned_to VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_stage (stage)
);

-- 活动记录表
CREATE TABLE activities (
  id VARCHAR(32) PRIMARY KEY,
  customer_id VARCHAR(32) NOT NULL,
  opportunity_id VARCHAR(32),
  type VARCHAR(20) NOT NULL,
  subject VARCHAR(200),
  description TEXT,
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  assigned_to VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id),
  INDEX idx_customer_id (customer_id),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_scheduled_at (scheduled_at)
);
```

## 🚀 项目总结

### 技术亮点
1. **智能客户画像** - 基于RFM模型的客户分析
2. **可视化销售漏斗** - 直观的销售流程管理
3. **移动优先设计** - 适配各种移动设备
4. **实时数据同步** - 多端数据实时更新

### 业务价值
1. **提升销售效率** - 自动化跟进和提醒
2. **优化客户体验** - 个性化服务和沟通
3. **数据驱动决策** - 详细的分析报表
4. **降低管理成本** - 减少人工统计工作

### 经验总结
1. **用户体验至上** - 简化操作流程，提高易用性
2. **数据质量重要** - 确保数据的准确性和完整性
3. **移动端优化** - 针对移动设备的特殊优化
4. **持续迭代改进** - 根据用户反馈不断优化功能

---

*这个CRM系统成功地帮助中小企业实现了客户关系的数字化管理，通过智能化的功能和友好的用户界面，显著提升了销售团队的工作效率和客户满意度。*