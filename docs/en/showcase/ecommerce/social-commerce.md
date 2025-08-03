# Social Commerce Mini Program Case

This case showcases a social commerce mini program that combines social interaction with e-commerce functionality, enabling users to share products, participate in group buying, and earn through social recommendations.

## Project Overview

### Project Background

Social commerce represents the convergence of social media and e-commerce, leveraging social relationships and user-generated content to drive sales. This mini program creates a community-driven shopping experience where users can discover products through friends' recommendations, participate in group activities, and build their own social commerce networks.

### Core Features

- **Social Product Sharing**: Users can share favorite products with friends and social networks
- **Group Buying**: Collaborative purchasing with discounted prices for group orders
- **Referral System**: Earn commissions by referring friends and promoting products
- **Live Streaming**: Real-time product demonstrations and interactive shopping
- **Community Features**: User reviews, discussions, and product recommendations
- **Gamification**: Points, badges, and rewards for social activities

## Technical Implementation

### Social Sharing System

```javascript
// utils/social-share.js
class SocialShare {
  static async shareProduct(product) {
    const shareData = {
      title: product.name,
      desc: `${product.description.substring(0, 50)}...`,
      path: `/pages/product/detail?id=${product.id}&from=share`,
      imageUrl: product.image
    }

    try {
      await wx.shareAppMessage(shareData)
      
      // Track sharing activity
      this.trackShare(product.id, 'product')
      
      // Reward user for sharing
      this.rewardUser('share_product', 10)
      
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  static async shareToMoments(product) {
    const shareData = {
      title: `Check out this amazing product: ${product.name}`,
      imageUrl: product.image,
      query: `id=${product.id}&from=moments`
    }

    try {
      await wx.shareTimeline(shareData)
      this.trackShare(product.id, 'moments')
      this.rewardUser('share_moments', 20)
    } catch (error) {
      console.error('Share to moments failed:', error)
    }
  }

  static trackShare(productId, platform) {
    wx.request({
      url: '/api/analytics/share',
      method: 'POST',
      data: {
        productId,
        platform,
        userId: wx.getStorageSync('userId'),
        timestamp: Date.now()
      }
    })
  }

  static rewardUser(action, points) {
    wx.request({
      url: '/api/user/reward',
      method: 'POST',
      data: {
        action,
        points,
        userId: wx.getStorageSync('userId')
      }
    })
  }
}

export default SocialShare
```

### Group Buying System

```javascript
// pages/group-buy/group-buy.js
Page({
  data: {
    groupInfo: null,
    participants: [],
    timeLeft: 0,
    canJoin: true,
    isCreator: false
  },

  onLoad(options) {
    const { groupId } = options
    this.groupId = groupId
    this.loadGroupInfo()
    this.startCountdown()
  },

  async loadGroupInfo() {
    try {
      const res = await wx.request({
        url: `/api/group-buy/${this.groupId}`,
        method: 'GET'
      })

      const groupInfo = res.data
      const userId = wx.getStorageSync('userId')
      
      this.setData({
        groupInfo,
        participants: groupInfo.participants,
        isCreator: groupInfo.creatorId === userId,
        canJoin: groupInfo.participants.length < groupInfo.maxParticipants &&
                 !groupInfo.participants.some(p => p.userId === userId)
      })
    } catch (error) {
      console.error('Failed to load group info:', error)
    }
  },

  async joinGroup() {
    if (!this.data.canJoin) return

    try {
      wx.showLoading({ title: 'Joining group...' })

      const res = await wx.request({
        url: `/api/group-buy/${this.groupId}/join`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Joined successfully!',
          icon: 'success'
        })
        
        this.loadGroupInfo()
        
        // Check if group is complete
        if (res.data.groupComplete) {
          this.handleGroupComplete()
        }
      }
    } catch (error) {
      console.error('Failed to join group:', error)
      wx.showToast({
        title: 'Failed to join',
        icon: 'error'
      })
    } finally {
      wx.hideLoading()
    }
  },

  async createGroup() {
    try {
      const res = await wx.request({
        url: '/api/group-buy/create',
        method: 'POST',
        data: {
          productId: this.data.groupInfo.productId,
          maxParticipants: this.data.groupInfo.maxParticipants,
          duration: 24 * 60 * 60 * 1000, // 24 hours
          creatorId: wx.getStorageSync('userId')
        }
      })

      const newGroupId = res.data.groupId
      
      // Share the new group
      wx.shareAppMessage({
        title: `Join my group buy for ${this.data.groupInfo.productName}!`,
        path: `/pages/group-buy/group-buy?groupId=${newGroupId}`,
        imageUrl: this.data.groupInfo.productImage
      })
    } catch (error) {
      console.error('Failed to create group:', error)
    }
  },

  handleGroupComplete() {
    wx.showModal({
      title: 'Group Complete!',
      content: 'The group buying is successful. Proceed to payment?',
      success: (res) => {
        if (res.confirm) {
          this.processGroupPayment()
        }
      }
    })
  },

  async processGroupPayment() {
    try {
      const res = await wx.request({
        url: `/api/group-buy/${this.groupId}/payment`,
        method: 'POST'
      })

      const paymentParams = res.data

      wx.requestPayment({
        ...paymentParams,
        success: () => {
          wx.showToast({
            title: 'Payment successful!',
            icon: 'success'
          })
          
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/order/list'
            })
          }, 1500)
        },
        fail: (error) => {
          console.error('Payment failed:', error)
        }
      })
    } catch (error) {
      console.error('Failed to process payment:', error)
    }
  },

  startCountdown() {
    const updateCountdown = () => {
      if (!this.data.groupInfo) return

      const endTime = new Date(this.data.groupInfo.endTime).getTime()
      const now = Date.now()
      const timeLeft = Math.max(0, endTime - now)

      this.setData({ timeLeft })

      if (timeLeft > 0) {
        setTimeout(updateCountdown, 1000)
      } else {
        this.handleGroupExpired()
      }
    }

    updateCountdown()
  },

  handleGroupExpired() {
    wx.showModal({
      title: 'Group Expired',
      content: 'This group buying has expired.',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  }
})
```

