# Social Games Mini Program Case

This case showcases a collection of social interactive games designed to bring people together through multiplayer gameplay, real-time competition, and collaborative challenges, fostering community engagement and social connections.

## Project Overview

### Project Background

Social gaming has become a powerful way to connect people across distances and create shared experiences. This mini program addresses the need for accessible multiplayer games that can be played instantly with friends, family, or strangers, while building lasting social connections through gameplay.

### Core Features

- **Real-time Multiplayer**: Live gameplay with up to 8 players simultaneously
- **Voice Chat Integration**: Built-in voice communication during games
- **Room Creation**: Private and public game rooms with customizable settings
- **Tournament System**: Organized competitions with brackets and prizes
- **Guild System**: Join communities of players with shared interests
- **Cross-Platform Play**: Seamless gameplay across different devices
- **Spectator Mode**: Watch and cheer for friends during their games

## Technical Implementation

### Real-time Multiplayer Architecture

```javascript
// utils/multiplayer-engine.js
class MultiplayerEngine {
  constructor() {
    this.socket = null
    this.roomId = null
    this.playerId = null
    this.players = new Map()
    this.gameState = {}
    this.eventHandlers = new Map()
    this.connectionState = 'disconnected'
  }

  async connect() {
    try {
      this.socket = wx.connectSocket({
        url: 'wss://api.example.com/game-socket',
        protocols: ['game-protocol']
      })

      this.setupSocketHandlers()
      
      return new Promise((resolve, reject) => {
        this.socket.onOpen(() => {
          this.connectionState = 'connected'
          this.authenticate()
          resolve()
        })

        this.socket.onError((error) => {
          this.connectionState = 'error'
          reject(error)
        })
      })
    } catch (error) {
      console.error('Failed to connect to game server:', error)
      throw error
    }
  }

  setupSocketHandlers() {
    this.socket.onMessage((message) => {
      try {
        const data = JSON.parse(message.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    })

    this.socket.onClose(() => {
      this.connectionState = 'disconnected'
      this.emit('disconnected')
      this.attemptReconnect()
    })

    this.socket.onError((error) => {
      console.error('Socket error:', error)
      this.emit('error', error)
    })
  }

  authenticate() {
    this.sendMessage({
      type: 'authenticate',
      token: wx.getStorageSync('authToken'),
      userId: wx.getStorageSync('userId')
    })
  }

  async createRoom(gameType, settings = {}) {
    const message = {
      type: 'createRoom',
      gameType,
      settings: {
        maxPlayers: settings.maxPlayers || 4,
        isPrivate: settings.isPrivate || false,
        password: settings.password,
        gameMode: settings.gameMode || 'classic',
        timeLimit: settings.timeLimit || 300
      }
    }

    this.sendMessage(message)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Room creation timeout'))
      }, 10000)

      this.once('roomCreated', (data) => {
        clearTimeout(timeout)
        this.roomId = data.roomId
        resolve(data)
      })

      this.once('roomCreationFailed', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })
  }

  async joinRoom(roomId, password = null) {
    const message = {
      type: 'joinRoom',
      roomId,
      password
    }

    this.sendMessage(message)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'))
      }, 10000)

      this.once('roomJoined', (data) => {
        clearTimeout(timeout)
        this.roomId = roomId
        this.updateGameState(data.gameState)
        resolve(data)
      })

      this.once('joinRoomFailed', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
    })
  }

  leaveRoom() {
    if (this.roomId) {
      this.sendMessage({
        type: 'leaveRoom',
        roomId: this.roomId
      })
      this.roomId = null
      this.players.clear()
      this.gameState = {}
    }
  }

  sendGameAction(action, data = {}) {
    if (!this.roomId) {
      console.error('Not in a room')
      return
    }

    this.sendMessage({
      type: 'gameAction',
      roomId: this.roomId,
      action,
      data,
      timestamp: Date.now()
    })
  }

  sendMessage(message) {
    if (this.connectionState === 'connected') {
      this.socket.send({
        data: JSON.stringify(message)
      })
    } else {
      console.error('Socket not connected')
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'authenticated':
        this.playerId = data.playerId
        this.emit('authenticated', data)
        break

      case 'roomCreated':
        this.emit('roomCreated', data)
        break

      case 'roomJoined':
        this.emit('roomJoined', data)
        break

      case 'playerJoined':
        this.players.set(data.player.id, data.player)
        this.emit('playerJoined', data.player)
        break

      case 'playerLeft':
        this.players.delete(data.playerId)
        this.emit('playerLeft', data.playerId)
        break

      case 'gameStateUpdate':
        this.updateGameState(data.gameState)
        this.emit('gameStateUpdate', data.gameState)
        break

      case 'gameAction':
        this.emit('gameAction', data)
        break

      case 'gameStarted':
        this.emit('gameStarted', data)
        break

      case 'gameEnded':
        this.emit('gameEnded', data)
        break

      case 'error':
        this.emit('error', data.error)
        break

      default:
        console.warn('Unknown message type:', data.type)
    }
  }

  updateGameState(newState) {
    this.gameState = { ...this.gameState, ...newState }
  }

  attemptReconnect() {
    if (this.connectionState === 'disconnected') {
      setTimeout(() => {
        console.log('Attempting to reconnect...')
        this.connect().catch(console.error)
      }, 3000)
    }
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event).push(handler)
  }

  once(event, handler) {
    const onceHandler = (...args) => {
      handler(...args)
      this.off(event, onceHandler)
    }
    this.on(event, onceHandler)
  }

  off(event, handler) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error('Event handler error:', error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      this.leaveRoom()
      this.socket.close()
      this.socket = null
      this.connectionState = 'disconnected'
    }
  }
}

export default MultiplayerEngine
```

