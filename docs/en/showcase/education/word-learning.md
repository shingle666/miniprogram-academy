# Word Learning Mini Program

An intelligent vocabulary learning platform that combines spaced repetition algorithms, gamification elements, AI-powered personalization, and multimedia content to create an engaging and effective word learning experience for language learners of all levels.

## Overview

The Word Learning mini program leverages cognitive science principles and modern technology to optimize vocabulary acquisition. Through adaptive learning algorithms, interactive exercises, and comprehensive progress tracking, the platform helps users build and retain vocabulary efficiently while maintaining high engagement levels.

## Key Features

### Adaptive Learning System
- **Spaced Repetition Algorithm**: Scientifically-proven intervals for optimal memory retention
- **Difficulty Adjustment**: Dynamic difficulty scaling based on user performance
- **Personalized Learning Paths**: AI-curated vocabulary sets based on proficiency and goals
- **Contextual Learning**: Words presented in meaningful contexts and real-world scenarios
- **Multi-Modal Learning**: Visual, auditory, and kinesthetic learning approaches

### Comprehensive Word Database
- **Multi-Language Support**: Extensive dictionaries for major world languages
- **Pronunciation Guides**: Native speaker audio with phonetic transcriptions
- **Etymology and Origins**: Word history and linguistic connections
- **Usage Examples**: Real-world sentences and contextual applications
- **Frequency Rankings**: Words prioritized by usage frequency and importance

### Gamification and Engagement
- **Achievement System**: Badges, streaks, and milestone rewards
- **Leaderboards**: Social competition with friends and global users
- **Daily Challenges**: Varied exercises to maintain engagement
- **Story Mode**: Vocabulary learning through interactive narratives
- **Mini-Games**: Fun activities that reinforce learning

## Technical Implementation

### Application Architecture
```javascript
// Main application structure
App({
  globalData: {
    userProfile: null,
    learningEngine: null,
    wordDatabase: null,
    progressTracker: null,
    gamificationSystem: null,
    currentSession: null,
    userPreferences: {
      targetLanguage: 'english',
      nativeLanguage: 'chinese',
      dailyGoal: 20,
      difficultyLevel: 'intermediate',
      learningMode: 'adaptive'
    }
  },
  
  onLaunch() {
    this.initializeWordLearning()
  },
  
  async initializeWordLearning() {
    // Load user profile and preferences
    await this.loadUserProfile()
    
    // Initialize learning engine
    await this.initializeLearningEngine()
    
    // Load word database
    await this.loadWordDatabase()
    
    // Initialize progress tracking
    this.initializeProgressTracking()
    
    // Setup gamification system
    this.initializeGamification()
    
    // Load daily session
    await this.loadDailySession()
  },
  
  async initializeLearningEngine() {
    this.globalData.learningEngine = new AdaptiveLearningEngine({
      algorithm: 'sm2_plus', // SuperMemo 2 Plus
      initialInterval: 1,
      easeFactor: 2.5,
      intervalModifier: 1.0,
      maxInterval: 365
    })
    
    await this.globalData.learningEngine.initialize()
  },
  
  async loadWordDatabase() {
    this.globalData.wordDatabase = new WordDatabase({
      targetLanguage: this.globalData.userPreferences.targetLanguage,
      nativeLanguage: this.globalData.userPreferences.nativeLanguage
    })
    
    await this.globalData.wordDatabase.loadDictionary()
  },
  
  initializeProgressTracking() {
    this.globalData.progressTracker = new ProgressTracker({
      userId: this.getUserId(),
      trackingInterval: 'daily',
      metricsEnabled: true
    })
  },
  
  initializeGamification() {
    this.globalData.gamificationSystem = new GamificationSystem({
      achievementSystem: true,
      leaderboards: true,
      streakTracking: true,
      pointsSystem: true
    })
  }
})
```

