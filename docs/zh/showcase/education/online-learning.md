# 在线学习平台

一个集成视频课程、在线考试、学习进度跟踪的教育小程序，为学生和教师提供完整的在线学习解决方案。

## 📱 项目概览

### 项目信息
- **项目名称**: 在线学习平台
- **开发周期**: 8个月
- **团队规模**: 15人
- **技术栈**: uni-app + Vue3 + TypeScript + Spring Boot
- **用户规模**: 50万+ 学生用户，2万+ 教师用户
- **覆盖领域**: K12教育、职业培训、语言学习

### 核心功能
- 📺 高清视频课程播放
- 📝 在线作业与考试系统
- 📊 学习进度可视化跟踪
- 👨‍🏫 师生互动交流
- 🏆 成就系统与积分奖励
- 📱 离线下载与缓存

## 🎯 项目亮点

### 1. 自适应视频播放器
支持多种清晰度、倍速播放、断点续播等功能。

**技术实现**:
```vue
<!-- components/VideoPlayer/VideoPlayer.vue -->
<template>
  <view class="video-player-container">
    <video
      :id="playerId"
      :src="currentVideoUrl"
      :poster="poster"
      :controls="showControls"
      :autoplay="false"
      :loop="false"
      :muted="false"
      :initial-time="initialTime"
      :duration="duration"
      :show-progress="true"
      :show-fullscreen-btn="true"
      :show-play-btn="true"
      :show-center-play-btn="true"
      :enable-progress-gesture="true"
      :object-fit="objectFit"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @waiting="onWaiting"
      @error="onError"
      @fullscreenchange="onFullscreenChange"
      class="video-element"
    />
    
    <!-- 自定义控制栏 -->
    <view v-if="showCustomControls" class="custom-controls">
      <view class="controls-row">
        <!-- 播放/暂停按钮 -->
        <view class="control-btn" @click="togglePlay">
          <text class="icon">{{ isPlaying ? '⏸️' : '▶️' }}</text>
        </view>
        
        <!-- 进度条 -->
        <view class="progress-container" @click="seekTo">
          <view class="progress-bg">
            <view 
              class="progress-bar" 
              :style="{ width: progressPercent + '%' }"
            ></view>
            <view 
              class="progress-dot" 
              :style="{ left: progressPercent + '%' }"
            ></view>
          </view>
        </view>
        
        <!-- 时间显示 -->
        <text class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </text>
        
        <!-- 倍速选择 -->
        <view class="speed-selector" @click="showSpeedOptions">
          <text>{{ playbackRate }}x</text>
        </view>
        
        <!-- 清晰度选择 -->
        <view class="quality-selector" @click="showQualityOptions">
          <text>{{ currentQuality }}</text>
        </view>
        
        <!-- 全屏按钮 -->
        <view class="control-btn" @click="toggleFullscreen">
          <text class="icon">⛶</text>
        </view>
      </view>
    </view>
    
    <!-- 倍速选择弹窗 -->
    <view v-if="showSpeedMenu" class="speed-menu" @click="hideSpeedMenu">
      <view class="menu-content" @click.stop>
        <view 
          v-for="speed in speedOptions" 
          :key="speed"
          class="menu-item"
          :class="{ active: playbackRate === speed }"
          @click="setPlaybackRate(speed)"
        >
          {{ speed }}x
        </view>
      </view>
    </view>
    
    <!-- 清晰度选择弹窗 -->
    <view v-if="showQualityMenu" class="quality-menu" @click="hideQualityMenu">
      <view class="menu-content" @click.stop>
        <view 
          v-for="quality in qualityOptions" 
          :key="quality.key"
          class="menu-item"
          :class="{ active: currentQuality === quality.label }"
          @click="setQuality(quality)"
        >
          {{ quality.label }}
        </view>
      </view>
    </view>
    
    <!-- 加载指示器 -->
    <view v-if="isBuffering" class="loading-indicator">
      <text class="loading-text">缓冲中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface VideoQuality {
  key: string
  label: string
  url: string
}

interface Props {
  videoId: string
  videoSources: VideoQuality[]
  poster?: string
  autoplay?: boolean
  initialTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  initialTime: 0
})

const emit = defineEmits<{
  play: [time: number]
  pause: [time: number]
  ended: []
  progress: [time: number, duration: number]
  qualityChange: [quality: string]
  speedChange: [speed: number]
}>()

// 响应式数据
const playerId = ref(`video-${props.videoId}`)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isBuffering = ref(false)
const showControls = ref(true)
const showCustomControls = ref(false)
const playbackRate = ref(1)
const currentQuality = ref('高清')
const showSpeedMenu = ref(false)
const showQualityMenu = ref(false)
const objectFit = ref('contain')

// 配置选项
const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
const qualityOptions = ref<VideoQuality[]>(props.videoSources)

// 计算属性
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const currentVideoUrl = computed(() => {
  const quality = qualityOptions.value.find(q => q.label === currentQuality.value)
  return quality?.url || qualityOptions.value[0]?.url || ''
})

// 视频控制方法
const videoContext = ref<any>(null)

onMounted(() => {
  videoContext.value = uni.createVideoContext(playerId.value)
  
  // 恢复播放进度
  if (props.initialTime > 0) {
    setTimeout(() => {
      videoContext.value?.seek(props.initialTime)
    }, 1000)
  }
})

const togglePlay = () => {
  if (isPlaying.value) {
    videoContext.value?.pause()
  } else {
    videoContext.value?.play()
  }
}

const seekTo = (event: any) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.detail.x - rect.left
  const percent = clickX / rect.width
  const seekTime = duration.value * percent
  
  videoContext.value?.seek(seekTime)
  currentTime.value = seekTime
}

const setPlaybackRate = (rate: number) => {
  playbackRate.value = rate
  videoContext.value?.playbackRate(rate)
  showSpeedMenu.value = false
  emit('speedChange', rate)
}

const setQuality = (quality: VideoQuality) => {
  const wasPlaying = isPlaying.value
  const seekTime = currentTime.value
  
  currentQuality.value = quality.label
  
  // 切换视频源
  setTimeout(() => {
    if (seekTime > 0) {
      videoContext.value?.seek(seekTime)
    }
    if (wasPlaying) {
      videoContext.value?.play()
    }
  }, 500)
  
  showQualityMenu.value = false
  emit('qualityChange', quality.key)
}

const toggleFullscreen = () => {
  videoContext.value?.requestFullScreen({ direction: 90 })
}

const showSpeedOptions = () => {
  showSpeedMenu.value = true
  showQualityMenu.value = false
}

const showQualityOptions = () => {
  showQualityMenu.value = true
  showSpeedMenu.value = false
}

const hideSpeedMenu = () => {
  showSpeedMenu.value = false
}

const hideQualityMenu = () => {
  showQualityMenu.value = false
}

// 事件处理
const onPlay = () => {
  isPlaying.value = true
  emit('play', currentTime.value)
}

const onPause = () => {
  isPlaying.value = false
  emit('pause', currentTime.value)
}

const onEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const onTimeUpdate = (event: any) => {
  currentTime.value = event.detail.currentTime
  duration.value = event.detail.duration
  emit('progress', currentTime.value, duration.value)
  
  // 保存播放进度
  saveProgress()
}

const onWaiting = () => {
  isBuffering.value = true
}

const onError = (error: any) => {
  console.error('视频播放错误:', error)
  uni.showToast({
    title: '视频加载失败',
    icon: 'error'
  })
}

const onFullscreenChange = (event: any) => {
  console.log('全屏状态变化:', event.detail)
}

// 工具方法
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const saveProgress = () => {
  // 每10秒保存一次进度
  if (Math.floor(currentTime.value) % 10 === 0) {
    uni.setStorageSync(`video_progress_${props.videoId}`, {
      time: currentTime.value,
      duration: duration.value,
      timestamp: Date.now()
    })
  }
}

// 清理
onUnmounted(() => {
  // 保存最终进度
  if (currentTime.value > 0) {
    uni.setStorageSync(`video_progress_${props.videoId}`, {
      time: currentTime.value,
      duration: duration.value,
      timestamp: Date.now()
    })
  }
})
</script>

<style lang="scss" scoped>
.video-player-container {
  position: relative;
  width: 100%;
  background: #000;
  
  .video-element {
    width: 100%;
    height: 100%;
  }
  
  .custom-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    padding: 20rpx;
    
    .controls-row {
      display: flex;
      align-items: center;
      gap: 20rpx;
    }
    
    .control-btn {
      padding: 10rpx;
      color: white;
      
      .icon {
        font-size: 32rpx;
      }
    }
    
    .progress-container {
      flex: 1;
      padding: 10rpx 0;
      
      .progress-bg {
        position: relative;
        height: 6rpx;
        background: rgba(255,255,255,0.3);
        border-radius: 3rpx;
        
        .progress-bar {
          height: 100%;
          background: #ff6b6b;
          border-radius: 3rpx;
          transition: width 0.1s;
        }
        
        .progress-dot {
          position: absolute;
          top: -6rpx;
          width: 18rpx;
          height: 18rpx;
          background: #ff6b6b;
          border-radius: 50%;
          transform: translateX(-50%);
        }
      }
    }
    
    .time-display {
      color: white;
      font-size: 24rpx;
      min-width: 120rpx;
    }
    
    .speed-selector,
    .quality-selector {
      padding: 8rpx 16rpx;
      background: rgba(255,255,255,0.2);
      border-radius: 8rpx;
      color: white;
      font-size: 24rpx;
    }
  }
  
  .speed-menu,
  .quality-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    
    .menu-content {
      background: white;
      border-radius: 16rpx;
      padding: 20rpx;
      min-width: 200rpx;
      
      .menu-item {
        padding: 24rpx;
        text-align: center;
        border-radius: 8rpx;
        margin-bottom: 8rpx;
        
        &.active {
          background: #ff6b6b;
          color: white;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  
  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 20rpx 40rpx;
    border-radius: 8rpx;
    
    .loading-text {
      font-size: 28rpx;
    }
  }
}
</style>
```

