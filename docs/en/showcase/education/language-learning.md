# Language Learning Mini Program Case

This case showcases an innovative language learning mini program that provides immersive, interactive language education through AI-powered conversations, gamified lessons, and personalized learning paths.

## Project Overview

### Project Background

With globalization increasing the demand for multilingual skills, this mini program addresses the need for accessible, effective language learning solutions that can be used anytime, anywhere without requiring large app downloads.

### Core Features

- **Interactive Lessons**: Structured courses with speaking, listening, reading, and writing exercises
- **AI Conversation Partner**: Practice conversations with AI-powered chatbot
- **Speech Recognition**: Real-time pronunciation feedback and correction
- **Gamified Learning**: Points, badges, and leaderboards to motivate learners
- **Personalized Curriculum**: Adaptive learning paths based on proficiency level
- **Offline Mode**: Download lessons for offline study
- **Progress Tracking**: Detailed analytics on learning progress and weak areas

## Technical Implementation

### Speech Recognition System

```javascript
// components/speech-recognition/speech-recognition.js
Component({
  properties: {
    targetText: String,
    language: String
  },

  data: {
    isRecording: false,
    recognizedText: '',
    accuracy: 0,
    feedback: ''
  },

  lifetimes: {
    attached() {
      this.recorderManager = wx.getRecorderManager()
      this.setupRecorderEvents()
    }
  },

  methods: {
    setupRecorderEvents() {
      this.recorderManager.onStart(() => {
        this.setData({ isRecording: true })
      })

      this.recorderManager.onStop((res) => {
        this.setData({ isRecording: false })
        this.processSpeech(res.tempFilePath)
      })
    },

    startRecording() {
      this.recorderManager.start({
        duration: 10000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      })
    },

    stopRecording() {
      this.recorderManager.stop()
    },

    async processSpeech(audioPath) {
      try {
        wx.showLoading({ title: 'Analyzing...' })

        const res = await wx.uploadFile({
          url: '/api/speech/recognize',
          filePath: audioPath,
          name: 'audio',
          formData: {
            language: this.properties.language,
            targetText: this.properties.targetText
          }
        })

        const result = JSON.parse(res.data)
        
        this.setData({
          recognizedText: result.text,
          accuracy: result.accuracy,
          feedback: result.feedback
        })

        this.triggerEvent('speechResult', result)

      } catch (error) {
        console.error('Speech recognition failed:', error)
        wx.showToast({
          title: 'Recognition failed',
          icon: 'error'
        })
      } finally {
        wx.hideLoading()
      }
    }
  }
})
```

### AI Conversation System

```javascript
// pages/conversation/conversation.js
Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    conversationTopic: '',
    difficulty: 'beginner'
  },

  onLoad(options) {
    this.conversationTopic = options.topic || 'daily_life'
    this.difficulty = options.difficulty || 'beginner'
    this.initializeConversation()
  },

  async initializeConversation() {
    try {
      const res = await wx.request({
        url: '/api/conversation/start',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          topic: this.conversationTopic,
          difficulty: this.difficulty,
          language: wx.getStorageSync('learningLanguage')
        }
      })

      const initialMessage = {
        id: Date.now(),
        type: 'ai',
        text: res.data.greeting,
        timestamp: new Date()
      }

      this.setData({
        messages: [initialMessage]
      })

    } catch (error) {
      console.error('Failed to initialize conversation:', error)
    }
  },

  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  async sendMessage() {
    const text = this.data.inputText.trim()
    if (!text) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      isTyping: true
    })

    try {
      const res = await wx.request({
        url: '/api/conversation/message',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          message: text,
          conversationId: this.conversationId,
          context: this.data.messages.slice(-5) // Last 5 messages for context
        }
      })

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: res.data.response,
        corrections: res.data.corrections,
        suggestions: res.data.suggestions,
        timestamp: new Date()
      }

      this.setData({
        messages: [...this.data.messages, aiMessage],
        isTyping: false
      })

      // Show corrections if any
      if (res.data.corrections && res.data.corrections.length > 0) {
        this.showCorrections(res.data.corrections)
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      this.setData({ isTyping: false })
    }
  },

  showCorrections(corrections) {
    const correctionText = corrections.map(c => 
      `"${c.original}" → "${c.corrected}": ${c.explanation}`
    ).join('\n')

    wx.showModal({
      title: 'Grammar Corrections',
      content: correctionText,
      showCancel: false,
      confirmText: 'Got it!'
    })
  },

  onSpeechInput() {
    // Integrate with speech recognition component
    this.selectComponent('#speech-recognition').startRecording()
  },

  onSpeechResult(e) {
    const { text, accuracy } = e.detail
    this.setData({
      inputText: text
    })

    if (accuracy < 0.7) {
      wx.showToast({
        title: 'Try speaking more clearly',
        icon: 'none'
      })
    }
  }
})
```