### Adaptive Learning Engine
```javascript
class AdaptiveLearningEngine {
  constructor(config) {
    this.config = config
    this.userCards = new Map() // Spaced repetition cards
    this.learningQueue = []
    this.reviewQueue = []
    this.sessionStats = {
      wordsLearned: 0,
      wordsReviewed: 0,
      accuracy: 0,
      timeSpent: 0
    }
  }
  
  async initialize() {
    // Load user's learning data
    await this.loadUserCards()
    
    // Generate today's learning queue
    await this.generateLearningQueue()
    
    // Generate review queue
    await this.generateReviewQueue()
  }
  
  async loadUserCards() {
    try {
      const savedCards = await wx.getStorage({
        key: 'userLearningCards'
      })
      
      if (savedCards.data) {
        savedCards.data.forEach(cardData => {
          const card = new LearningCard(cardData)
          this.userCards.set(card.wordId, card)
        })
      }
    } catch (error) {
      console.log('No saved learning cards found')
    }
  }
  
  async generateLearningQueue() {
    const userLevel = await this.assessUserLevel()
    const dailyGoal = this.getUserDailyGoal()
    
    // Get new words based on user level and preferences
    const newWords = await this.selectNewWords(userLevel, dailyGoal)
    
    this.learningQueue = newWords.map(word => ({
      word,
      type: 'new',
      priority: this.calculatePriority(word)
    }))
    
    // Sort by priority
    this.learningQueue.sort((a, b) => b.priority - a.priority)
  }
  
  async generateReviewQueue() {
    const now = Date.now()
    const reviewCards = []
    
    this.userCards.forEach(card => {
      if (card.nextReviewDate <= now) {
        reviewCards.push({
          word: card.word,
          card: card,
          type: 'review',
          priority: this.calculateReviewPriority(card)
        })
      }
    })
    
    // Sort by priority (overdue cards first)
    this.reviewQueue = reviewCards.sort((a, b) => b.priority - a.priority)
  }
  
  getNextWord() {
    // Prioritize reviews over new words
    if (this.reviewQueue.length > 0) {
      return this.reviewQueue.shift()
    }
    
    if (this.learningQueue.length > 0) {
      return this.learningQueue.shift()
    }
    
    return null
  }
  
  processAnswer(wordItem, userAnswer, responseTime) {
    const isCorrect = this.evaluateAnswer(wordItem.word, userAnswer)
    const difficulty = this.calculateDifficulty(responseTime, isCorrect)
    
    if (wordItem.type === 'new') {
      // Create new learning card
      const card = new LearningCard({
        wordId: wordItem.word.id,
        word: wordItem.word,
        easeFactor: this.config.easeFactor,
        interval: this.config.initialInterval,
        repetitions: 0
      })
      
      this.updateCard(card, isCorrect, difficulty)
      this.userCards.set(card.wordId, card)
      this.sessionStats.wordsLearned++
    } else {
      // Update existing card
      this.updateCard(wordItem.card, isCorrect, difficulty)
      this.sessionStats.wordsReviewed++
    }
    
    // Update session statistics
    this.updateSessionStats(isCorrect, responseTime)
    
    return {
      correct: isCorrect,
      difficulty: difficulty,
      nextReview: wordItem.card ? wordItem.card.nextReviewDate : null
    }
  }
  
  updateCard(card, isCorrect, difficulty) {
    if (isCorrect) {
      if (card.repetitions === 0) {
        card.interval = 1
      } else if (card.repetitions === 1) {
        card.interval = 6
      } else {
        card.interval = Math.round(card.interval * card.easeFactor)
      }
      
      card.repetitions++
    } else {
      card.repetitions = 0
      card.interval = 1
    }
    
    // Adjust ease factor based on difficulty
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)))
    
    // Set next review date
    card.nextReviewDate = Date.now() + (card.interval * 24 * 60 * 60 * 1000)
    card.lastReviewed = Date.now()
    
    // Save updated card
    this.saveUserCards()
  }
  
  evaluateAnswer(word, userAnswer) {
    // Implement fuzzy matching for typos and variations
    const correctAnswers = [
      word.translation,
      ...word.alternativeTranslations || [],
      ...word.synonyms || []
    ]
    
    return correctAnswers.some(answer => 
      this.fuzzyMatch(userAnswer.toLowerCase().trim(), answer.toLowerCase())
    )
  }
  
  fuzzyMatch(input, target) {
    // Simple Levenshtein distance for typo tolerance
    const distance = this.levenshteinDistance(input, target)
    const tolerance = Math.floor(target.length * 0.2) // 20% tolerance
    
    return distance <= tolerance
  }
  
  levenshteinDistance(str1, str2) {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }
  
  calculateDifficulty(responseTime, isCorrect) {
    // Calculate difficulty based on response time and correctness
    let difficulty = 3 // Default difficulty
    
    if (isCorrect) {
      if (responseTime < 3000) { // Less than 3 seconds
        difficulty = 5 // Very easy
      } else if (responseTime < 8000) { // Less than 8 seconds
        difficulty = 4 // Easy
      } else {
        difficulty = 3 // Normal
      }
    } else {
      difficulty = 1 // Hard
    }
    
    return difficulty
  }
  
  async selectNewWords(userLevel, count) {
    const wordDatabase = getApp().globalData.wordDatabase
    
    const criteria = {
      level: userLevel,
      frequency: 'high',
      exclude: Array.from(this.userCards.keys())
    }
    
    return await wordDatabase.getWords(criteria, count)
  }
  
  async assessUserLevel() {
    // Assess user level based on known words and performance
    const knownWords = this.userCards.size
    const averageEaseFactor = this.calculateAverageEaseFactor()
    
    if (knownWords < 100) return 'beginner'
    if (knownWords < 500) return 'elementary'
    if (knownWords < 1500) return 'intermediate'
    if (knownWords < 3000) return 'upper-intermediate'
    return 'advanced'
  }
  
  generateSessionSummary() {
    return {
      wordsLearned: this.sessionStats.wordsLearned,
      wordsReviewed: this.sessionStats.wordsReviewed,
      accuracy: this.sessionStats.accuracy,
      timeSpent: this.sessionStats.timeSpent,
      streakMaintained: this.checkStreakMaintained(),
      nextReviewCount: this.getNextReviewCount(),
      recommendations: this.generateRecommendations()
    }
  }
}
```

