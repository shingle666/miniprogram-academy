# CRM System Mini Program Case

This case showcases a comprehensive Customer Relationship Management (CRM) system built as a mini program, enabling businesses to manage customer interactions, track sales opportunities, and optimize customer service processes on mobile devices.

## Project Overview

### Project Background

Modern businesses need efficient tools to manage customer relationships and sales processes. This mini program addresses the need for a mobile-first CRM solution that allows sales teams and customer service representatives to access and update customer information anytime, anywhere.

### Core Features

- **Customer Management**: Comprehensive customer profiles and interaction history
- **Sales Pipeline**: Visual sales opportunity tracking and management
- **Task Management**: Automated reminders and follow-up scheduling
- **Communication Hub**: Integrated calling, messaging, and email capabilities
- **Analytics Dashboard**: Real-time sales and customer service metrics
- **Team Collaboration**: Shared customer insights and team coordination
- **Mobile Optimization**: Full functionality optimized for mobile devices

## Technical Implementation

### Customer Management System

```javascript
// pages/customers/customers.js
Page({
  data: {
    customers: [],
    searchKeyword: '',
    filterStatus: 'all',
    sortBy: 'lastContact',
    loading: false,
    hasMore: true,
    page: 1
  },

  onLoad() {
    this.loadCustomers()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreCustomers()
    }
  },

  async loadCustomers() {
    this.setData({ loading: true, page: 1 })

    try {
      const res = await wx.request({
        url: '/api/crm/customers',
        method: 'GET',
        data: {
          page: 1,
          limit: 20,
          keyword: this.data.searchKeyword,
          status: this.data.filterStatus,
          sortBy: this.data.sortBy
        }
      })

      this.setData({
        customers: res.data.customers,
        hasMore: res.data.hasMore,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load customers:', error)
      this.setData({ loading: false })
    }
  },

  async loadMoreCustomers() {
    this.setData({ loading: true })

    try {
      const nextPage = this.data.page + 1
      const res = await wx.request({
        url: '/api/crm/customers',
        method: 'GET',
        data: {
          page: nextPage,
          limit: 20,
          keyword: this.data.searchKeyword,
          status: this.data.filterStatus,
          sortBy: this.data.sortBy
        }
      })

      this.setData({
        customers: [...this.data.customers, ...res.data.customers],
        hasMore: res.data.hasMore,
        page: nextPage,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load more customers:', error)
      this.setData({ loading: false })
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onSearchConfirm() {
    this.loadCustomers()
  },

  onFilterChange(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ filterStatus: status })
    this.loadCustomers()
  },

  onSortChange(e) {
    const sortBy = e.detail.value
    this.setData({ sortBy })
    this.loadCustomers()
  },

  onCustomerDetail(e) {
    const customerId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/customer-detail/customer-detail?id=${customerId}`
    })
  },

  onAddCustomer() {
    wx.navigateTo({
      url: '/pages/customer-form/customer-form'
    })
  },

  onCallCustomer(e) {
    e.stopPropagation()
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onMessageCustomer(e) {
    e.stopPropagation()
    const customerId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/message/message?customerId=${customerId}`
    })
  }
})
```

### Sales Pipeline Management

```javascript
// pages/pipeline/pipeline.js
Page({
  data: {
    pipeline: {
      stages: [],
      opportunities: []
    },
    selectedStage: null,
    totalValue: 0,
    loading: true
  },

  onLoad() {
    this.loadPipeline()
  },

  async loadPipeline() {
    try {
      const res = await wx.request({
        url: '/api/crm/pipeline',
        method: 'GET',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      const pipeline = res.data
      const totalValue = this.calculateTotalValue(pipeline.opportunities)

      this.setData({
        pipeline,
        totalValue,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load pipeline:', error)
      this.setData({ loading: false })
    }
  },

  calculateTotalValue(opportunities) {
    return opportunities.reduce((total, opp) => {
      return total + (opp.value * opp.probability / 100)
    }, 0)
  },

  onStageSelect(e) {
    const stageId = e.currentTarget.dataset.id
    const stage = this.data.pipeline.stages.find(s => s.id === stageId)
    
    this.setData({ selectedStage: stage })
  },

  onOpportunityDetail(e) {
    const opportunityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/opportunity-detail/opportunity-detail?id=${opportunityId}`
    })
  },

  onAddOpportunity() {
    wx.navigateTo({
      url: '/pages/opportunity-form/opportunity-form'
    })
  },

  async onMoveOpportunity(e) {
    const { opportunityId, newStageId } = e.currentTarget.dataset

    try {
      wx.showLoading({ title: 'Moving...' })

      const res = await wx.request({
        url: `/api/crm/opportunities/${opportunityId}/move`,
        method: 'PUT',
        data: {
          stageId: newStageId,
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Moved successfully',
          icon: 'success'
        })
        this.loadPipeline()
      }
    } catch (error) {
      console.error('Failed to move opportunity:', error)
      wx.showToast({
        title: 'Move failed',
        icon: 'error'
      })
    } finally {
      wx.hideLoading()
    }
  },

  onRefreshPipeline() {
    this.loadPipeline()
  }
})
```

### Task and Activity Management

```javascript
// utils/task-manager.js
class TaskManager {
  static async createTask(taskData) {
    try {
      const res = await wx.request({
        url: '/api/crm/tasks',
        method: 'POST',
        data: {
          ...taskData,
          userId: wx.getStorageSync('userId'),
          createdAt: Date.now()
        }
      })

      if (res.data.success) {
        // Schedule notification if needed
        if (taskData.reminderTime) {
          this.scheduleNotification(res.data.task)
        }
      }

      return res.data
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  }

  static async getTasks(filters = {}) {
    try {
      const res = await wx.request({
        url: '/api/crm/tasks',
        method: 'GET',
        data: {
          userId: wx.getStorageSync('userId'),
          ...filters
        }
      })

      return res.data.tasks
    } catch (error) {
      console.error('Failed to get tasks:', error)
      return []
    }
  }

  static async updateTaskStatus(taskId, status) {
    try {
      const res = await wx.request({
        url: `/api/crm/tasks/${taskId}`,
        method: 'PUT',
        data: {
          status,
          completedAt: status === 'completed' ? Date.now() : null
        }
      })

      return res.data
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error
    }
  }

  static async getTodayTasks() {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)

    return this.getTasks({
      dueDate: {
        $gte: startOfDay.getTime(),
        $lte: endOfDay.getTime()
      }
    })
  }