### Referral System

```javascript
// utils/referral.js
class ReferralSystem {
  static async generateReferralCode(userId) {
    try {
      const res = await wx.request({
        url: '/api/referral/generate',
        method: 'POST',
        data: { userId }
      })

      return res.data.referralCode
    } catch (error) {
      console.error('Failed to generate referral code:', error)
      throw error
    }
  }

  static async trackReferral(referralCode, newUserId) {
    try {
      await wx.request({
        url: '/api/referral/track',
        method: 'POST',
        data: {
          referralCode,
          newUserId,
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track referral:', error)
    }
  }

  static async calculateCommission(orderId, referrerId) {
    try {
      const res = await wx.request({
        url: '/api/referral/commission',
        method: 'POST',
        data: {
          orderId,
          referrerId
        }
      })

      return res.data.commission
    } catch (error) {
      console.error('Failed to calculate commission:', error)
      return 0
    }
  }

  static async shareReferralLink(productId, referralCode) {
    const shareData = {
      title: 'Join me on this amazing shopping platform!',
      desc: 'Get exclusive discounts and earn rewards',
      path: `/pages/product/detail?id=${productId}&ref=${referralCode}`,
      imageUrl: '/images/referral-banner.jpg'
    }

    try {
      await wx.shareAppMessage(shareData)
      
      // Track referral sharing
      this.trackReferralShare(referralCode)
      
    } catch (error) {
      console.error('Failed to share referral link:', error)
    }
  }

  static trackReferralShare(referralCode) {
    wx.request({
      url: '/api/referral/share-track',
      method: 'POST',
      data: {
        referralCode,
        timestamp: Date.now()
      }
    })
  }
}

export default ReferralSystem
```

### Live Streaming Integration

```javascript
// pages/live-stream/live-stream.js
Page({
  data: {
    streamInfo: null,
    products: [],
    comments: [],
    viewerCount: 0,
    isLive: false
  },

  onLoad(options) {
    const { streamId } = options
    this.streamId = streamId
    this.loadStreamInfo()
    this.connectWebSocket()
  },

  async loadStreamInfo() {
    try {
      const res = await wx.request({
        url: `/api/live-stream/${this.streamId}`,
        method: 'GET'
      })

      this.setData({
        streamInfo: res.data.stream,
        products: res.data.products,
        isLive: res.data.stream.status === 'live'
      })
    } catch (error) {
      console.error('Failed to load stream info:', error)
    }
  },

  connectWebSocket() {
    this.socketTask = wx.connectSocket({
      url: `wss://api.example.com/live-stream/${this.streamId}/ws`
    })

    this.socketTask.onMessage((res) => {
      const data = JSON.parse(res.data)
      this.handleWebSocketMessage(data)
    })

    this.socketTask.onError((error) => {
      console.error('WebSocket error:', error)
    })
  },

  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'comment':
        this.addComment(data.comment)
        break
      case 'viewer_count':
        this.setData({ viewerCount: data.count })
        break
      case 'product_highlight':
        this.highlightProduct(data.productId)
        break
      case 'stream_end':
        this.handleStreamEnd()
        break
    }
  },

  addComment(comment) {
    const comments = [...this.data.comments, comment]
    this.setData({ comments })
    
    // Auto-scroll to latest comment
    this.scrollToLatestComment()
  },

  sendComment(e) {
    const content = e.detail.value.trim()
    if (!content) return

    const comment = {
      userId: wx.getStorageSync('userId'),
      username: wx.getStorageSync('username'),
      content,
      timestamp: Date.now()
    }

    this.socketTask.send({
      data: JSON.stringify({
        type: 'comment',
        comment
      })
    })

    // Clear input
    this.setData({ commentInput: '' })
  },

  onProductTap(e) {
    const productId = e.currentTarget.dataset.id
    
    // Track product interest
    this.trackProductInterest(productId)
    
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}&from=live`
    })
  },

  async trackProductInterest(productId) {
    try {
      await wx.request({
        url: '/api/analytics/product-interest',
        method: 'POST',
        data: {
          productId,
          streamId: this.streamId,
          userId: wx.getStorageSync('userId'),
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track product interest:', error)
    }
  },

  highlightProduct(productId) {
    const products = this.data.products.map(product => ({
      ...product,
      highlighted: product.id === productId
    }))

    this.setData({ products })

    // Remove highlight after 5 seconds
    setTimeout(() => {
      const products = this.data.products.map(product => ({
        ...product,
        highlighted: false
      }))
      this.setData({ products })
    }, 5000)
  },

  handleStreamEnd() {
    this.setData({ isLive: false })
    
    wx.showModal({
      title: 'Stream Ended',
      content: 'The live stream has ended. Thank you for watching!',
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  onUnload() {
    if (this.socketTask) {
      this.socketTask.close()
    }
  }
})
```