### Word Database
```javascript
class WordDatabase {
  constructor(config) {
    this.config = config
    this.dictionary = new Map()
    this.frequencyList = []
    this.categories = new Map()
    this.etymology = new Map()
  }
  
  async loadDictionary() {
    try {
      // Load main dictionary
      const dictionaryData = await this.fetchDictionary()
      
      dictionaryData.forEach(wordData => {
        const word = new Word(wordData)
        this.dictionary.set(word.id, word)
      })
      
      // Load frequency data
      await this.loadFrequencyData()
      
      // Load categories
      await this.loadCategories()
      
      // Load etymology data
      await this.loadEtymology()
      
    } catch (error) {
      console.error('Failed to load dictionary:', error)
      throw error
    }
  }
  
  async fetchDictionary() {
    const response = await wx.request({
      url: `https://api.wordlearning.com/dictionary/${this.config.targetLanguage}`,
      data: {
        nativeLanguage: this.config.nativeLanguage,
        includeAudio: true,
        includeExamples: true
      }
    })
    
    return response.data
  }
  
  async getWords(criteria, count = 20) {
    let filteredWords = Array.from(this.dictionary.values())
    
    // Apply filters
    if (criteria.level) {
      filteredWords = filteredWords.filter(word => word.level === criteria.level)
    }
    
    if (criteria.category) {
      filteredWords = filteredWords.filter(word => word.categories.includes(criteria.category))
    }
    
    if (criteria.frequency) {
      filteredWords = this.filterByFrequency(filteredWords, criteria.frequency)
    }
    
    if (criteria.exclude) {
      filteredWords = filteredWords.filter(word => !criteria.exclude.includes(word.id))
    }
    
    // Sort by priority
    filteredWords.sort((a, b) => this.calculateWordPriority(b) - this.calculateWordPriority(a))
    
    return filteredWords.slice(0, count)
  }
  
  filterByFrequency(words, frequency) {
    const frequencyRanges = {
      'very-high': [1, 100],
      'high': [1, 1000],
      'medium': [1000, 5000],
      'low': [5000, 10000],
      'very-low': [10000, Infinity]
    }
    
    const range = frequencyRanges[frequency] || frequencyRanges['medium']
    
    return words.filter(word => {
      const rank = word.frequencyRank || Infinity
      return rank >= range[0] && rank <= range[1]
    })
  }
  
  calculateWordPriority(word) {
    let priority = 0
    
    // Frequency priority (higher frequency = higher priority)
    if (word.frequencyRank) {
      priority += Math.max(0, 10000 - word.frequencyRank) / 1000
    }
    
    // Usefulness score
    priority += word.usefulnessScore || 0
    
    // Difficulty adjustment (slightly prefer easier words for beginners)
    if (word.difficulty) {
      priority += (6 - word.difficulty) * 0.1
    }
    
    return priority
  }
  
  getWordById(wordId) {
    return this.dictionary.get(wordId)
  }
  
  searchWords(query, limit = 10) {
    const results = []
    const queryLower = query.toLowerCase()
    
    this.dictionary.forEach(word => {
      if (word.word.toLowerCase().includes(queryLower) ||
          word.translation.toLowerCase().includes(queryLower)) {
        results.push({
          word: word,
          relevance: this.calculateRelevance(word, queryLower)
        })
      }
    })
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)
    
    return results.slice(0, limit).map(result => result.word)
  }
  
  calculateRelevance(word, query) {
    let relevance = 0
    
    // Exact match bonus
    if (word.word.toLowerCase() === query) {
      relevance += 100
    } else if (word.word.toLowerCase().startsWith(query)) {
      relevance += 50
    } else if (word.word.toLowerCase().includes(query)) {
      relevance += 25
    }
    
    // Translation match
    if (word.translation.toLowerCase().includes(query)) {
      relevance += 20
    }
    
    // Frequency bonus
    if (word.frequencyRank && word.frequencyRank <= 1000) {
      relevance += 10
    }
    
    return relevance
  }
}