### Gamification System

```javascript
// utils/gamification.js
class GamificationSystem {
  static async updateUserPoints(userId, action, points) {
    try {
      const res = await wx.request({
        url: '/api/gamification/points',
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
      console.error('Failed to update points:', error)
    }
  }

  static async checkAchievements(userId, action, data) {
    try {
      const res = await wx.request({
        url: '/api/gamification/achievements',
        method: 'POST',
        data: {
          userId,
          action,
          data
        }
      })

      if (res.data.newAchievements.length > 0) {
        this.showAchievements(res.data.newAchievements)
      }

      return res.data.newAchievements
    } catch (error) {
      console.error('Failed to check achievements:', error)
    }
  }

  static showLevelUpAnimation(newLevel) {
    wx.showModal({
      title: 'Level Up! 🎉',
      content: `Congratulations! You've reached Level ${newLevel}!`,
      showCancel: false,
      confirmText: 'Awesome!'
    })
  }

  static showAchievements(achievements) {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        wx.showModal({
          title: 'Achievement Unlocked! 🏆',
          content: `${achievement.name}\n${achievement.description}`,
          showCancel: false,
          confirmText: 'Great!'
        })
      }, index * 1000)
    })
  }

  static async getLeaderboard(type = 'weekly') {
    try {
      const res = await wx.request({
        url: `/api/gamification/leaderboard/${type}`,
        method: 'GET'
      })

      return res.data.leaderboard
    } catch (error) {
      console.error('Failed to get leaderboard:', error)
      return []
    }
  }

  static async getUserStats(userId) {
    try {
      const res = await wx.request({
        url: `/api/gamification/stats/${userId}`,
        method: 'GET'
      })

      return res.data
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return null
    }
  }
}

export default GamificationSystem
```

### Adaptive Learning Algorithm

```javascript
// utils/adaptive-learning.js
class AdaptiveLearning {
  static async assessUserLevel(userId, language) {
    try {
      const res = await wx.request({
        url: '/api/adaptive/assess',
        method: 'POST',
        data: {
          userId,
          language
        }
      })

      return res.data.level
    } catch (error) {
      console.error('Failed to assess user level:', error)
      return 'beginner'
    }
  }

  static async getPersonalizedLessons(userId, language, currentLevel) {
    try {
      const res = await wx.request({
        url: '/api/adaptive/lessons',
        method: 'GET',
        data: {
          userId,
          language,
          level: currentLevel
        }
      })

      return res.data.lessons
    } catch (error) {
      console.error('Failed to get personalized lessons:', error)
      return []
    }
  }

  static async updateLearningProgress(userId, lessonId, performance) {
    try {
      const res = await wx.request({
        url: '/api/adaptive/progress',
        method: 'POST',
        data: {
          userId,
          lessonId,
          performance,
          timestamp: Date.now()
        }
      })

      // Adjust difficulty based on performance
      if (res.data.adjustDifficulty) {
        this.adjustDifficulty(userId, res.data.newDifficulty)
      }

      return res.data
    } catch (error) {
      console.error('Failed to update learning progress:', error)
    }
  }

  static async adjustDifficulty(userId, newDifficulty) {
    try {
      await wx.request({
        url: '/api/adaptive/difficulty',
        method: 'POST',
        data: {
          userId,
          difficulty: newDifficulty
        }
      })

      wx.showToast({
        title: `Difficulty adjusted to ${newDifficulty}`,
        icon: 'none'
      })
    } catch (error) {
      console.error('Failed to adjust difficulty:', error)
    }
  }

  static async getWeakAreas(userId, language) {
    try {
      const res = await wx.request({
        url: `/api/adaptive/weak-areas/${userId}`,
        method: 'GET',
        data: { language }
      })

      return res.data.weakAreas
    } catch (error) {
      console.error('Failed to get weak areas:', error)
      return []
    }
  }

  static async generateReviewSession(userId, language) {
    try {
      const res = await wx.request({
        url: '/api/adaptive/review',
        method: 'POST',
        data: {
          userId,
          language
        }
      })

      return res.data.reviewSession
    } catch (error) {
      console.error('Failed to generate review session:', error)
      return null
    }
  }
}

export default AdaptiveLearning
```

## Project Results

### Key Metrics

- **Learning Effectiveness**: 90% improvement in language proficiency tests
- **User Engagement**: 80% daily active user retention
- **Completion Rate**: 70% course completion rate
- **User Satisfaction**: 4.7/5.0 average rating

### Business Impact

- **User Growth**: 300% increase in registered users
- **Revenue Growth**: 200% increase in premium subscriptions
- **Market Expansion**: Launched in 15+ countries
- **Educational Impact**: Over 500,000 learners achieved conversational fluency

This language learning mini program successfully demonstrates how AI-powered features and gamification can create engaging and effective language learning experiences.