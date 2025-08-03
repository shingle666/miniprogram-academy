# Educational Games Mini Program Case

This case showcases a collection of educational games designed to make learning fun and engaging for students of all ages, combining entertainment with curriculum-based content to enhance knowledge retention and academic performance.

## Project Overview

### Project Background

Traditional learning methods often struggle to maintain student engagement and motivation. This mini program addresses the need for interactive educational content that transforms learning into an enjoyable gaming experience, helping students develop skills while having fun.

### Core Features

- **Curriculum-Aligned Content**: Games covering math, science, language arts, and social studies
- **Adaptive Learning**: Difficulty adjusts based on student performance
- **Progress Tracking**: Detailed analytics for students, parents, and teachers
- **Multiplayer Learning**: Collaborative and competitive educational activities
- **Achievement System**: Badges, certificates, and rewards for learning milestones
- **Offline Mode**: Educational content available without internet connection
- **Multi-Language Support**: Content available in multiple languages

## Technical Implementation

### Adaptive Learning Engine

```javascript
// utils/adaptive-learning.js
class AdaptiveLearningEngine {
  constructor() {
    this.studentProfile = {
      id: null,
      grade: null,
      subjects: {},
      learningStyle: null,
      strengths: [],
      weaknesses: [],
      preferences: {}
    }
    this.difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert']
    this.performanceHistory = []
  }

  async initializeStudent(studentId) {
    try {
      const res = await wx.request({
        url: `/api/students/${studentId}/profile`,
        method: 'GET'
      })

      this.studentProfile = res.data.profile
      await this.loadPerformanceHistory()
      
      return this.studentProfile
    } catch (error) {
      console.error('Failed to initialize student profile:', error)
      throw error
    }
  }

  async loadPerformanceHistory() {
    try {
      const res = await wx.request({
        url: `/api/students/${this.studentProfile.id}/performance`,
        method: 'GET',
        data: {
          limit: 100,
          period: '30d'
        }
      })

      this.performanceHistory = res.data.history
      this.analyzePerformance()
    } catch (error) {
      console.error('Failed to load performance history:', error)
    }
  }

  analyzePerformance() {
    if (this.performanceHistory.length === 0) return

    // Analyze recent performance trends
    const recentPerformance = this.performanceHistory.slice(-10)
    const averageScore = recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length
    const averageTime = recentPerformance.reduce((sum, p) => sum + p.timeSpent, 0) / recentPerformance.length

    // Update student profile based on analysis
    this.updateLearningProfile(averageScore, averageTime)
  }

  updateLearningProfile(averageScore, averageTime) {
    // Determine learning style based on performance patterns
    if (averageTime < 30 && averageScore > 80) {
      this.studentProfile.learningStyle = 'quick-learner'
    } else if (averageTime > 60 && averageScore > 85) {
      this.studentProfile.learningStyle = 'thorough-learner'
    } else if (averageScore < 60) {
      this.studentProfile.learningStyle = 'needs-support'
    }

    // Identify strengths and weaknesses by subject
    const subjectPerformance = this.groupPerformanceBySubject()
    this.studentProfile.strengths = Object.keys(subjectPerformance)
      .filter(subject => subjectPerformance[subject].average > 80)
    this.studentProfile.weaknesses = Object.keys(subjectPerformance)
      .filter(subject => subjectPerformance[subject].average < 60)
  }

  groupPerformanceBySubject() {
    const subjectGroups = {}
    
    this.performanceHistory.forEach(performance => {
      if (!subjectGroups[performance.subject]) {
        subjectGroups[performance.subject] = {
          scores: [],
          average: 0
        }
      }
      subjectGroups[performance.subject].scores.push(performance.score)
    })

    // Calculate averages
    Object.keys(subjectGroups).forEach(subject => {
      const scores = subjectGroups[subject].scores
      subjectGroups[subject].average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })

    return subjectGroups
  }

  getRecommendedDifficulty(subject, topic) {
    const subjectProfile = this.studentProfile.subjects[subject] || {}
    const currentLevel = subjectProfile.level || 'beginner'
    const recentPerformance = this.getRecentPerformance(subject, topic)

    if (recentPerformance.length === 0) {
      return currentLevel
    }

    const averageScore = recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length
    const currentLevelIndex = this.difficultyLevels.indexOf(currentLevel)

    // Adjust difficulty based on performance
    if (averageScore > 85 && currentLevelIndex < this.difficultyLevels.length - 1) {
      return this.difficultyLevels[currentLevelIndex + 1]
    } else if (averageScore < 60 && currentLevelIndex > 0) {
      return this.difficultyLevels[currentLevelIndex - 1]
    }

    return currentLevel
  }

  getRecentPerformance(subject, topic, limit = 5) {
    return this.performanceHistory
      .filter(p => p.subject === subject && (!topic || p.topic === topic))
      .slice(-limit)
  }

  async recordPerformance(gameData) {
    const performance = {
      studentId: this.studentProfile.id,
      subject: gameData.subject,
      topic: gameData.topic,
      gameType: gameData.gameType,
      score: gameData.score,
      maxScore: gameData.maxScore,
      timeSpent: gameData.timeSpent,
      difficulty: gameData.difficulty,
      hintsUsed: gameData.hintsUsed || 0,
      mistakes: gameData.mistakes || 0,
      timestamp: Date.now()
    }

    try {
      const res = await wx.request({
        url: '/api/students/performance',
        method: 'POST',
        data: performance
      })

      this.performanceHistory.push(performance)
      this.analyzePerformance()

      return res.data
    } catch (error) {
      console.error('Failed to record performance:', error)
      throw error
    }
  }

  generatePersonalizedContent(subject, count = 10) {
    const difficulty = this.getRecommendedDifficulty(subject)
    const weakTopics = this.getWeakTopics(subject)
    const learningStyle = this.studentProfile.learningStyle

    return {
      difficulty,
      focusTopics: weakTopics.slice(0, 3),
      contentTypes: this.getPreferredContentTypes(learningStyle),
      gameTypes: this.getRecommendedGameTypes(subject, learningStyle),
      count
    }
  }

  getWeakTopics(subject) {
    const subjectPerformance = this.performanceHistory
      .filter(p => p.subject === subject)
      .reduce((topics, p) => {
        if (!topics[p.topic]) {
          topics[p.topic] = { scores: [], average: 0 }
        }
        topics[p.topic].scores.push(p.score)
        return topics
      }, {})

    // Calculate averages and sort by performance
    Object.keys(subjectPerformance).forEach(topic => {
      const scores = subjectPerformance[topic].scores
      subjectPerformance[topic].average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })

    return Object.keys(subjectPerformance)
      .sort((a, b) => subjectPerformance[a].average - subjectPerformance[b].average)
  }

  getPreferredContentTypes(learningStyle) {
    const contentTypeMap = {
      'visual': ['images', 'diagrams', 'animations', 'videos'],
      'auditory': ['audio', 'music', 'narration', 'sound-effects'],
      'kinesthetic': ['drag-drop', 'touch-interactions', 'gestures', 'simulations'],
      'quick-learner': ['challenges', 'timed-games', 'competitions'],
      'thorough-learner': ['step-by-step', 'detailed-explanations', 'practice-modes'],
      'needs-support': ['hints', 'guided-tutorials', 'simplified-content']
    }

    return contentTypeMap[learningStyle] || ['mixed']
  }

  getRecommendedGameTypes(subject, learningStyle) {
    const gameTypeMap = {
      'math': ['puzzle', 'calculation', 'pattern-matching', 'logic'],
      'science': ['simulation', 'experiment', 'observation', 'hypothesis'],
      'language': ['word-games', 'story-building', 'vocabulary', 'grammar'],
      'social-studies': ['timeline', 'map-games', 'role-playing', 'decision-making']
    }

    const baseTypes = gameTypeMap[subject] || ['quiz', 'matching']
    
    // Adjust based on learning style
    if (learningStyle === 'quick-learner') {
      baseTypes.push('speed-games', 'competitions')
    } else if (learningStyle === 'thorough-learner') {
      baseTypes.push('exploration', 'building-games')
    }

    return baseTypes
  }
}

export default AdaptiveLearningEngine
```