class Word {
  constructor(data) {
    this.id = data.id
    this.word = data.word
    this.translation = data.translation
    this.alternativeTranslations = data.alternativeTranslations || []
    this.pronunciation = data.pronunciation
    this.audioUrl = data.audioUrl
    this.partOfSpeech = data.partOfSpeech
    this.level = data.level
    this.frequencyRank = data.frequencyRank
    this.usefulnessScore = data.usefulnessScore
    this.difficulty = data.difficulty
    this.categories = data.categories || []
    this.examples = data.examples || []
    this.synonyms = data.synonyms || []
    this.antonyms = data.antonyms || []
    this.etymology = data.etymology
    this.imageUrl = data.imageUrl
  }
}

class LearningCard {
  constructor(data) {
    this.wordId = data.wordId
    this.word = data.word
    this.easeFactor = data.easeFactor || 2.5
    this.interval = data.interval || 1
    this.repetitions = data.repetitions || 0
    this.nextReviewDate = data.nextReviewDate || Date.now()
    this.lastReviewed = data.lastReviewed || null
    this.createdAt = data.createdAt || Date.now()
    this.totalReviews = data.totalReviews || 0
    this.correctAnswers = data.correctAnswers || 0
  }
  
  get accuracy() {
    return this.totalReviews > 0 ? (this.correctAnswers / this.totalReviews) * 100 : 0
  }
  
  get isOverdue() {
    return Date.now() > this.nextReviewDate
  }
  
  get daysSinceLastReview() {
    if (!this.lastReviewed) return 0
    return Math.floor((Date.now() - this.lastReviewed) / (24 * 60 * 60 * 1000))
  }
}
```

### Gamification System
```javascript
class GamificationSystem {
  constructor(config) {
    this.config = config
    this.userStats = {
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      wordsLearned: 0,
      totalSessions: 0,
      achievements: new Set()
    }
    
    this.achievements = this.initializeAchievements()
    this.pointsSystem = this.initializePointsSystem()
  }
  