### 2. 智能学习路径推荐
基于学习行为数据，为学生推荐个性化的学习路径。

**算法实现**:
```typescript
// utils/learningPathRecommendation.ts
interface LearningRecord {
  courseId: string
  chapterId: string
  completionRate: number
  timeSpent: number
  score: number
  difficulty: number
  timestamp: Date
}

interface StudentProfile {
  id: string
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  learningPace: 'slow' | 'normal' | 'fast'
  preferredDifficulty: 'easy' | 'medium' | 'hard'
  strongSubjects: string[]
  weakSubjects: string[]
  availableTime: number // 每日可学习时间(分钟)
}

interface Course {
  id: string
  title: string
  difficulty: number
  estimatedTime: number
  prerequisites: string[]
  tags: string[]
  rating: number
}

class LearningPathRecommendation {
  private studentProfiles: Map<string, StudentProfile> = new Map()
  private learningRecords: Map<string, LearningRecord[]> = new Map()
  private courses: Course[] = []

  // 分析学习模式
  analyzeLearningPattern(studentId: string): StudentProfile {
    const records = this.learningRecords.get(studentId) || []
    
    if (records.length === 0) {
      return this.getDefaultProfile(studentId)
    }

    // 分析学习节奏
    const avgTimePerSession = records.reduce((sum, record) => sum + record.timeSpent, 0) / records.length
    const learningPace = avgTimePerSession > 60 ? 'slow' : avgTimePerSession > 30 ? 'normal' : 'fast'

    // 分析偏好难度
    const avgDifficulty = records.reduce((sum, record) => sum + record.difficulty, 0) / records.length
    const preferredDifficulty = avgDifficulty > 0.7 ? 'hard' : avgDifficulty > 0.4 ? 'medium' : 'easy'

    // 分析强弱科目
    const subjectScores = new Map<string, number[]>()
    records.forEach(record => {
      const course = this.courses.find(c => c.id === record.courseId)
      if (course) {
        course.tags.forEach(tag => {
          if (!subjectScores.has(tag)) {
            subjectScores.set(tag, [])
          }
          subjectScores.get(tag)!.push(record.score)
        })
      }
    })

    const subjectAvgScores = Array.from(subjectScores.entries()).map(([subject, scores]) => ({
      subject,
      avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }))

    const strongSubjects = subjectAvgScores
      .filter(item => item.avgScore > 80)
      .map(item => item.subject)

    const weakSubjects = subjectAvgScores
      .filter(item => item.avgScore < 60)
      .map(item => item.subject)

    return {
      id: studentId,
      learningStyle: 'mixed', // 需要更复杂的分析
      learningPace,
      preferredDifficulty,
      strongSubjects,
      weakSubjects,
      availableTime: 60 // 默认60分钟
    }
  }

  // 生成个性化学习路径
  generateLearningPath(studentId: string, targetSubject: string, timeLimit: number): Course[] {
    const profile = this.studentProfiles.get(studentId) || this.analyzeLearningPattern(studentId)
    const availableCourses = this.courses.filter(course => 
      course.tags.includes(targetSubject) && 
      course.estimatedTime <= timeLimit
    )

    // 协同过滤推荐
    const collaborativeRecommendations = this.getCollaborativeRecommendations(studentId, availableCourses)
    
    // 基于内容的推荐
    const contentBasedRecommendations = this.getContentBasedRecommendations(profile, availableCourses)
    
    // 混合推荐算法
    const hybridRecommendations = this.combineRecommendations(
      collaborativeRecommendations,
      contentBasedRecommendations,
      profile
    )

    // 构建学习路径
    return this.buildLearningPath(hybridRecommendations, profile, timeLimit)
  }

  // 协同过滤推荐
  private getCollaborativeRecommendations(studentId: string, courses: Course[]): Course[] {
    const currentStudentRecords = this.learningRecords.get(studentId) || []
    const currentStudentCourses = new Set(currentStudentRecords.map(r => r.courseId))

    // 找到相似学生
    const similarStudents = this.findSimilarStudents(studentId)
    
    // 统计相似学生喜欢的课程
    const courseScores = new Map<string, number>()
    
    similarStudents.forEach(({ studentId: similarStudentId, similarity }) => {
      const records = this.learningRecords.get(similarStudentId) || []
      records.forEach(record => {
        if (!currentStudentCourses.has(record.courseId) && record.score > 70) {
          const currentScore = courseScores.get(record.courseId) || 0
          courseScores.set(record.courseId, currentScore + similarity * (record.score / 100))
        }
      })
    })

    // 返回评分最高的课程
    return Array.from(courseScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([courseId]) => courses.find(c => c.id === courseId))
      .filter(Boolean) as Course[]
  }

  // 基于内容的推荐
  private getContentBasedRecommendations(profile: StudentProfile, courses: Course[]): Course[] {
    return courses
      .map(course => ({
        course,
        score: this.calculateContentScore(course, profile)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.course)
  }

  // 计算内容匹配分数
  private calculateContentScore(course: Course, profile: StudentProfile): number {
    let score = 0

    // 难度匹配
    const difficultyMatch = this.getDifficultyMatch(course.difficulty, profile.preferredDifficulty)
    score += difficultyMatch * 0.3

    // 时间匹配
    const timeMatch = course.estimatedTime <= profile.availableTime ? 1 : 0.5
    score += timeMatch * 0.2

    // 强科目加分
    const strongSubjectBonus = course.tags.some(tag => profile.strongSubjects.includes(tag)) ? 0.3 : 0
    score += strongSubjectBonus

    // 弱科目需要额外支持
    const weakSubjectPenalty = course.tags.some(tag => profile.weakSubjects.includes(tag)) ? -0.1 : 0
    score += weakSubjectPenalty

    // 课程评分
    score += (course.rating / 5) * 0.2

    return Math.max(0, Math.min(1, score))
  }

  // 构建学习路径
  private buildLearningPath(courses: Course[], profile: StudentProfile, timeLimit: number): Course[] {
    const path: Course[] = []
    let totalTime = 0
    const completedCourses = new Set<string>()

    // 按依赖关系和推荐分数排序
    const sortedCourses = this.topologicalSort(courses)

    for (const course of sortedCourses) {
      // 检查时间限制
      if (totalTime + course.estimatedTime > timeLimit) {
        continue
      }

      // 检查前置课程
      const hasPrerequisites = course.prerequisites.every(prereq => 
        completedCourses.has(prereq)
      )

      if (hasPrerequisites) {
        path.push(course)
        totalTime += course.estimatedTime
        completedCourses.add(course.id)
      }
    }

    return path
  }

  // 拓扑排序处理课程依赖
  private topologicalSort(courses: Course[]): Course[] {
    const graph = new Map<string, string[]>()
    const inDegree = new Map<string, number>()

    // 构建图
    courses.forEach(course => {
      graph.set(course.id, course.prerequisites)
      inDegree.set(course.id, course.prerequisites.length)
    })

    // 拓扑排序
    const queue: Course[] = []
    const result: Course[] = []

    courses.forEach(course => {
      if (inDegree.get(course.id) === 0) {
        queue.push(course)
      }
    })

    while (queue.length > 0) {
      const current = queue.shift()!
      result.push(current)

      courses.forEach(course => {
        if (course.prerequisites.includes(current.id)) {
          const newInDegree = inDegree.get(course.id)! - 1
          inDegree.set(course.id, newInDegree)
          
          if (newInDegree === 0) {
            queue.push(course)
          }
        }
      })
    }

    return result
  }

  // 找到相似学生
  private findSimilarStudents(studentId: string): Array<{ studentId: string; similarity: number }> {
    const currentRecords = this.learningRecords.get(studentId) || []
    const similarities: Array<{ studentId: string; similarity: number }> = []

    this.learningRecords.forEach((records, otherStudentId) => {
      if (otherStudentId !== studentId) {
        const similarity = this.calculateCosineSimilarity(currentRecords, records)
        if (similarity > 0.3) { // 相似度阈值
          similarities.push({ studentId: otherStudentId, similarity })
        }
      }
    })

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 10)
  }

  // 计算余弦相似度
  private calculateCosineSimilarity(records1: LearningRecord[], records2: LearningRecord[]): number {
    const courses1 = new Map(records1.map(r => [r.courseId, r.score]))
    const courses2 = new Map(records2.map(r => [r.courseId, r.score]))
    
    const commonCourses = Array.from(courses1.keys()).filter(courseId => courses2.has(courseId))
    
    if (commonCourses.length === 0) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    commonCourses.forEach(courseId => {
      const score1 = courses1.get(courseId)!
      const score2 = courses2.get(courseId)!
      
      dotProduct += score1 * score2
      norm1 += score1 * score1
      norm2 += score2 * score2
    })

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  private getDifficultyMatch(courseDifficulty: number, preferredDifficulty: string): number {
    const difficultyMap = { easy: 0.3, medium: 0.6, hard: 0.9 }
    const preferred = difficultyMap[preferredDifficulty]
    return 1 - Math.abs(courseDifficulty - preferred)
  }

  private getDefaultProfile(studentId: string): StudentProfile {
    return {
      id: studentId,
      learningStyle: 'mixed',
      learningPace: 'normal',
      preferredDifficulty: 'medium',
      strongSubjects: [],
      weakSubjects: [],
      availableTime: 60
    }
  }

  private combineRecommendations(
    collaborative: Course[],
    contentBased: Course[],
    profile: StudentProfile
  ): Course[] {
    const combined = new Map<string, { course: Course; score: number }>()

    // 协同过滤权重
    collaborative.forEach((course, index) => {
      const score = (collaborative.length - index) / collaborative.length * 0.6
      combined.set(course.id, { course, score })
    })

    // 基于内容权重
    contentBased.forEach((course, index) => {
      const score = (contentBased.length - index) / contentBased.length * 0.4
      const existing = combined.get(course.id)
      
      if (existing) {
        existing.score += score
      } else {
        combined.set(course.id, { course, score })
      }
    })

    return Array.from(combined.values())
      .sort((a, b) => b.score - a.score)
      .map(item => item.course)
  }
}

export default new LearningPathRecommendation()
```