## User Engagement Features

### Gamification System

```javascript
// utils/gamification.js
class GamificationSystem {
  static async getUserLevel(userId) {
    try {
      const res = await wx.request({
        url: `/api/user/${userId}/level`,
        method: 'GET'
      })

      return res.data
    } catch (error) {
      console.error('Failed to get user level:', error)
      return { level: 1, points: 0, nextLevelPoints: 100 }
    }
  }

  static async awardPoints(userId, action, points) {
    try {
      const res = await wx.request({
        url: '/api/user/award-points',
        method: 'POST',
        data: {
          userId,
          action,
          points
        }
      })

      if (res.data.levelUp) {
        this.showLevelUpAnimation(res.data.newLevel)
      }

      return res.data
    } catch (error) {
      console.error('Failed to award points:', error)
    }
  }

  static showLevelUpAnimation(newLevel) {
    wx.showModal({
      title: 'Level Up!',
      content: `Congratulations! You've reached level ${newLevel}!`,
      showCancel: false,
      success: () => {
        // Show celebration animation
        this.triggerCelebration()
      }
    })
  }

  static triggerCelebration() {
    // Trigger confetti or other celebration effects
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })

    animation.scale(1.2).rotate(360).step()
    animation.scale(1).step()

    // Apply animation to celebration element
    this.setData({
      celebrationAnimation: animation.export()
    })
  }

  static async getUserBadges(userId) {
    try {
      const res = await wx.request({
        url: `/api/user/${userId}/badges`,
        method: 'GET'
      })

      return res.data.badges
    } catch (error) {
      console.error('Failed to get user badges:', error)
      return []
    }
  }

  static async checkBadgeEligibility(userId, action) {
    try {
      const res = await wx.request({
        url: '/api/user/check-badges',
        method: 'POST',
        data: {
          userId,
          action
        }
      })

      if (res.data.newBadges.length > 0) {
        this.showNewBadges(res.data.newBadges)
      }

      return res.data.newBadges
    } catch (error) {
      console.error('Failed to check badge eligibility:', error)
      return []
    }
  }

  static showNewBadges(badges) {
    badges.forEach((badge, index) => {
      setTimeout(() => {
        wx.showModal({
          title: 'New Badge Earned!',
          content: `You've earned the "${badge.name}" badge!`,
          showCancel: false
        })
      }, index * 1000)
    })
  }
}