  initializeAchievements() {
    return [
      {
        id: 'first_word',
        name: 'First Steps',
        description: 'Learn your first word',
        icon: 'first_word',
        condition: (stats) => stats.wordsLearned >= 1,
        points: 10
      },
      {
        id: 'week_streak',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: 'streak_7',
        condition: (stats) => stats.currentStreak >= 7,
        points: 100
      },
      {
        id: 'hundred_words',
        name: 'Vocabulary Builder',
        description: 'Learn 100 words',
        icon: 'words_100',
        condition: (stats) => stats.wordsLearned >= 100,
        points: 500
      },
      {
        id: 'perfect_session',
        name: 'Perfectionist',
        description: 'Complete a session with 100% accuracy',
        icon: 'perfect',
        condition: (stats) => stats.lastSessionAccuracy === 100,
        points: 50
      },
      {
        id: 'speed_learner',
        name: 'Speed Learner',
        description: 'Answer 10 words correctly in under 30 seconds',
        icon: 'speed',
        condition: (stats) => stats.fastestTenWords <= 30000,
        points: 75
      }
    ]
  }
  
  initializePointsSystem() {
    return {
      correctAnswer: 10,
      newWordLearned: 25,
      perfectSession: 50,
      dailyGoalMet: 100,
      streakBonus: (streak) => Math.min(streak * 5, 100),
      speedBonus: (time) => Math.max(0, 20 - Math.floor(time / 1000))
    }
  }
  
  awardPoints(action, context = {}) {
    let points = 0
    
    switch (action) {
      case 'correct_answer':
        points = this.pointsSystem.correctAnswer
        if (context.responseTime < 5000) {
          points += this.pointsSystem.speedBonus(context.responseTime)
        }
        break
        
      case 'new_word_learned':
        points = this.pointsSystem.newWordLearned
        this.userStats.wordsLearned++
        break
        
      case 'session_completed':
        if (context.accuracy === 100) {
          points = this.pointsSystem.perfectSession
          this.userStats.lastSessionAccuracy = 100
        }
        
        if (context.dailyGoalMet) {
          points += this.pointsSystem.dailyGoalMet
        }
        
        points += this.pointsSystem.streakBonus(this.userStats.currentStreak)
        this.userStats.totalSessions++
        break
    }
    
    this.userStats.totalPoints += points
    this.checkAchievements()
    
    return {
      pointsAwarded: points,
      totalPoints: this.userStats.totalPoints,
      newAchievements: this.getNewAchievements()
    }
  }
  
  updateStreak(sessionCompleted) {
    const today = new Date().toDateString()
    const lastSession = this.getLastSessionDate()
    
    if (sessionCompleted) {
      if (lastSession !== today) {
        this.userStats.currentStreak++
        this.userStats.longestStreak = Math.max(
          this.userStats.longestStreak,
          this.userStats.currentStreak
        )
        this.setLastSessionDate(today)
      }
    } else {
      // Check if streak should be broken
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      if (lastSession !== today && lastSession !== yesterday) {
        this.userStats.currentStreak = 0
      }
    }
    
    this.checkAchievements()
  }
  
  checkAchievements() {
    const newAchievements = []
    
    this.achievements.forEach(achievement => {
      if (!this.userStats.achievements.has(achievement.id) &&
          achievement.condition(this.userStats)) {
        this.userStats.achievements.add(achievement.id)
        this.userStats.totalPoints += achievement.points
        newAchievements.push(achievement)
      }
    })
    
    if (newAchievements.length > 0) {
      this.showAchievementNotifications(newAchievements)
    }
    
    return newAchievements
  }
  