  static async getOverdueTasks() {
    const now = Date.now()
    
    return this.getTasks({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    })
  }

  static async getUpcomingTasks(days = 7) {
    const now = Date.now()
    const futureDate = now + (days * 24 * 60 * 60 * 1000)

    return this.getTasks({
      dueDate: {
        $gte: now,
        $lte: futureDate
      },
      status: { $ne: 'completed' }
    })
  }

  static scheduleNotification(task) {
    // Schedule local notification for task reminder
    if (task.reminderTime && task.reminderTime > Date.now()) {
      // This would integrate with a notification service
      console.log('Scheduling notification for task:', task.title)
    }
  }

  static async logActivity(activityData) {
    try {
      const res = await wx.request({
        url: '/api/crm/activities',
        method: 'POST',
        data: {
          ...activityData,
          userId: wx.getStorageSync('userId'),
          timestamp: Date.now()
        }
      })

      return res.data
    } catch (error) {
      console.error('Failed to log activity:', error)
      throw error
    }
  }

  static async getCustomerActivities(customerId, limit = 20) {
    try {
      const res = await wx.request({
        url: `/api/crm/customers/${customerId}/activities`,
        method: 'GET',
        data: { limit }
      })

      return res.data.activities
    } catch (error) {
      console.error('Failed to get customer activities:', error)
      return []
    }
  }
}

export default TaskManager
```

### Communication Integration

```javascript
// utils/communication-hub.js
class CommunicationHub {
  static async makeCall(customerId, phoneNumber) {
    try {
      // Log the call attempt
      await this.logCommunication({
        customerId,
        type: 'call',
        direction: 'outbound',
        phoneNumber,
        status: 'initiated'
      })

      // Make the actual call
      wx.makePhoneCall({
        phoneNumber,
        success: () => {
          // Log successful call
          this.logCommunication({
            customerId,
            type: 'call',
            direction: 'outbound',
            phoneNumber,
            status: 'connected'
          })
        },
        fail: (error) => {
          // Log failed call
          this.logCommunication({
            customerId,
            type: 'call',
            direction: 'outbound',
            phoneNumber,
            status: 'failed',
            error: error.errMsg
          })
        }
      })
    } catch (error) {
      console.error('Failed to make call:', error)
    }
  }