export default GamificationSystem
```

### Social Feed System

```javascript
// pages/social-feed/social-feed.js
Page({
  data: {
    posts: [],
    loading: false,
    hasMore: true,
    page: 1
  },

  onLoad() {
    this.loadFeed()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },

  onPullDownRefresh() {
    this.setData({
      posts: [],
      page: 1,
      hasMore: true
    })
    this.loadFeed()
  },

  async loadFeed() {
    this.setData({ loading: true })

    try {
      const res = await wx.request({
        url: '/api/social-feed',
        method: 'GET',
        data: {
          page: this.data.page,
          limit: 10,
          userId: wx.getStorageSync('userId')
        }
      })

      const newPosts = res.data.posts
      
      this.setData({
        posts: this.data.page === 1 ? newPosts : [...this.data.posts, ...newPosts],
        hasMore: newPosts.length === 10,
        loading: false
      })

      wx.stopPullDownRefresh()
    } catch (error) {
      console.error('Failed to load feed:', error)
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }
  },

  async loadMore() {
    this.setData({
      page: this.data.page + 1
    })
    await this.loadFeed()
  },

  async onLikePost(e) {
    const postId = e.currentTarget.dataset.id
    const postIndex = e.currentTarget.dataset.index

    try {
      const res = await wx.request({
        url: `/api/social-feed/${postId}/like`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      // Update local state
      const posts = [...this.data.posts]
      posts[postIndex].liked = res.data.liked
      posts[postIndex].likeCount = res.data.likeCount

      this.setData({ posts })

      // Show heart animation
      this.showLikeAnimation(e.currentTarget)

    } catch (error) {
      console.error('Failed to like post:', error)
    }
  },

  showLikeAnimation(target) {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })

    animation.scale(1.3).step()
    animation.scale(1).step()

    // Apply animation
    const query = wx.createSelectorQuery()
    query.select('.like-button').boundingClientRect()
    query.exec((res) => {
      if (res[0]) {
        // Create floating heart effect
        this.createFloatingHeart(res[0])
      }
    })
  },

  createFloatingHeart(rect) {
    const heart = {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      opacity: 1
    }

    // Add heart to floating hearts array
    const floatingHearts = [...(this.data.floatingHearts || []), heart]
    this.setData({ floatingHearts })

    // Animate heart floating up
    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-out'
    })

    animation.translateY(-100).opacity(0).step()

    setTimeout(() => {
      // Remove heart after animation
      const hearts = this.data.floatingHearts.filter(h => h.id !== heart.id)
      this.setData({ floatingHearts: hearts })
    }, 1000)
  },

  onSharePost(e) {
    const post = e.currentTarget.dataset.post

    wx.shareAppMessage({
      title: post.content.substring(0, 50),
      desc: `Shared by ${post.author.name}`,
      path: `/pages/social-feed/post-detail?id=${post.id}`,
      imageUrl: post.images[0] || '/images/default-share.jpg'
    })

    // Track sharing
    this.trackPostShare(post.id)
  },

  async trackPostShare(postId) {
    try {
      await wx.request({
        url: `/api/social-feed/${postId}/share`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track post share:', error)
    }
  },

  onCommentPost(e) {
    const postId = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `/pages/social-feed/comments?postId=${postId}`
    })
  },

  onCreatePost() {
    wx.navigateTo({
      url: '/pages/social-feed/create-post'
    })
  }
})
```

## Analytics and Insights

### Social Commerce Analytics

```javascript
// utils/social-analytics.js
class SocialAnalytics {
  static async trackSocialAction(action, data) {
    try {
      await wx.request({
        url: '/api/analytics/social-action',
        method: 'POST',
        data: {
          action,
          data,
          userId: wx.getStorageSync('userId'),
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track social action:', error)
    }
  }

  static async getSocialInsights(userId) {
    try {
      const res = await wx.request({
        url: `/api/analytics/social-insights/${userId}`,
        method: 'GET'
      })

      return res.data
    } catch (error) {
      console.error('Failed to get social insights:', error)
      return null
    }
  }

  static async trackInfluencerMetrics(userId) {
    try {
      const res = await wx.request({
        url: `/api/analytics/influencer-metrics/${userId}`,
        method: 'GET'
      })

      return {
        totalShares: res.data.totalShares,
        totalReferrals: res.data.totalReferrals,
        conversionRate: res.data.conversionRate,
        totalCommissions: res.data.totalCommissions,
        topProducts: res.data.topProducts
      }
    } catch (error) {
      console.error('Failed to get influencer metrics:', error)
      return null
    }
  }

  static async generateSocialReport(userId, period = '30d') {
    try {
      const res = await wx.request({
        url: `/api/analytics/social-report/${userId}`,
        method: 'GET',
        data: { period }
      })

      return res.data
    } catch (error) {
      console.error('Failed to generate social report:', error)
      return null
    }
  }
}

export default SocialAnalytics
```

## Project Results

### Key Metrics

- **Social Engagement**: 65% of users actively share products
- **Group Buying Success Rate**: 78% of groups reach completion
- **Referral Conversion**: 25% of referred users make purchases
- **User Retention**: 70% monthly active user retention
- **Average Order Value**: 40% higher than traditional e-commerce

### Business Impact

- **Viral Growth**: 200% user acquisition through social sharing
- **Revenue Increase**: 150% boost in sales through social features
- **Customer Acquisition Cost**: 60% reduction through referral program
- **Community Building**: 50,000+ active community members
- **Brand Advocacy**: 85% user satisfaction with social features

This social commerce mini program successfully combines the power of social interaction with e-commerce functionality, creating a engaging and profitable platform that leverages user relationships to drive business growth.