  showAchievementNotifications(achievements) {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        wx.showToast({
          title: `Achievement Unlocked: ${achievement.name}`,
          icon: 'success',
          duration: 3000
        })
      }, index * 1000)
    })
  }
  
  getLeaderboardData() {
    return {
      userRank: this.calculateUserRank(),
      userPoints: this.userStats.totalPoints,
      userStreak: this.userStats.currentStreak,
      topUsers: this.getTopUsers(),
      friends: this.getFriendsRanking()
    }
  }
  
  getDailyChallenge() {
    const challenges = [
      {
        id: 'speed_round',
        name: 'Speed Round',
        description: 'Answer 20 words in under 2 minutes',
        reward: 200,
        type: 'speed'
      },
      {
        id: 'perfect_streak',
        name: 'Perfect Streak',
        description: 'Get 15 answers correct in a row',
        reward: 150,
        type: 'accuracy'
      },
      {
        id: 'category_master',
        name: 'Category Master',
        description: 'Learn 10 words from the same category',
        reward: 100,
        type: 'category'
      }
    ]
    
    // Select challenge based on user preferences and history
    const today = new Date().toDateString()
    const challengeIndex = this.hashString(today + this.getUserId()) % challenges.length
    
    return challenges[challengeIndex]
  }
}
```

### User Interface Components

#### Learning Session Interface
```xml
<view class="word-learning-session">
  <view class="session-header">
    <view class="progress-info">
      <view class="progress-bar">
        <view class="progress-fill" style="width: {{sessionProgress}}%"></view>
      </view>
      <text class="progress-text">{{currentWordIndex + 1}} / {{totalWords}}</text>
    </view>
    
    <view class="session-stats">
      <view class="stat-item">
        <icon type="target" />
        <text class="stat-value">{{correctAnswers}}/{{totalAnswered}}</text>
      </view>
      <view class="stat-item">
        <icon type="time" />
        <text class="stat-value">{{formatTime(sessionTime)}}</text>
      </view>
      <view class="stat-item">
        <icon type="streak" />
        <text class="stat-value">{{currentStreak}}</text>
      </view>
    </view>
  </view>
  
  <view class="word-card">
    <view class="word-content">
      <!-- Word Display -->
      <view class="word-display" wx:if="{{exerciseType === 'translation'}}">
        <text class="word-text">{{currentWord.word}}</text>
        <button class="pronunciation-btn" bindtap="playPronunciation">
          <icon type="volume" />
        </button>
        
        <view class="word-details">
          <text class="part-of-speech">{{currentWord.partOfSpeech}}</text>
          <text class="phonetic">{{currentWord.pronunciation}}</text>
        </view>
        
        <view class="word-image" wx:if="{{currentWord.imageUrl}}">
          <image src="{{currentWord.imageUrl}}" mode="aspectFit" />
        </view>
      </view>
      
      <!-- Translation Display -->
      <view class="translation-display" wx:if="{{exerciseType === 'reverse_translation'}}">
        <text class="translation-text">{{currentWord.translation}}</text>
        
        <view class="context-hint" wx:if="{{showContext}}">
          <text class="context-label">Context:</text>
          <text class="context-text">{{currentWord.examples[0]}}</text>
        </view>
      </view>
      
      <!-- Multiple Choice -->
      <view class="multiple-choice" wx:if="{{exerciseType === 'multiple_choice'}}">
        <text class="question-text">What does "{{currentWord.word}}" mean?</text>
        
        <view class="choice-options">
          <button class="choice-option {{selectedChoice === item.id ? 'selected' : ''}}" 
                  wx:for="{{choiceOptions}}" 
                  wx:key="id"
                  bindtap="selectChoice"
                  data-choice="{{item.id}}">
            <text class="choice-text">{{item.text}}</text>
          </button>
        </view>
      </view>
      
      <!-- Listening Exercise -->
      <view class="listening-exercise" wx:if="{{exerciseType === 'listening'}}">
        <view class="audio-player">
          <button class="play-btn" bindtap="playAudio">
            <icon type="{{isPlaying ? 'pause' : 'play'}}" size="32" />
          </button>
          <text class="play-instruction">Listen and type what you hear</text>
        </view>
        
        <button class="replay-btn" bindtap="replayAudio">
          <icon type="replay" />
          <text>Play Again</text>
        </button>
      </view>
    </view>
    
    <!-- Answer Input -->
    <view class="answer-section">
      <view class="text-input" wx:if="{{exerciseType === 'translation' || exerciseType === 'reverse_translation' || exerciseType === 'listening'}}">
        <input class="answer-input" 
               placeholder="Type your answer..."
               value="{{userAnswer}}"
               bindinput="onAnswerInput"
               bindconfirm="submitAnswer"
               focus="{{inputFocused}}" />
        
        <button class="submit-btn" 
                bindtap="submitAnswer"
                disabled="{{!userAnswer.trim()}}">
          <icon type="check" />
        </button>
      </view>
      
      <view class="choice-submit" wx:if="{{exerciseType === 'multiple_choice'}}">
        <button class="submit-choice-btn" 
                bindtap="submitChoice"
                disabled="{{selectedChoice === null}}">
          Submit Answer
        </button>
      </view>
    </view>
    
    <!-- Hints and Help -->
    <view class="help-section">
      <button class="hint-btn" 
              bindtap="showHint"
              disabled="{{hintsUsed >= maxHints}}">
        <icon type="hint" />
        <text>Hint ({{hintsUsed}}/{{maxHints}})</text>
      </button>
      
      <button class="skip-btn" bindtap="skipWord">
        <icon type="skip" />
        <text>Skip</text>
      </button>
    </view>
  </view>
  
  <!-- Feedback Modal -->
  <view class="feedback-modal" wx:if="{{showFeedback}}">
    <view class="feedback-content">
      <view class="feedback-header">
        <icon type="{{feedbackType === 'correct' ? 'check-circle' : 'x-circle'}}" 
              class="feedback-icon {{feedbackType}}" />
        <text class="feedback-title">{{feedbackType === 'correct' ? 'Correct!' : 'Incorrect'}}</text>
      </view>
      
      <view class="feedback-details">
        <view class="correct-answer" wx:if="{{feedbackType === 'incorrect'}}">
          <text class="answer-label">Correct answer:</text>
          <text class="answer-text">{{currentWord.translation}}</text>
        </view>
        
        <view class="word-info">
          <text class="word-pronunciation">{{currentWord.pronunciation}}</text>
          <button class="pronunciation-btn" bindtap="playPronunciation">
            <icon type="volume" />
          </button>
        </view>
        
        <view class="example-sentence" wx:if="{{currentWord.examples.length > 0}}">
          <text class="example-label">Example:</text>
          <text class="example-text">{{currentWord.examples[0]}}</text>
        </view>
        
        <view class="points-awarded" wx:if="{{pointsAwarded > 0}}">
          <icon type="star" />
          <text class="points-text">+{{pointsAwarded}} points</text>
        </view>
      </view>
      
      <button class="continue-btn" bindtap="continueSession">
        Continue
      </button>
    </view>
  </view>
  
  <!-- Session Controls -->
  <view class="session-controls">
    <button class="control-btn" bindtap="pauseSession">
      <icon type="pause" />
      <text>Pause</text>
    </button>
    
    <button class="control-btn" bindtap="endSession">
      <icon type="stop" />
      <text>End Session</text>
    </button>
  </view>
