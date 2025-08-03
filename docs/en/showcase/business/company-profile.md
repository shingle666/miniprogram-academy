# Company Profile Mini Program Case

This case showcases a comprehensive company profile mini program that serves as a digital business card, providing potential clients and partners with detailed information about the company's services, team, achievements, and contact methods.

## Project Overview

### Project Background

In today's digital business environment, companies need effective ways to showcase their brand, services, and achievements to potential clients. This mini program addresses the need for a professional, mobile-first company presentation platform that can be easily shared and accessed without app downloads.

### Core Features

- **Company Overview**: Comprehensive business information and history
- **Service Portfolio**: Detailed service descriptions with case studies
- **Team Showcase**: Professional team member profiles and expertise
- **Achievement Gallery**: Awards, certifications, and success stories
- **News & Updates**: Latest company news and industry insights
- **Contact Integration**: Multiple contact methods and inquiry forms
- **Multi-language Support**: Content available in multiple languages

## Technical Implementation

### Company Information Management

```javascript
// pages/company/company.js
Page({
  data: {
    companyInfo: {},
    services: [],
    achievements: [],
    news: [],
    loading: true
  },

  onLoad() {
    this.loadCompanyData()
  },

  async loadCompanyData() {
    try {
      const [companyRes, servicesRes, achievementsRes, newsRes] = await Promise.all([
        this.getCompanyInfo(),
        this.getServices(),
        this.getAchievements(),
        this.getLatestNews()
      ])

      this.setData({
        companyInfo: companyRes.data,
        services: servicesRes.data.services,
        achievements: achievementsRes.data.achievements,
        news: newsRes.data.news,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load company data:', error)
      this.setData({ loading: false })
    }
  },

  async getCompanyInfo() {
    return wx.request({
      url: '/api/company/info',
      method: 'GET'
    })
  },

  async getServices() {
    return wx.request({
      url: '/api/company/services',
      method: 'GET'
    })
  },

  async getAchievements() {
    return wx.request({
      url: '/api/company/achievements',
      method: 'GET'
    })
  },

  async getLatestNews() {
    return wx.request({
      url: '/api/company/news',
      method: 'GET',
      data: { limit: 5 }
    })
  },

  onServiceDetail(e) {
    const serviceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?id=${serviceId}`
    })
  },

  onNewsDetail(e) {
    const newsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/news-detail/news-detail?id=${newsId}`
    })
  },

  onContactUs() {
    wx.navigateTo({
      url: '/pages/contact/contact'
    })
  },

  onShareCompany() {
    return {
      title: this.data.companyInfo.name,
      desc: this.data.companyInfo.description,
      path: '/pages/company/company'
    }
  }
})
```

### Service Portfolio System

```javascript
// pages/service-detail/service-detail.js
Page({
  data: {
    service: {},
    caseStudies: [],
    relatedServices: [],
    loading: true
  },

  onLoad(options) {
    this.serviceId = options.id
    this.loadServiceDetail()
  },

  async loadServiceDetail() {
    try {
      const [serviceRes, casesRes, relatedRes] = await Promise.all([
        this.getServiceInfo(this.serviceId),
        this.getCaseStudies(this.serviceId),
        this.getRelatedServices(this.serviceId)
      ])

      this.setData({
        service: serviceRes.data,
        caseStudies: casesRes.data.cases,
        relatedServices: relatedRes.data.services,
        loading: false
      })

      // Set page title
      wx.setNavigationBarTitle({
        title: serviceRes.data.name
      })
    } catch (error) {
      console.error('Failed to load service detail:', error)
      this.setData({ loading: false })
    }
  },

  async getServiceInfo(serviceId) {
    return wx.request({
      url: `/api/services/${serviceId}`,
      method: 'GET'
    })
  },

  async getCaseStudies(serviceId) {
    return wx.request({
      url: `/api/services/${serviceId}/cases`,
      method: 'GET'
    })
  },

  async getRelatedServices(serviceId) {
    return wx.request({
      url: `/api/services/${serviceId}/related`,
      method: 'GET'
    })
  },

  onCaseStudyDetail(e) {
    const caseId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/case-study/case-study?id=${caseId}`
    })
  },

  onInquireService() {
    wx.navigateTo({
      url: `/pages/inquiry/inquiry?serviceId=${this.serviceId}`
    })
  },

  onCallConsultant() {
    wx.makePhoneCall({
      phoneNumber: this.data.service.consultantPhone
    })
  }
})
```

### Team Showcase Component

```javascript
// components/team-showcase/team-showcase.js
Component({
  properties: {
    teamMembers: {
      type: Array,
      value: []
    },
    showAll: {
      type: Boolean,
      value: false
    }
  },

  data: {
    displayMembers: [],
    selectedMember: null,
    showMemberDetail: false
  },

  observers: {
    'teamMembers, showAll'() {
      this.updateDisplayMembers()
    }
  },

  methods: {
    updateDisplayMembers() {
      const members = this.properties.teamMembers
      const displayMembers = this.properties.showAll ? members : members.slice(0, 6)
      
      this.setData({ displayMembers })
    },

    onMemberTap(e) {
      const memberId = e.currentTarget.dataset.id
      const member = this.properties.teamMembers.find(m => m.id === memberId)
      
      this.setData({
        selectedMember: member,
        showMemberDetail: true
      })
    },

    onCloseMemberDetail() {
      this.setData({
        showMemberDetail: false,
        selectedMember: null
      })
    },

    onContactMember(e) {
      const { type, value } = e.currentTarget.dataset
      
      switch (type) {
        case 'phone':
          wx.makePhoneCall({ phoneNumber: value })
          break
        case 'email':
          wx.setClipboardData({
            data: value,
            success: () => {
              wx.showToast({
                title: 'Email copied to clipboard',
                icon: 'success'
              })
            }
          })
          break
        case 'wechat':
          wx.setClipboardData({
            data: value,
            success: () => {
              wx.showToast({
                title: 'WeChat ID copied',
                icon: 'success'
              })
            }
          })
          break
      }
    },

    onShowAllMembers() {
      this.triggerEvent('showAllMembers')
    }
  }
})
```

### Achievement Gallery

```javascript
// components/achievement-gallery/achievement-gallery.js
Component({
  properties: {
    achievements: {
      type: Array,
      value: []
    }
  },

  data: {
    categories: ['all', 'awards', 'certifications', 'partnerships', 'milestones'],
    selectedCategory: 'all',
    filteredAchievements: [],
    currentImageIndex: 0,
    showImageViewer: false,
    imageList: []
  },

  lifetimes: {
    attached() {
      this.filterAchievements()
    }
  },

  observers: {
    'achievements, selectedCategory'() {
      this.filterAchievements()
    }
  },

  methods: {
    filterAchievements() {
      const { achievements, selectedCategory } = this.properties
      
      let filtered = achievements
      if (selectedCategory !== 'all') {
        filtered = achievements.filter(achievement => 
          achievement.category === selectedCategory
        )
      }

      this.setData({ 
        filteredAchievements: filtered,
        imageList: filtered.map(a => a.image).filter(img => img)
      })
    },

    onCategorySelect(e) {
      const category = e.currentTarget.dataset.category
      this.setData({ selectedCategory: category })
      this.filterAchievements()
    },

    onAchievementTap(e) {
      const index = e.currentTarget.dataset.index
      const achievement = this.data.filteredAchievements[index]
      
      if (achievement.image) {
        this.setData({
          currentImageIndex: index,
          showImageViewer: true
        })
      } else {
        this.showAchievementDetail(achievement)
      }
    },

    showAchievementDetail(achievement) {
      wx.showModal({
        title: achievement.title,
        content: `${achievement.description}\n\nDate: ${achievement.date}`,
        showCancel: false,
        confirmText: 'OK'
      })
    },

    onImageViewerClose() {
      this.setData({ showImageViewer: false })
    },

    onImageChange(e) {
      this.setData({
        currentImageIndex: e.detail.current
      })
    },

    onShareAchievement(e) {
      const index = e.currentTarget.dataset.index
      const achievement = this.data.filteredAchievements[index]
      
      return {
        title: `${achievement.title} - Company Achievement`,
        desc: achievement.description,
        path: `/pages/achievement/achievement?id=${achievement.id}`,
        imageUrl: achievement.image
      }
    }
  }
})
```

### Contact and Inquiry System

```javascript
// pages/contact/contact.js
Page({
  data: {
    contactInfo: {},
    inquiryForm: {
      name: '',
      company: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
      serviceInterest: ''
    },
    services: [],
    submitting: false
  },

  onLoad() {
    this.loadContactInfo()
    this.loadServices()
  },

  async loadContactInfo() {
    try {
      const res = await wx.request({
        url: '/api/company/contact',
        method: 'GET'
      })

      this.setData({
        contactInfo: res.data
      })
    } catch (error) {
      console.error('Failed to load contact info:', error)
    }
  },

  async loadServices() {
    try {
      const res = await wx.request({
        url: '/api/company/services',
        method: 'GET'
      })

      this.setData({
        services: res.data.services
      })
    } catch (error) {
      console.error('Failed to load services:', error)
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    
    this.setData({
      [`inquiryForm.${field}`]: value
    })
  },

  onServiceSelect(e) {
    const serviceId = e.detail.value
    const selectedService = this.data.services[serviceId]
    
    this.setData({
      'inquiryForm.serviceInterest': selectedService ? selectedService.name : ''
    })
  },

  validateForm() {
    const { inquiryForm } = this.data
    const errors = []

    if (!inquiryForm.name.trim()) {
      errors.push('Name is required')
    }

    if (!inquiryForm.phone.trim()) {
      errors.push('Phone number is required')
    } else if (!/^1[3-9]\d{9}$/.test(inquiryForm.phone)) {
      errors.push('Please enter a valid phone number')
    }

    if (!inquiryForm.email.trim()) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email)) {
      errors.push('Please enter a valid email address')
    }

    if (!inquiryForm.message.trim()) {
      errors.push('Message is required')
    }

    return errors
  },

  async onSubmitInquiry() {
    if (this.data.submitting) return

    const errors = this.validateForm()
    if (errors.length > 0) {
      wx.showModal({
        title: 'Form Validation Error',
        content: errors.join('\n'),
        showCancel: false
      })
      return
    }

    this.setData({ submitting: true })

    try {
      const res = await wx.request({
        url: '/api/company/inquiry',
        method: 'POST',
        data: {
          ...this.data.inquiryForm,
          timestamp: Date.now(),
          source: 'mini-program'
        }
      })

      if (res.data.success) {
        wx.showModal({
          title: 'Inquiry Submitted',
          content: 'Thank you for your inquiry! We will contact you within 24 hours.',
          showCancel: false,
          success: () => {
            // Reset form
            this.setData({
              inquiryForm: {
                name: '',
                company: '',
                phone: '',
                email: '',
                subject: '',
                message: '',
                serviceInterest: ''
              }
            })
          }
        })
      }
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
      wx.showToast({
        title: 'Submission failed',
        icon: 'error'
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  onCallPhone(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({ phoneNumber: phone })
  },

  onCopyInfo(e) {
    const { type, value } = e.currentTarget.dataset
    
    wx.setClipboardData({
      data: value,
      success: () => {
        wx.showToast({
          title: `${type} copied to clipboard`,
          icon: 'success'
        })
      }
    })
  },

  onOpenLocation() {
    const { contactInfo } = this.data
    
    wx.openLocation({
      latitude: contactInfo.latitude,
      longitude: contactInfo.longitude,
      name: contactInfo.companyName,
      address: contactInfo.address
    })
  }
})
```

### Analytics and Tracking

```javascript
// utils/company-analytics.js
class CompanyAnalytics {
  static async trackPageView(page, additionalData = {}) {
    try {
      await wx.request({
        url: '/api/analytics/pageview',
        method: 'POST',
        data: {
          page,
          timestamp: Date.now(),
          userAgent: wx.getSystemInfoSync(),
          ...additionalData
        }
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  static async trackServiceInterest(serviceId, action) {
    try {
      await wx.request({
        url: '/api/analytics/service-interest',
        method: 'POST',
        data: {
          serviceId,
          action, // 'view', 'inquire', 'call'
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track service interest:', error)
    }
  }

  static async trackInquiry(inquiryData) {
    try {
      await wx.request({
        url: '/api/analytics/inquiry',
        method: 'POST',
        data: {
          ...inquiryData,
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track inquiry:', error)
    }
  }

  static async getVisitorStats() {
    try {
      const res = await wx.request({
        url: '/api/analytics/visitor-stats',
        method: 'GET'
      })

      return res.data
    } catch (error) {
      console.error('Failed to get visitor stats:', error)
      return null
    }
  }

  static async getPopularServices() {
    try {
      const res = await wx.request({
        url: '/api/analytics/popular-services',
        method: 'GET'
      })

      return res.data.services
    } catch (error) {
      console.error('Failed to get popular services:', error)
      return []
    }
  }

  static async getInquiryTrends(period = '30d') {
    try {
      const res = await wx.request({
        url: '/api/analytics/inquiry-trends',
        method: 'GET',
        data: { period }
      })

      return res.data.trends
    } catch (error) {
      console.error('Failed to get inquiry trends:', error)
      return []
    }
  }
}

export default CompanyAnalytics
```

## Project Results

### Key Metrics

- **Brand Visibility**: 300% increase in brand awareness within target market
- **Lead Generation**: 450% improvement in qualified leads through the platform
- **Client Engagement**: 85% of visitors spend more than 3 minutes exploring services
- **Conversion Rate**: 12% of visitors submit inquiries or contact requests
- **Professional Image**: 95% of clients rate the company as "highly professional"

### Business Impact

- **New Client Acquisition**: 200+ new clients acquired through the mini program
- **Service Inquiries**: 500% increase in service inquiries compared to traditional methods
- **Brand Recognition**: Featured in industry publications as a digital innovation leader
- **Cost Efficiency**: 60% reduction in marketing costs while improving reach
- **Client Satisfaction**: 4.9/5.0 average rating for professional presentation

This company profile mini program successfully demonstrates how businesses can leverage mini program technology to create professional, engaging digital presentations that drive business growth and enhance brand reputation.