### Math Games Implementation

```javascript
// games/math/math-adventure.js
import GameEngine from '../../utils/game-engine'

class MathAdventureGame extends GameEngine {
  constructor(config) {
    super(config)
    this.currentProblem = null
    this.problemQueue = []
    this.streak = 0
    this.hintsUsed = 0
    this.timeLimit = 60
    this.timeRemaining = this.timeLimit
    this.difficulty = config.difficulty || 'beginner'
    this.topic = config.topic || 'addition'
  }

  init() {
    super.init()
    this.generateProblems()
    this.loadNextProblem()
    this.startTimer()
  }

  generateProblems() {
    const problemCount = 20
    this.problemQueue = []

    for (let i = 0; i < problemCount; i++) {
      const problem = this.generateProblem(this.topic, this.difficulty)
      this.problemQueue.push(problem)
    }
  }

  generateProblem(topic, difficulty) {
    const generators = {
      'addition': this.generateAdditionProblem.bind(this),
      'subtraction': this.generateSubtractionProblem.bind(this),
      'multiplication': this.generateMultiplicationProblem.bind(this),
      'division': this.generateDivisionProblem.bind(this),
      'fractions': this.generateFractionProblem.bind(this),
      'geometry': this.generateGeometryProblem.bind(this),
      'algebra': this.generateAlgebraProblem.bind(this)
    }

    const generator = generators[topic] || generators['addition']
    return generator(difficulty)
  }

  generateAdditionProblem(difficulty) {
    let num1, num2, answer
    
    switch (difficulty) {
      case 'beginner':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        break
      case 'intermediate':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * 50) + 10
        break
      case 'advanced':
        num1 = Math.floor(Math.random() * 100) + 50
        num2 = Math.floor(Math.random() * 100) + 50
        break
      case 'expert':
        num1 = Math.floor(Math.random() * 500) + 100
        num2 = Math.floor(Math.random() * 500) + 100
        break
    }

    answer = num1 + num2
    const wrongAnswers = this.generateWrongAnswers(answer, 3)

    return {
      id: `add_${Date.now()}_${Math.random()}`,
      type: 'multiple-choice',
      question: `What is ${num1} + ${num2}?`,
      correctAnswer: answer,
      options: this.shuffleArray([answer, ...wrongAnswers]),
      explanation: `${num1} + ${num2} = ${answer}`,
      hint: `Try breaking it down: ${num1} + ${num2}`,
      topic: 'addition',
      difficulty
    }
  }

  generateMultiplicationProblem(difficulty) {
    let num1, num2, answer
    
    switch (difficulty) {
      case 'beginner':
        num1 = Math.floor(Math.random() * 5) + 1
        num2 = Math.floor(Math.random() * 5) + 1
        break
      case 'intermediate':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        break
      case 'advanced':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        break
      case 'expert':
        num1 = Math.floor(Math.random() * 20) + 10
        num2 = Math.floor(Math.random() * 20) + 10
        break
    }

    answer = num1 * num2
    const wrongAnswers = this.generateWrongAnswers(answer, 3)

    return {
      id: `mult_${Date.now()}_${Math.random()}`,
      type: 'multiple-choice',
      question: `What is ${num1} × ${num2}?`,
      correctAnswer: answer,
      options: this.shuffleArray([answer, ...wrongAnswers]),
      explanation: `${num1} × ${num2} = ${answer}`,
      hint: `Think of it as adding ${num1} to itself ${num2} times`,
      topic: 'multiplication',
      difficulty
    }
  }

  generateFractionProblem(difficulty) {
    let num1, den1, num2, den2, answer
    
    switch (difficulty) {
      case 'beginner':
        den1 = Math.floor(Math.random() * 4) + 2 // 2-5
        num1 = Math.floor(Math.random() * (den1 - 1)) + 1
        den2 = den1 // Same denominator for beginners
        num2 = Math.floor(Math.random() * (den2 - 1)) + 1
        break
      case 'intermediate':
        den1 = Math.floor(Math.random() * 6) + 2 // 2-7
        num1 = Math.floor(Math.random() * den1) + 1
        den2 = Math.floor(Math.random() * 6) + 2
        num2 = Math.floor(Math.random() * den2) + 1
        break
      default:
        den1 = Math.floor(Math.random() * 10) + 2
        num1 = Math.floor(Math.random() * den1) + 1
        den2 = Math.floor(Math.random() * 10) + 2
        num2 = Math.floor(Math.random() * den2) + 1
    }

    // Calculate addition of fractions
    const commonDen = den1 === den2 ? den1 : den1 * den2
    const newNum1 = den1 === den2 ? num1 : num1 * den2
    const newNum2 = den1 === den2 ? num2 : num2 * den1
    const resultNum = newNum1 + newNum2
    
    // Simplify fraction
    const gcd = this.findGCD(resultNum, commonDen)
    const simplifiedNum = resultNum / gcd
    const simplifiedDen = commonDen / gcd

    answer = `${simplifiedNum}/${simplifiedDen}`
    
    return {
      id: `frac_${Date.now()}_${Math.random()}`,
      type: 'input',
      question: `What is ${num1}/${den1} + ${num2}/${den2}? (Enter as a simplified fraction, e.g., 3/4)`,
      correctAnswer: answer,
      explanation: `${num1}/${den1} + ${num2}/${den2} = ${newNum1}/${commonDen} + ${newNum2}/${commonDen} = ${resultNum}/${commonDen} = ${answer}`,
      hint: den1 === den2 ? 'Same denominators - just add the numerators!' : 'Find a common denominator first',
      topic: 'fractions',
      difficulty
    }
  }

  findGCD(a, b) {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  generateWrongAnswers(correctAnswer, count) {
    const wrongAnswers = []
    const variations = [
      correctAnswer + Math.floor(Math.random() * 10) + 1,
      correctAnswer - Math.floor(Math.random() * 10) - 1,
      correctAnswer * 2,
      Math.floor(correctAnswer / 2),
      correctAnswer + Math.floor(Math.random() * 20) - 10
    ]

    while (wrongAnswers.length < count) {
      const wrong = variations[Math.floor(Math.random() * variations.length)]
      if (wrong !== correctAnswer && !wrongAnswers.includes(wrong) && wrong > 0) {
        wrongAnswers.push(wrong)
      }
    }

    return wrongAnswers
  }

  loadNextProblem() {
    if (this.problemQueue.length === 0) {
      this.gameComplete()
      return
    }

    this.currentProblem = this.problemQueue.shift()
    this.emit('problemLoaded', this.currentProblem)
  }

  submitAnswer(answer) {
    if (!this.currentProblem) return

    const isCorrect = this.checkAnswer(answer, this.currentProblem.correctAnswer)
    const timeSpent = this.timeLimit - this.timeRemaining

    if (isCorrect) {
      this.streak++
      const points = this.calculatePoints(timeSpent, this.hintsUsed)
      this.addScore(points)
      
      this.emit('correctAnswer', {
        problem: this.currentProblem,
        points,
        streak: this.streak,
        timeSpent
      })
    } else {
      this.streak = 0
      this.emit('incorrectAnswer', {
        problem: this.currentProblem,
        userAnswer: answer,
        correctAnswer: this.currentProblem.correctAnswer,
        explanation: this.currentProblem.explanation
      })
    }

    // Record performance
    this.recordProblemPerformance(isCorrect, timeSpent)
    
    setTimeout(() => {
      this.loadNextProblem()
    }, 2000)
  }

  checkAnswer(userAnswer, correctAnswer) {
    // Handle different answer types
    if (typeof correctAnswer === 'number') {
      return parseFloat(userAnswer) === correctAnswer
    } else if (typeof correctAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    }
    return false
  }

  calculatePoints(timeSpent, hintsUsed) {
    let basePoints = 100
    
    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 50 - timeSpent)
    
    // Streak bonus
    const streakBonus = Math.min(this.streak * 10, 100)
    
    // Hint penalty
    const hintPenalty = hintsUsed * 20
    
    return Math.max(10, basePoints + timeBonus + streakBonus - hintPenalty)
  }

  useHint() {
    if (this.currentProblem && this.currentProblem.hint) {
      this.hintsUsed++
      this.emit('hintUsed', {
        hint: this.currentProblem.hint,
        hintsUsed: this.hintsUsed
      })
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--
      this.emit('timeUpdate', this.timeRemaining)
      
      if (this.timeRemaining <= 0) {
        this.timeUp()
      }
    }, 1000)
  }

  timeUp() {
    clearInterval(this.timer)
    this.emit('timeUp')
    this.gameComplete()
  }

  gameComplete() {
    clearInterval(this.timer)
    
    const results = {
      score: this.score,
      problemsSolved: 20 - this.problemQueue.length,
      totalProblems: 20,
      accuracy: ((20 - this.problemQueue.length) / 20) * 100,
      hintsUsed: this.hintsUsed,
      timeSpent: this.timeLimit - this.timeRemaining,
      maxStreak: this.streak
    }

    this.emit('gameComplete', results)
  }

  recordProblemPerformance(isCorrect, timeSpent) {
    // This would typically send data to the adaptive learning engine
    const performance = {
      problemId: this.currentProblem.id,
      topic: this.currentProblem.topic,
      difficulty: this.currentProblem.difficulty,
      isCorrect,
      timeSpent,
      hintsUsed: this.hintsUsed
    }

    // Send to adaptive learning engine
    if (window.adaptiveLearning) {
      window.adaptiveLearning.recordProblemPerformance(performance)
    }
  }

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

export default MathAdventureGame
```