### 3. 在线考试系统
支持多种题型、防作弊、自动阅卷等功能。

## 🛠️ 技术架构

### 整体架构
```
前端小程序 (uni-app + Vue3)
    ↓
CDN (视频/图片资源)
    ↓
API网关 (Nginx + Kong)
    ↓
微服务集群
    ├── 用户服务 (Spring Boot)
    ├── 课程服务 (Spring Boot)
    ├── 学习服务 (Spring Boot)
    ├── 考试服务 (Spring Boot)
    ├── 推荐服务 (Python + TensorFlow)
    └── 通知服务 (Node.js)
    ↓
数据存储层
    ├── MySQL (用户/课程数据)
    ├── MongoDB (学习记录)
    ├── Redis (缓存/会话)
    ├── Elasticsearch (搜索)
    └── MinIO (文件存储)
```

## 📊 性能优化

### 1. 视频加载优化
```typescript
// utils/videoOptimization.ts
class VideoOptimization {
  private preloadQueue: string[] = []
  private cache: Map<string, string> = new Map()

  // 预加载下一个视频
  preloadNextVideo(currentIndex: number, playlist: string[]) {
    const nextIndex = currentIndex + 1
    if (nextIndex < playlist.length) {
      const nextVideoUrl = playlist[nextIndex]
      this.preloadVideo(nextVideoUrl)
    }
  }

  // 智能缓存策略
  private preloadVideo(url: string) {
    if (this.cache.has(url)) return

    uni.downloadFile({
      url,
      success: (res) => {
        this.cache.set(url, res.tempFilePath)
        console.log('视频预加载完成:', url)
      },
      fail: (error) => {
        console.error('视频预加载失败:', error)
      }
    })
  }

  // 获取缓存的视频
  getCachedVideo(url: string): string | null {
    return this.cache.get(