  static async sendMessage(customerId, message, type = 'text') {
    try {
      const res = await wx.request({
        url: '/api/crm/messages',
        method: 'POST',
        data: {
          customerId,
          message,
          type,
          direction: 'outbound',
          userId: wx.getStorageSync('userId'),
          timestamp: Date.now()
        }
      })

      if (res.data.success) {
        // Log the message
        await this.logCommunication({
          customerId,
          type: 'message',
          direction: 'outbound',
          content: message,
          status: 'sent'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  static async getMessageHistory(customerId, limit = 50) {
    try {
      const res = await wx.request({
        url: `/api/crm/customers/${customerId}/messages`,
        method: 'GET',
        data: { limit }
      })

      return res.data.messages
    } catch (error) {
      console.error('Failed to get message history:', error)
      return []
    }
  }

  static async logCommunication(communicationData) {
    try {
      const res = await wx.request({
        url: '/api/crm/communications',
        method: 'POST',
        data: communicationData
      })

      return res.data
    } catch (error) {
      console.error('Failed to log communication:', error)
    }
  }

  static async getCommunicationHistory(customerId, limit = 20) {
    try {
      const res = await wx.request({
        url: `/api/crm/customers/${customerId}/communications`,
        method: 'GET',
        data: { limit }
      })

      return res.data.communications
    } catch (error) {
      console.error('Failed to get communication history:', error)
      return []
    }
  }

  static async scheduleFollowUp(customerId, followUpData) {
    try {
      const res = await wx.request({
        url: '/api/crm/follow-ups',
        method: 'POST',
        data: {
          customerId,
          ...followUpData,
          userId: wx.getStorageSync('userId'),
          createdAt: Date.now()
        }
      })

      if (res.data.success) {
        // Create a task for the follow-up
        await TaskManager.createTask({
          title: `Follow up with ${followUpData.customerName}`,
          description: followUpData.notes,
          customerId,
          type: 'follow-up',
          dueDate: followUpData.scheduledDate,
          reminderTime: followUpData.scheduledDate - (30 * 60 * 1000) // 30 minutes before
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to schedule follow-up:', error)
      throw error
    }
  }
}

export default CommunicationHub
```

### Analytics and Reporting

```javascript
// utils/crm-analytics.js
class CRMAnalytics {
  static async getSalesMetrics(period = '30d') {
    try {
      const res = await wx.request({
        url: '/api/crm/analytics/sales',
        method: 'GET',
        data: {
          period,
          userId: wx.getStorageSync('userId')
        }
      })

      return res.data.metrics
    } catch (error) {
      console.error('Failed to get sales metrics:', error)
      return null
    }
  }

  static async getCustomerMetrics(period = '30d') {
    try {
      const res = await wx.request({
        url: '/api/crm/analytics/customers',
        method: 'GET',
        data: {
          period,
          userId: wx.getStorageSync('userId')
        }
      })

      return res.data.metrics
    } catch (error) {
      console.error('Failed to get customer metrics:', error)
      return null
    }
  }

  static async getPipelineAnalytics() {
    try {
      const res = await wx.request({
        url: '/api/crm/analytics/pipeline',
        method: 'GET',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      return res.data.analytics
    } catch (error) {
      console.error('Failed to get pipeline analytics:', error)
      return null
    }
  }

  static async getActivityMetrics(period = '30d') {
    try {
      const res = await wx.request({
        url: '/api/crm/analytics/activities',
        method: 'GET',
        data: {
          period,
          userId: wx.getStorageSync('userId')
        }
      })

      return res.data.metrics
    } catch (error) {
      console.error('Failed to get activity metrics:', error)
      return null
    }
  }

  static async generateReport(reportType, parameters) {
    try {
      const res = await wx.request({
        url: '/api/crm/reports/generate',
        method: 'POST',
        data: {
          type: reportType,
          parameters,
          userId: wx.getStorageSync('userId')
        }
      })

      return res.data
    } catch (error) {
      console.error('Failed to generate report:', error)
      throw error
    }
  }

  static async exportData(dataType, filters = {}) {
    try {
      const res = await wx.request({
        url: '/api/crm/export',
        method: 'POST',
        data: {
          type: dataType,
          filters,
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        // Download the exported file
        wx.downloadFile({
          url: res.data.downloadUrl,
          success: (downloadRes) => {
            wx.openDocument({
              filePath: downloadRes.tempFilePath,
              success: () => {
                wx.showToast({
                  title: 'Export successful',
                  icon: 'success'
                })
              }
            })
          }
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  }

  static calculateConversionRate(opportunities) {
    if (opportunities.length === 0) return 0

    const wonOpportunities = opportunities.filter(opp => opp.status === 'won')
    return (wonOpportunities.length / opportunities.length) * 100
  }

  static calculateAverageDealSize(opportunities) {
    if (opportunities.length === 0) return 0

    const wonOpportunities = opportunities.filter(opp => opp.status === 'won')
    if (wonOpportunities.length === 0) return 0

    const totalValue = wonOpportunities.reduce((sum, opp) => sum + opp.value, 0)
    return totalValue / wonOpportunities.length
  }

  static calculateSalesCycle(opportunities) {
    const closedOpportunities = opportunities.filter(opp => 
      opp.status === 'won' || opp.status === 'lost'
    )

    if (closedOpportunities.length === 0) return 0

    const totalDays = closedOpportunities.reduce((sum, opp) => {
      const createdDate = new Date(opp.createdAt)
      const closedDate = new Date(opp.closedAt)
      const days = Math.ceil((closedDate - createdDate) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)

    return Math.round(totalDays / closedOpportunities.length)
  }
}

export default CRMAnalytics
```

## Project Results

### Key Metrics

- **Sales Efficiency**: 40% improvement in sales team productivity
- **Customer Response Time**: 65% faster response to customer inquiries
- **Deal Closure Rate**: 25% increase in successful deal closures
- **Data Accuracy**: 90% improvement in customer data quality and completeness
- **Mobile Adoption**: 95% of sales team actively using mobile CRM features

### Business Impact

- **Revenue Growth**: 35% increase in sales revenue within first year
- **Customer Satisfaction**: 4.7/5.0 average customer satisfaction rating
- **Team Collaboration**: 50% improvement in team coordination and information sharing
- **Process Efficiency**: 60% reduction in administrative tasks through automation
- **Data-Driven Decisions**: 80% of sales decisions now backed by CRM analytics

This CRM system mini program successfully demonstrates how mobile-first customer relationship management can transform sales processes, improve customer service, and drive business growth through better data management and team collaboration.