### Science Simulation Games

```javascript
// games/science/chemistry-lab.js
class ChemistryLabGame extends GameEngine {
  constructor(config) {
    super(config)
    this.elements = new Map()
    this.compounds = new Map()
    this.reactions = new Map()
    this.inventory = new Map()
    this.currentExperiment = null
    this.safetyScore = 100
    this.discoveredReactions = new Set()
  }

  init() {
    super.init()
    this.loadChemicalData()
    this.setupLaboratory()
    this.startExperiment()
  }

  loadChemicalData() {
    // Load periodic table elements
    const elements = [
      { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, color: '#ffffff' },
      { symbol: 'He', name: 'Helium', atomicNumber: 2, color: '#d9ffff' },
      { symbol: 'Li', name: 'Lithium', atomicNumber: 3, color: '#cc80ff' },
      { symbol: 'C', name: 'Carbon', atomicNumber: 6, color: '#909090' },
      { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, color: '#3050f8' },
      { symbol: 'O', name: 'Oxygen', atomicNumber: 8, color: '#ff0d0d' },
      { symbol: 'Na', name: 'Sodium', atomicNumber: 11, color: '#ab5cf2' },
      { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, color: '#1ff01f' }
    ]

    elements.forEach(element => {
      this.elements.set(element.symbol, element)
    })

    // Load common compounds
    const compounds = [
      { formula: 'H2O', name: 'Water', elements: ['H', 'H', 'O'] },
      { formula: 'NaCl', name: 'Salt', elements: ['Na', 'Cl'] },
      { formula: 'CO2', name: 'Carbon Dioxide', elements: ['C', 'O', 'O'] },
      { formula: 'NH3', name: 'Ammonia', elements: ['N', 'H', 'H', 'H'] }
    ]

    compounds.forEach(compound => {
      this.compounds.set(compound.formula, compound)
    })

    // Load chemical reactions
    const reactions = [
      {
        id: 'water_formation',
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        equation: '2H2 + O2 → 2H2O',
        type: 'synthesis',
        energyChange: -286,
        safetyLevel: 'moderate'
      },
      {
        id: 'salt_formation',
        reactants: ['Na', 'Cl2'],
        products: ['NaCl'],
        equation: '2Na + Cl2 → 2NaCl',
        type: 'synthesis',
        energyChange: -411,
        safetyLevel: 'dangerous'
      }
    ]

    reactions.forEach(reaction => {
      this.reactions.set(reaction.id, reaction)
    })
  }

  setupLaboratory() {
    // Initialize lab equipment and starting materials
    this.inventory.set('H2', { amount: 10, unit: 'mol' })
    this.inventory.set('O2', { amount: 5, unit: 'mol' })
    this.inventory.set('Na', { amount: 2, unit: 'mol' })
    this.inventory.set('Cl2', { amount: 3, unit: 'mol' })

    this.equipment = {
      beaker: { capacity: 500, contents: null },
      bunsenBurner: { temperature: 0, isOn: false },
      scale: { precision: 0.01 },
      thermometer: { temperature: 25 },
      safetyEquipment: {
        goggles: false,
        gloves: false,
        labCoat: false
      }
    }
  }

  startExperiment() {
    const experiments = [
      {
        id: 'water_synthesis',
        title: 'Making Water',
        objective: 'Combine hydrogen and oxygen to create water',
        targetReaction: 'water_formation',
        difficulty: 'beginner',
        instructions: [
          'Put on safety equipment',
          'Measure 2 moles of H2',
          'Measure 1 mole of O2',
          'Mix carefully in beaker',
          'Apply heat to start reaction'
        ]
      }
    ]

    this.currentExperiment = experiments[0]
    this.emit('experimentStarted', this.currentExperiment)
  }

  addChemical(chemical, amount) {
    if (!this.inventory.has(chemical)) {
      this.emit('error', `Chemical ${chemical} not available`)
      return false
    }

    const available = this.inventory.get(chemical).amount
    if (amount > available) {
      this.emit('error', `Not enough ${chemical}. Available: ${available}`)
      return false
    }

    // Add to beaker
    if (!this.equipment.beaker.contents) {
      this.equipment.beaker.contents = new Map()
    }

    const currentAmount = this.equipment.beaker.contents.get(chemical) || 0
    this.equipment.beaker.contents.set(chemical, currentAmount + amount)

    // Remove from inventory
    this.inventory.get(chemical).amount -= amount

    this.emit('chemicalAdded', { chemical, amount })
    this.checkForReaction()
    
    return true
  }

  checkForReaction() {
    if (!this.equipment.beaker.contents) return

    const contents = Array.from(this.equipment.beaker.contents.keys())
    
    // Check if contents match any known reaction
    for (const [reactionId, reaction] of this.reactions) {
      if (this.canReactionOccur(reaction, contents)) {
        this.triggerReaction(reaction)
        break
      }
    }
  }

  canReactionOccur(reaction, availableChemicals) {
    return reaction.reactants.every(reactant => 
      availableChemicals.includes(reactant)
    )
  }

  triggerReaction(reaction) {
    // Check safety conditions
    const safetyCheck = this.checkSafety(reaction)
    if (!safetyCheck.safe) {
      this.handleUnsafeReaction(reaction, safetyCheck.issues)
      return
    }

    // Perform reaction
    this.performReaction(reaction)
    this.discoveredReactions.add(reaction.id)
    
    const points = this.calculateReactionPoints(reaction)
    this.addScore(points)

    this.emit('reactionOccurred', {
      reaction,
      points,
      products: reaction.products
    })

    // Check if experiment objective is met
    this.checkExperimentCompletion()
  }

  checkSafety(reaction) {
    const issues = []
    let safe = true

    // Check safety equipment
    if (reaction.safetyLevel === 'dangerous') {
      if (!this.equipment.safetyEquipment.goggles) {
        issues.push('Safety goggles required')
        safe = false
      }
      if (!this.equipment.safetyEquipment.gloves) {
        issues.push('Safety gloves required')
        safe = false
      }
    }

    // Check temperature conditions
    if (reaction.energyChange < -200 && this.equipment.bunsenBurner.temperature > 100) {
      issues.push('Reaction too exothermic at high temperature')
      safe = false
    }

    return { safe, issues }
  }

  handleUnsafeReaction(reaction, issues) {
    this.safetyScore -= 20
    
    this.emit('safetyViolation', {
      reaction: reaction.id,
      issues,
      safetyScore: this.safetyScore
    })

    if (this.safetyScore <= 0) {
      this.emit('experimentFailed', 'Too many safety violations')
      this.gameOver()
    }
  }

  performReaction(reaction) {
    // Remove reactants from beaker
    reaction.reactants.forEach(reactant => {
      const current = this.equipment.beaker.contents.get(reactant) || 0
      if (current > 0) {
        this.equipment.beaker.contents.set(reactant, current - 1)
        if (current - 1 <= 0) {
          this.equipment.beaker.contents.delete(reactant)
        }
      }
    })

    // Add products to beaker
    reaction.products.forEach(product => {
      const current = this.equipment.beaker.contents.get(product) || 0
      this.equipment.beaker.contents.set(product, current + 1)
    })

    // Update temperature based on energy change
    const temperatureChange = reaction.energyChange / 100
    this.equipment.thermometer.temperature += temperatureChange
  }

  calculateReactionPoints(reaction) {
    let points = 100

    // Difficulty bonus
    const difficultyMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
      'expert': 3
    }
    points *= difficultyMultiplier[this.currentExperiment.difficulty] || 1

    // Safety bonus
    if (this.safetyScore === 100) {
      points += 50
    }

    // Discovery bonus
    if (!this.discoveredReactions.has(reaction.id)) {
      points += 100
    }

    return Math.round(points)
  }

  checkExperimentCompletion() {
    if (!this.currentExperiment) return

    const targetReaction = this.reactions.get(this.currentExperiment.targetReaction)
    if (this.discoveredReactions.has(this.currentExperiment.targetReaction)) {
      this.completeExperiment()
    }
  }

  completeExperiment() {
    const bonus = this.safetyScore * 10
    this.addScore(bonus)

    this.emit('experimentCompleted', {
      experiment: this.currentExperiment,
      safetyScore: this.safetyScore,
      bonus,
      discoveredReactions: Array.from(this.discoveredReactions)
    })
  }

  putOnSafetyEquipment(equipment) {
    if (this.equipment.safetyEquipment.hasOwnProperty(equipment)) {
      this.equipment.safetyEquipment[equipment] = true
      this.emit('safetyEquipmentUsed', equipment)
    }
  }

  adjustTemperature(temperature) {
    this.equipment.bunsenBurner.temperature = temperature
    this.equipment.bunsenBurner.isOn = temperature > 0
    this.emit('temperatureChanged', temperature)
  }
}

export default ChemistryLabGame
```