### Voice Chat Integration

```javascript
// utils/voice-chat.js
class VoiceChat {
  constructor() {
    this.isRecording = false
    this.isPlaying = false
    this.recorderManager = null
    this.audioContext = null
    this.participants = new Map()
  }

  init() {
    this.recorderManager = wx.getRecorderManager()
    this.audioContext = wx.createInnerAudioContext()
    this.setupRecorderHandlers()
  }

  setupRecorderHandlers() {
    this.recorderManager.onStart(() => {
      console.log('Voice recording started')
      this.isRecording = true
    })

    this.recorderManager.onStop((res) => {
      console.log('Voice recording stopped')
      this.isRecording = false
      this.sendVoiceMessage(res.tempFilePath)
    })

    this.recorderManager.onError((error) => {
      console.error('Voice recording error:', error)
      this.isRecording = false
    })
  }

  async requestMicrophonePermission() {
    try {
      const result = await wx.authorize({
        scope: 'scope.record'
      })
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      
      wx.showModal({
        title: 'Microphone Permission',
        content: 'Voice chat requires microphone access. Please enable it in settings.',
        confirmText: 'Settings',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting()
          }
        }
      })
      
      return false
    }
  }

  async startRecording() {
    if (this.isRecording) return

    const hasPermission = await this.requestMicrophonePermission()
    if (!hasPermission) return

    try {
      this.recorderManager.start({
        duration: 60000, // Max 60 seconds
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      })
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.recorderManager.stop()
    }
  }

  async sendVoiceMessage(filePath) {
    try {
      // Upload voice file
      const uploadRes = await wx.uploadFile({
        url: '/api/voice/upload',
        filePath: filePath,
        name: 'voice',
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('authToken')}`
        }
      })

      const result = JSON.parse(uploadRes.data)
      
      if (result.success) {
        // Send voice message to other players
        this.broadcastVoiceMessage({
          type: 'voice',
          fileId: result.fileId,
          duration: result.duration,
          senderId: wx.getStorageSync('userId')
        })
      }
    } catch (error) {
      console.error('Failed to send voice message:', error)
    }
  }

  async receiveVoiceMessage(message) {
    try {
      // Download and play voice message
      const downloadRes = await wx.downloadFile({
        url: `/api/voice/download/${message.fileId}`,
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('authToken')}`
        }
      })

      if (downloadRes.statusCode === 200) {
        this.playVoiceMessage(downloadRes.tempFilePath, message.senderId)
      }
    } catch (error) {
      console.error('Failed to receive voice message:', error)
    }
  }

  playVoiceMessage(filePath, senderId) {
    this.audioContext.src = filePath
    this.audioContext.play()

    // Show voice message indicator
    this.showVoiceIndicator(senderId)

    this.audioContext.onEnded(() => {
      this.hideVoiceIndicator(senderId)
    })

    this.audioContext.onError((error) => {
      console.error('Voice playback error:', error)
      this.hideVoiceIndicator(senderId)
    })
  }

  showVoiceIndicator(senderId) {
    // Emit event to show voice indicator in UI
    wx.publishEvent('voiceIndicator', {
      senderId,
      action: 'show'
    })
  }

  hideVoiceIndicator(senderId) {
    // Emit event to hide voice indicator in UI
    wx.publishEvent('voiceIndicator', {
      senderId,
      action: 'hide'
    })
  }

  broadcastVoiceMessage(message) {
    // Send through multiplayer engine
    if (window.multiplayerEngine) {
      window.multiplayerEngine.sendMessage({
        type: 'voiceMessage',
        ...message
      })
    }
  }

  enableVoiceChat(roomId) {
    this.roomId = roomId
    // Join voice chat room
    this.sendVoiceChatCommand('join')
  }

  disableVoiceChat() {
    if (this.roomId) {
      this.sendVoiceChatCommand('leave')
      this.roomId = null
    }
  }

  sendVoiceChatCommand(command) {
    if (window.multiplayerEngine) {
      window.multiplayerEngine.sendMessage({
        type: 'voiceChatCommand',
        command,
        roomId: this.roomId
      })
    }
  }

  mutePlayer(playerId) {
    this.participants.set(playerId, { ...this.participants.get(playerId), muted: true })
    this.sendVoiceChatCommand('mute', { playerId })
  }

  unmutePlayer(playerId) {
    this.participants.set(playerId, { ...this.participants.get(playerId), muted: false })
    this.sendVoiceChatCommand('unmute', { playerId })
  }

  setVolume(playerId, volume) {
    this.participants.set(playerId, { ...this.participants.get(playerId), volume })
  }

  cleanup() {
    if (this.recorderManager) {
      this.recorderManager.stop()
    }
    if (this.audioContext) {
      this.audioContext.stop()
      this.audioContext.destroy()
    }
    this.participants.clear()
  }
}

export default VoiceChat
```

### Tournament System

```javascript
// utils/tournament-system.js
class TournamentSystem {
  static async createTournament(tournamentData) {
    try {
      const res = await wx.request({
        url: '/api/tournaments',
        method: 'POST',
        data: {
          ...tournamentData,
          creatorId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Tournament created!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to create tournament:', error)
      throw error
    }
  }

  static async joinTournament(tournamentId) {
    try {
      const res = await wx.request({
        url: `/api/tournaments/${tournamentId}/join`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Joined tournament!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to join tournament:', error)
      throw error
    }
  }

  static async getTournaments(filters = {}) {
    try {
      const res = await wx.request({
        url: '/api/tournaments',
        method: 'GET',
        data: {
          status: filters.status || 'open',
          gameType: filters.gameType,
          maxPlayers: filters.maxPlayers,
          entryFee: filters.entryFee
        }
      })

      return res.data.tournaments
    } catch (error) {
      console.error('Failed to get tournaments:', error)
      return []
    }
  }

  static async getTournamentDetails(tournamentId) {
    try {
      const res = await wx.request({
        url: `/api/tournaments/${tournamentId}`,
        method: 'GET'
      })

      return res.data.tournament
    } catch (error) {
      console.error('Failed to get tournament details:', error)
      return null
    }
  }

  static async getTournamentBracket(tournamentId) {
    try {
      const res = await wx.request({
        url: `/api/tournaments/${tournamentId}/bracket`,
        method: 'GET'
      })

      return res.data.bracket
    } catch (error) {
      console.error('Failed to get tournament bracket:', error)
      return null
    }
  }

  static async reportMatchResult(matchId, result) {
    try {
      const res = await wx.request({
        url: `/api/tournaments/matches/${matchId}/result`,
        method: 'POST',
        data: {
          result,
          reporterId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Result reported!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to report match result:', error)
      throw error
    }
  }

  static async getUserTournaments(userId) {
    try {
      const res = await wx.request({
        url: `/api/users/${userId}/tournaments`,
        method: 'GET'
      })

      return res.data.tournaments
    } catch (error) {
      console.error('Failed to get user tournaments:', error)
      return []
    }
  }

  static generateBracket(players) {
    // Single elimination bracket generation
    const shuffledPlayers = this.shuffleArray([...players])
    const rounds = []
    let currentRound = shuffledPlayers

    // Ensure power of 2 participants (add byes if needed)
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(currentRound.length)))
    while (currentRound.length < nextPowerOf2) {
      currentRound.push({ id: 'bye', name: 'BYE', isBye: true })
    }

    let roundNumber = 1
    while (currentRound.length > 1) {
      const matches = []
      const nextRound = []

      for (let i = 0; i < currentRound.length; i += 2) {
        const player1 = currentRound[i]
        const player2 = currentRound[i + 1]

        const match = {
          id: `round${roundNumber}_match${Math.floor(i / 2) + 1}`,
          roundNumber,
          player1,
          player2,
          winner: null,
          status: 'pending'
        }

        // Handle byes
        if (player1.isBye) {
          match.winner = player2
          match.status = 'completed'
          nextRound.push(player2)
        } else if (player2.isBye) {
          match.winner = player1
          match.status = 'completed'
          nextRound.push(player1)
        } else {
          nextRound.push({ id: `winner_${match.id}`, name: 'TBD' })
        }

        matches.push(match)
      }

      rounds.push({
        roundNumber,
        name: this.getRoundName(roundNumber, rounds.length + 1),
        matches
      })

      currentRound = nextRound
      roundNumber++
    }

    return rounds
  }

  static getRoundName(roundNumber, totalRounds) {
    const roundsFromEnd = totalRounds - roundNumber + 1
    
    switch (roundsFromEnd) {
      case 1: return 'Final'
      case 2: return 'Semi-Final'
      case 3: return 'Quarter-Final'
      default: return `Round ${roundNumber}`
    }
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  static calculatePrizeDistribution(totalPrize, playerCount) {
    const distribution = []
    
    if (playerCount >= 8) {
      distribution.push({ place: 1, percentage: 50, amount: totalPrize * 0.5 })
      distribution.push({ place: 2, percentage: 30, amount: totalPrize * 0.3 })
      distribution.push({ place: 3, percentage: 15, amount: totalPrize * 0.15 })
      distribution.push({ place: 4, percentage: 5, amount: totalPrize * 0.05 })
    } else if (playerCount >= 4) {
      distribution.push({ place: 1, percentage: 60, amount: totalPrize * 0.6 })
      distribution.push({ place: 2, percentage: 40, amount: totalPrize * 0.4 })
    } else {
      distribution.push({ place: 1, percentage: 100, amount: totalPrize })
    }

    return distribution
  }
}

export default TournamentSystem
```

### Guild System

```javascript
// utils/guild-system.js
class GuildSystem {
  static async createGuild(guildData) {
    try {
      const res = await wx.request({
        url: '/api/guilds',
        method: 'POST',
        data: {
          ...guildData,
          leaderId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Guild created!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to create guild:', error)
      throw error
    }
  }

  static async searchGuilds(query, filters = {}) {
    try {
      const res = await wx.request({
        url: '/api/guilds/search',
        method: 'GET',
        data: {
          query,
          gameType: filters.gameType,
          memberCount: filters.memberCount,
          isRecruiting: filters.isRecruiting
        }
      })

      return res.data.guilds
    } catch (error) {
      console.error('Failed to search guilds:', error)
      return []
    }
  }

  static async joinGuild(guildId, applicationMessage = '') {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/join`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          applicationMessage
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: res.data.requiresApproval ? 'Application sent!' : 'Joined guild!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to join guild:', error)
      throw error
    }
  }

  static async leaveGuild(guildId) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/leave`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Left guild',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to leave guild:', error)
      throw error
    }
  }

  static async getGuildDetails(guildId) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}`,
        method: 'GET'
      })

      return res.data.guild
    } catch (error) {
      console.error('Failed to get guild details:', error)
      return null
    }
  }

  static async getGuildMembers(guildId) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/members`,
        method: 'GET'
      })

      return res.data.members
    } catch (error) {
      console.error('Failed to get guild members:', error)
      return []
    }
  }

  static async sendGuildMessage(guildId, message) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/messages`,
        method: 'POST',
        data: {
          message,
          senderId: wx.getStorageSync('userId')
        }
      })

      return res.data
    } catch (error) {
      console.error('Failed to send guild message:', error)
      throw error
    }
  }

  static async getGuildMessages(guildId, page = 1) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/messages`,
        method: 'GET',
        data: { page }
      })

      return res.data.messages
    } catch (error) {
      console.error('Failed to get guild messages:', error)
      return []
    }
  }

  static async promoteGuildMember(guildId, memberId, role) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/members/${memberId}/promote`,
        method: 'POST',
        data: {
          role,
          promoterId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Member promoted!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to promote guild member:', error)
      throw error
    }
  }

  static async kickGuildMember(guildId, memberId, reason = '') {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/members/${memberId}/kick`,
        method: 'POST',
        data: {
          reason,
          kickerId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Member removed',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to kick guild member:', error)
      throw error
    }
  }

  static async getGuildEvents(guildId) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/events`,
        method: 'GET'
      })

      return res.data.events
    } catch (error) {
      console.error('Failed to get guild events:', error)
      return []
    }
  }

  static async createGuildEvent(guildId, eventData) {
    try {
      const res = await wx.request({
        url: `/api/guilds/${guildId}/events`,
        method: 'POST',
        data: {
          ...eventData,
          creatorId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Event created!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to create guild event:', error)
      throw error
    }
  }

  static async joinGuildEvent(eventId) {
    try {
      const res = await wx.request({
        url: `/api/guild-events/${eventId}/join`,
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId')
        }
      })

      if (res.data.success) {
        wx.showToast({
          title: 'Joined event!',
          icon: 'success'
        })
      }

      return res.data
    } catch (error) {
      console.error('Failed to join guild event:', error)
      throw error
    }
  }
}

export default GuildSystem
```

## Project Results

### Key Metrics

- **Multiplayer Engagement**: 85% of users participate in multiplayer games regularly
- **Voice Chat Usage**: 60% of multiplayer sessions include voice communication
- **Tournament Participation**: 40% of active users join tournaments monthly
- **Guild Membership**: 70% of users belong to at least one guild
- **Session Duration**: Average multiplayer session lasts 25 minutes

### Business Impact

- **User Growth**: 450% increase in registered users within 8 months
- **Revenue Growth**: 320% increase through tournament entry fees and premium features
- **User Retention**: 88% 7-day retention, 72% 30-day retention
- **Social Connections**: Average user has 12 friends and participates in 3 guilds
- **User Satisfaction**: 4.7/5.0 average rating with 92% recommendation rate

This social games platform successfully demonstrates how multiplayer functionality, voice communication, and community features can create engaging social experiences that bring people together through gaming, fostering lasting friendships and active communities.