</view>
```

#### Progress Dashboard
```xml
<view class="progress-dashboard">
  <view class="dashboard-header">
    <view class="user-level">
      <text class="level-title">{{userLevel}}</text>
      <view class="level-progress">
        <view class="level-bar">
          <view class="level-fill" style="width: {{levelProgress}}%"></view>
        </view>
        <text class="level-text">{{wordsToNextLevel}} words to next level</text>
      </view>
    </view>
    
    <view class="streak-info">
      <icon type="fire" class="streak-icon" />
      <text class="streak-number">{{currentStreak}}</text>
      <text class="streak-label">day streak</text>
    </view>
  </view>
  
  <view class="stats-grid">
    <view class="stat-card">
      <icon type="book" class="stat-icon" />
      <text class="stat-number">{{totalWordsLearned}}</text>
      <text class="stat-label">Words Learned</text>
    </view>
    
    <view class="stat-card">
      <icon type="target" class="stat-icon" />
      <text class="stat-number">{{overallAccuracy}}%</text>
      <text class="stat-label">Accuracy</text>
    </view>
    
    <view class="stat-card">
      <icon type="time" class="stat-icon" />
      <text class="stat-number">{{totalStudyTime}}</text>
      <text class="stat-label">Study Time</text>
    </view>
    
    <view class="stat-card">
      <icon type="star" class="stat-icon" />
      <text class="stat-number">{{totalPoints}}</text>
      <text class="stat-label">Points</text>
    </view>
  </view>
  
  <view class="progress-charts">
    <view class="chart-section">
      <text class="chart-title">Learning Progress</text>
      <canvas canvas-id="progressChart" class="progress-chart"></canvas>
    </view>
    
    <view class="chart-section">
      <text class="chart-title">Accuracy Trend</text>
      <canvas canvas-id="accuracyChart" class="accuracy-chart"></canvas>
    </view>
  </view>
  
  <view class="review-schedule">
    <text class="schedule-title">Review Schedule</text>
    <view class="review-items">
      <view class="review-item" wx:for="{{reviewSchedule}}" wx:key="date">
        <text class="review-date">{{formatDate(item.date)}}</text>
        <text class="review-count">{{item.count}} words</text>
        <view class="review-difficulty {{item.difficulty}}">
          <text class="difficulty-text">{{item.difficulty}}</text>
        </view>
      </view>
    </view>
  </view>
  
  <view class="achievements-section">
    <text class="achievements-title">Recent Achievements</text>
    <scroll-view class="achievements-scroll" scroll-x="true">
      <view class="achievement-item" wx:for="{{recentAchievements}}" wx:key="id">
        <image class="achievement-icon" src="{{item.icon}}" />
        <text class="achievement-name">{{item.name}}</text>
        <text class="achievement-date">{{formatDate(item.unlockedAt)}}</text>
      </view>
    </scroll-view>
  </view>