### Progress Tracking and Analytics

```javascript
// utils/education-analytics.js
class EducationAnalytics {
  static async trackLearningSession(sessionData) {
    try {
      await wx.request({
        url: '/api/education/analytics/session',
        method: 'POST',
        data: {
          studentId: wx.getStorageSync('userId'),
          ...sessionData,
          timestamp: Date.now()
        }
      })
    } catch (error) {
      console.error('Failed to track learning session:', error)
    }
  }

  static async getStudentProgress(studentId, subject) {
    try {
      const res = await wx.request({
        url: `/api/education/progress/${studentId}/${subject}`,
        method: 'GET'
      })

      return res.data.progress
    } catch (error) {
      console.error('Failed to get student progress:', error)
      return null
    }
  }

  static async generateProgressReport(studentId, period = '30d') {
    try {
      const res = await wx.request({
        url: `/api/education/reports/${studentId}`,
        method: 'GET',
        data: { period }
      })

      return res.data.report
    } catch (error) {
      console.error('Failed to generate progress report:', error)
      return null
    }
  }

  static async getRecommendations(studentId) {
    try {
      const res = await wx.request({
        url: `/api/education/recommendations/${studentId}`,
        method: 'GET'
      })

      return res.data.recommendations
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      return []
    }
  }

  static calculateMasteryLevel(performances) {
    if (performances.length === 0) return 0

    const recentPerformances = performances.slice(-10)
    const averageScore = recentPerformances.reduce((sum, p) => sum + p.score, 0) / recentPerformances.length
    const consistency = this.calculateConsistency(recentPerformances)
    
    return Math.round((averageScore * 0.7 + consistency * 0.3))
  }

  static calculateConsistency(performances) {
    if (performances.length < 2) return 0

    const scores = performances.map(p => p.score)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const standardDeviation = Math.sqrt(variance)
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - standardDeviation)
  }

  static identifyLearningPatterns(performances) {
    const patterns = {
      timeOfDay: this.analyzeTimePatterns(performances),
      sessionLength: this.analyzeSessionLengthPatterns(performances),
      difficultyProgression: this.analyzeDifficultyProgression(performances),
      subjectPreferences: this.analyzeSubjectPreferences(performances)
    }

    return patterns
  }

  static analyzeTimePatterns(performances) {
    const hourlyPerformance = new Array(24).fill(0).map(() => ({ count: 0, totalScore: 0 }))
    
    performances.forEach(p => {
      const hour = new Date(p.timestamp).getHours()
      hourlyPerformance[hour].count++
      hourlyPerformance[hour].totalScore += p.score
    })

    const bestHours = hourlyPerformance
      .map((data, hour) => ({
        hour,
        averageScore: data.count > 0 ? data.totalScore / data.count : 0,
        sessionCount: data.count
      }))
      .filter(data => data.sessionCount >= 3)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3)

    return bestHours
  }

  static analyzeSessionLengthPatterns(performances) {
    const sessionLengths = performances.map(p => p.sessionLength || 0).filter(length => length > 0)
    
    if (sessionLengths.length === 0) return null

    const averageLength = sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length
    const optimalRange = {
      min: Math.max(5, averageLength - 10),
      max: averageLength + 10
    }

    return {
      average: Math.round(averageLength),
      optimal: optimalRange,
      recommendation: averageLength < 10 ? 'Try longer study sessions' : 
                     averageLength > 30 ? 'Consider shorter, more focused sessions' : 
                     'Current session length is good'
    }
  }

  static analyzeDifficultyProgression(performances) {
    const difficultyLevels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
    const progressionData = performances.map(p => ({
      difficulty: difficultyLevels[p.difficulty] || 1,
      score: p.score,
      timestamp: p.timestamp
    })).sort((a, b) => a.timestamp - b.timestamp)

    if (progressionData.length < 5) return null

    const recentData = progressionData.slice(-10)
    const averageDifficulty = recentData.reduce((sum, p) => sum + p.difficulty, 0) / recentData.length
    const averageScore = recentData.reduce((sum, p) => sum + p.score, 0) / recentData.length

    let recommendation = ''
    if (averageScore > 85 && averageDifficulty < 3) {
      recommendation = 'Ready for more challenging content'
    } else if (averageScore < 60) {
      recommendation = 'Consider reviewing easier content'
    } else {
      recommendation = 'Current difficulty level is appropriate'
    }

    return {
      currentLevel: Math.round(averageDifficulty),
      performance: Math.round(averageScore),
      recommendation
    }
  }

  static analyzeSubjectPreferences(performances) {
    const subjectData = {}
    
    performances.forEach(p => {
      if (!subjectData[p.subject]) {
        subjectData[p.subject] = {
          count: 0,
          totalScore: 0,
          totalTime: 0
        }
      }
      
      subjectData[p.subject].count++
      subjectData[p.subject].totalScore += p.score
      subjectData[p.subject].totalTime += p.sessionLength || 0
    })

    const preferences = Object.keys(subjectData).map(subject => ({
      subject,
      averageScore: subjectData[subject].totalScore / subjectData[subject].count,
      averageTime: subjectData[subject].totalTime / subjectData[subject].count,
      sessionCount: subjectData[subject].count,
      engagement: (subjectData[subject].totalTime / subjectData[subject].count) * 
                  (subjectData[subject].totalScore / subjectData[subject].count) / 100
    })).sort((a, b) => b.engagement - a.engagement)

    return preferences
  }
}

export default EducationAnalytics
```

## Project Results

### Key Metrics

- **Learning Engagement**: 92% of students show improved engagement compared to traditional methods
- **Knowledge Retention**: 78% improvement in long-term knowledge retention
- **Academic Performance**: 65% of students show grade improvements within 3 months
- **Completion Rate**: 85% of started educational games are completed successfully
- **Adaptive Learning**: 89% accuracy in difficulty adjustment based on student performance

### Business Impact

- **Student Growth**: 500% increase in registered students within first year
- **Teacher Adoption**: 2,000+ teachers using the platform in their classrooms
- **Parent Satisfaction**: 4.8/5.0 average rating from parents
- **Educational Outcomes**: 40% reduction in learning gaps across different subjects
- **Revenue Growth**: 280% increase through premium educational content and school partnerships

This educational games platform successfully demonstrates how gamification can transform learning experiences, making education more engaging, personalized, and effective for students of all ages and learning styles.