</view>
```

## Analytics and Insights

### Learning Analytics
```javascript
class LearningAnalytics {
  constructor() {
    this.sessionData = []
    this.wordPerformance = new Map()
    this.learningPatterns = {
      optimalSessionLength: 0,
      bestTimeOfDay: null,
      difficultyPreference: null,
      retentionRate: 0
    }
  }
  
  trackSession(sessionData) {
    this.sessionData.push({
      ...sessionData,
      timestamp: Date.now()
    })
    
    this.updateWordPerformance(sessionData.words)
    this.analyzeLearningPatterns()
  }
  
  updateWordPerformance(words) {
    words.forEach(wordResult => {
      const wordId = wordResult.wordId
      
      if (!this.wordPerformance.has(wordId)) {
        this.wordPerformance.set(wordId, {
          attempts: 0,
          correct: 0,
          averageResponseTime: 0,
          lastSeen: null,
          difficulty: 'medium'
        })
      }
      
      const performance = this.wordPerformance.get(wordId)
      performance.attempts++
      
      if (wordResult.correct) {
        performance.correct++
      }
      
      performance.averageResponseTime = (
        (performance.averageResponseTime * (performance.attempts - 1) + wordResult.responseTime) /
        performance.attempts
      )
      
      performance.lastSeen = Date.now()
      performance.difficulty = this.calculateWordDifficulty(performance)
    })
  }
  
  generateInsights() {
    return {
      learningVelocity: this.calculateLearningVelocity(),
      retentionRate: this.calculateRetentionRate(),
      optimalSessionLength: this.findOptimalSessionLength(),
      weakAreas: this.identifyWeakAreas(),
      recommendations: this.generateRecommendations()
    }
  }
  
  calculateLearningVelocity() {
    const recentSessions = this.sessionData.slice(-7) // Last 7 sessions
    const totalWords = recentSessions.reduce((sum, session) => sum + session.newWords, 0)
    const totalTime = recentSessions.reduce((sum, session) => sum + session.duration, 0)
    
    return totalTime > 0 ? (totalWords / totalTime) * 3600000 : 0 // Words per hour
  }
  
  calculateRetentionRate() {
    const reviewedWords = Array.from(this.wordPerformance.values())
      .filter(word => word.attempts > 1)
    
    if (reviewedWords.length === 0) return 0
    
    const retainedWords = reviewedWords.filter(word => word.correct / word.attempts >= 0.7)
    
    return (retainedWords.length / reviewedWords.length) * 100
  }
}
```

## Conclusion

The Word Learning mini program demonstrates how modern technology can enhance vocabulary acquisition through scientifically-proven learning methods, engaging gamification, and personalized experiences. By combining spaced repetition algorithms, adaptive difficulty, and comprehensive analytics, the platform creates an effective and enjoyable learning environment.

Key success factors include:
- **Scientific Learning Methods**: Spaced repetition and adaptive algorithms
- **Comprehensive Content**: Rich word database with multimedia support
- **Engaging Gamification**: Points, achievements, and social features
- **Personalized Experience**: AI-driven content and difficulty adaptation
- **Progress Tracking**: Detailed analytics and insights

This implementation showcases how mini programs can deliver sophisticated educational experiences while maintaining simplicity and accessibility for learners of all levels.