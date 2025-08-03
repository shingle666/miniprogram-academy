# 性能优化

性能优化是小程序开发中的重要环节，良好的性能可以提升用户体验，增加用户留存率。本指南将介绍小程序性能优化的关键策略和最佳实践。

## 启动性能优化

### 减小代码包体积

小程序有严格的代码包大小限制，减小包体积可以加快下载和启动速度：

1. **代码压缩和混淆**
   - 使用工具如 UglifyJS 压缩 JavaScript 代码
   - 使用 CSSO 或 CleanCSS 压缩 CSS/WXSS 代码
   - 移除未使用的代码和注释

2. **分包加载**
   - 将小程序拆分为主包和多个分包
   - 主包只保留最核心的页面和功能
   - 用户进入分包页面时才加载对应分包

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/user/user"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/detail/detail",
        "pages/list/list"
      ]
    },
    {
      "root": "packageB",
      "pages": [
        "pages/settings/settings",
        "pages/about/about"
      ]
    }
  ]
}
```

3. **独立分包**
   - 可单独下载使用，不依赖主包
   - 适用于临时活动页面等相对独立的功能

```json
// app.json
{
  "pages": ["pages/index/index"],
  "subpackages": [
    {
      "root": "independent",
      "pages": [
        "pages/activity/activity"
      ],
      "independent": true
    }
  ]
}
```

4. **按需注入**
   - 使用条件编译，只在特定平台引入代码
   - 延迟加载非关键资源

### 优化小程序启动流程

1. **预加载分包**
   - 在合适的时机预加载可能需要的分包

```javascript
// 在合适的时机预加载分包
wx.preloadSubpackage({
  name: 'packageA',
  success: function() {
    console.log('分包预加载成功');
  },
  fail: function() {
    console.log('分包预加载失败');
  }
});
```

2. **首屏关键数据预拉取**
   - 利用小程序启动参数预拉取数据
   - 使用云开发数据预拉取能力

```javascript
// app.js
App({
  onLaunch(options) {
    // 获取预拉取的数据
    const preloadData = wx.getPreloadData();
    if (preloadData) {
      this.globalData.preloadData = preloadData;
    }
  }
});
```

3. **合理设置启动页面**
   - 选择轻量级页面作为启动页
   - 避免启动页有复杂计算和渲染

## 渲染性能优化

### 减少页面重绘和回流

1. **合理使用 setData**
   - 减少 setData 调用频率
   - 减少单次 setData 数据量
   - 避免频繁操作 setData

```javascript
// 不推荐
this.setData({ value1: 'a' });
this.setData({ value2: 'b' });
this.setData({ value3: 'c' });

// 推荐
this.setData({
  value1: 'a',
  value2: 'b',
  value3: 'c'
});
```

```javascript
// 不推荐：更新整个数组
this.setData({
  list: newList
});

// 推荐：只更新变化的元素
this.setData({
  'list[0].name': 'new name',
  'list[0].value': 'new value'
});
```

2. **使用 wx:if 和 hidden 的最佳实践**
   - wx:if 适用于不频繁切换的内容（创建/销毁DOM）
   - hidden 适用于频繁切换的内容（只改变显示状态）

```html
<!-- 不频繁切换的内容使用 wx:if -->
<view wx:if="{{showDialog}}">
  <!-- 复杂的对话框内容 -->
</view>

<!-- 频繁切换的内容使用 hidden -->
<view hidden="{{!showTab}}">
  <!-- 标签页内容 -->
</view>
```

3. **避免频繁触发布局**
   - 批量修改样式
   - 使用 transform 代替改变位置的属性

```javascript
// 不推荐：频繁修改样式
function animateElement() {
  let left = 0;
  const timer = setInterval(() => {
    left += 2;
    this.setData({
      elementStyle: `left: ${left}px;`
    });
    if (left >= 100) clearInterval(timer);
  }, 16);
}

// 推荐：使用 transform
function animateElement() {
  let offset = 0;
  const timer = setInterval(() => {
    offset += 2;
    this.setData({
      elementStyle: `transform: translateX(${offset}px);`
    });
    if (offset >= 100) clearInterval(timer);
  }, 16);
}
```

### 长列表优化

1. **虚拟列表**
   - 只渲染可视区域的列表项
   - 滚动时动态创建和销毁列表项

```javascript
Page({
  data: {
    allItems: [], // 所有数据
    visibleItems: [], // 可见数据
    startIndex: 0,
    endIndex: 20,
    itemHeight: 50 // 每项高度
  },
  
  onLoad() {
    // 加载所有数据
    const allItems = [];
    for (let i = 0; i < 1000; i++) {
      allItems.push({ id: i, name: `Item ${i}` });
    }
    
    // 初始化可见数据
    const visibleItems = allItems.slice(this.data.startIndex, this.data.endIndex);
    
    this.setData({
      allItems,
      visibleItems,
      listHeight: allItems.length * this.data.itemHeight
    });
  },
  
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const startIndex = Math.floor(scrollTop / this.data.itemHeight);
    const endIndex = startIndex + Math.ceil(this.data.windowHeight / this.data.itemHeight);
    
    if (startIndex !== this.data.startIndex || endIndex !== this.data.endIndex) {
      this.setData({
        startIndex,
        endIndex,
        visibleItems: this.data.allItems.slice(startIndex, endIndex),
        listOffset: startIndex * this.data.itemHeight
      });
    }
  }
});
```

```html
<scroll-view 
  style="height: 100vh;" 
  scroll-y 
  bindscroll="onScroll"
>
  <view style="height: {{listHeight}}px; position: relative;">
    <view 
      wx:for="{{visibleItems}}" 
      wx:key="id"
      style="position: absolute; top: {{(startIndex + index) * itemHeight}}px; height: {{itemHeight}}px;"
    >
      {{item.name}}
    </view>
  </view>
</scroll-view>
```

2. **分页加载**
   - 初始只加载第一页数据
   - 滚动到底部时加载下一页

```javascript
Page({
  data: {
    list: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },
  
  onLoad() {
    this.loadData();
  },
  
  loadData() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ loading: true });
    
    // 模拟请求数据
    setTimeout(() => {
      const newItems = [];
      for (let i = 0; i < this.data.pageSize; i++) {
        const index = (this.data.page - 1) * this.data.pageSize + i;
        newItems.push({ id: index, name: `Item ${index}` });
      }
      
      // 判断是否还有更多数据
      const hasMore = this.data.page < 5; // 假设总共有5页
      
      this.setData({
        list: [...this.data.list, ...newItems],
        page: this.data.page + 1,
        hasMore,
        loading: false
      });
    }, 500);
  },
  
  onReachBottom() {
    this.loadData();
  }
});
```

```html
<view>
  <view wx:for="{{list}}" wx:key="id" class="list-item">
    {{item.name}}
  </view>
  
  <view class="loading" wx:if="{{loading}}">
    加载中...
  </view>
  
  <view class="no-more" wx:if="{{!hasMore && !loading}}">
    没有更多数据了
  </view>
</view>
```

3. **骨架屏**
   - 在数据加载前显示页面结构
   - 减少用户等待的焦虑感

```html
<!-- 骨架屏组件 -->
<template name="skeleton">
  <view class="skeleton">
    <view class="skeleton-header"></view>
    <view class="skeleton-content">
      <view class="skeleton-item" wx:for="{{[1,2,3,4,5]}}" wx:key="*this"></view>
    </view>
  </view>
</template>

<!-- 页面使用 -->
<template is="skeleton" wx:if="{{loading}}"></template>
<view wx:else>
  <!-- 实际内容 -->
</view>
```

```css
.skeleton {
  padding: 20rpx;
}

.skeleton-header {
  height: 40rpx;
  background: #f0f0f0;
  margin-bottom: 20rpx;
  border-radius: 4rpx;
}

.skeleton-item {
  height: 80rpx;
  background: #f0f0f0;
  margin-bottom: 20rpx;
  border-radius: 4rpx;
}
```

## 网络性能优化

### 请求优化

1. **合并请求**
   - 减少请求次数
   - 使用批量接口

```javascript
// 不推荐：多个独立请求
function loadData() {
  wx.request({
    url: 'https://api.example.com/user',
    success: res => {
      this.setData({ user: res.data });
    }
  });
  
  wx.request({
    url: 'https://api.example.com/products',
    success: res => {
      this.setData({ products: res.data });
    }
  });
}

// 推荐：合并请求
function loadData() {
  wx.request({
    url: 'https://api.example.com/batch',
    data: {
      requests: ['user', 'products']
    },
    success: res => {
      this.setData({
        user: res.data.user,
        products: res.data.products
      });
    }
  });
}
```

2. **请求优先级**
   - 优先加载关键数据
   - 延迟加载非关键数据

```javascript
Page({
  onLoad() {
    // 优先加载关键数据
    this.loadCriticalData();
    
    // 延迟加载非关键数据
    setTimeout(() => {
      this.loadNonCriticalData();
    }, 2000);
  },
  
  loadCriticalData() {
    // 加载页面核心数据
  },
  
  loadNonCriticalData() {
    // 加载次要数据
  }
});
```

3. **数据缓存**
   - 缓存不常变化的数据
   - 使用本地存储减少请求

```javascript
function fetchData(url, forceRefresh = false) {
  return new Promise((resolve, reject) => {
    // 缓存键
    const cacheKey = `cache_${url}`;
    // 缓存过期时间（毫秒）
    const expireTime = 5 * 60 * 1000; // 5分钟
    
    // 检查是否有有效缓存
    const cachedData = wx.getStorageSync(cacheKey);
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < expireTime) {
      resolve(cachedData.data);
      return;
    }
    
    // 没有有效缓存，发起请求
    wx.request({
      url,
      success: res => {
        // 缓存数据
        wx.setStorageSync(cacheKey, {
          data: res.data,
          timestamp: Date.now()
        });
        resolve(res.data);
      },
      fail: err => {
        // 请求失败，尝试使用过期缓存
        if (cachedData) {
          resolve(cachedData.data);
        } else {
          reject(err);
        }
      }
    });
  });
}
```

### 预加载和预请求

1. **页面预加载**
   - 预测用户可能访问的页面
   - 提前加载页面资源

```javascript
// 在用户可能跳转前预加载页面
wx.preloadPage({
  url: '/pages/detail/detail',
  success: function() {
    console.log('页面预加载成功');
  },
  fail: function() {
    console.log('页面预加载失败');
  }
});
```

2. **数据预请求**
   - 提前请求下一页可能需要的数据
   - 用户操作时直接使用缓存数据

```javascript
Page({
  data: {
    currentId: 1,
    currentItem: null,
    nextItem: null
  },
  
  onLoad(options) {
    const id = parseInt(options.id) || 1;
    this.setData({ currentId: id });
    
    // 加载当前数据
    this.loadItemData(id).then(data => {
      this.setData({ currentItem: data });
      
      // 预加载下一条数据
      return this.loadItemData(id + 1);
    }).then(data => {
      this.setData({ nextItem: data });
    });
  },
  
  // 加载数据的方法
  loadItemData(id) {
    return new Promise((resolve) => {
      wx.request({
        url: `https://api.example.com/items/${id}`,
        success: res => resolve(res.data)
      });
    });
  },
  
  // 查看下一项
  viewNextItem() {
    const nextId = this.data.currentId + 1;
    
    // 直接使用预加载的数据
    this.setData({
      currentId: nextId,
      currentItem: this.data.nextItem,
      nextItem: null
    });
    
    // 预加载下一条数据
    this.loadItemData(nextId + 1).then(data => {
      this.setData({ nextItem: data });
    });
  }
});
```

## 图片优化

### 图片加载策略

1. **图片懒加载**
   - 只加载可视区域内的图片
   - 滚动时动态加载新图片

```html
<view wx:for="{{images}}" wx:key="id">
  <image 
    lazy-load 
    src="{{item.show ? item.src : ''}}" 
    data-index="{{index}}"
    bindload="imageLoaded"
  ></image>
</view>
```

```javascript
Page({
  data: {
    images: [
      { id: 1, src: 'image1.jpg', show: false },
      { id: 2, src: 'image2.jpg', show: false },
      // ...更多图片
    ]
  },
  
  onPageScroll(e) {
    // 根据滚动位置判断哪些图片应该显示
    this.checkImagesVisibility();
  },
  
  checkImagesVisibility() {
    const query = wx.createSelectorQuery();
    query.selectAll('image').boundingClientRect();
    query.exec(res => {
      const images = [...this.data.images];
      const screenHeight = wx.getSystemInfoSync().windowHeight;
      
      res[0].forEach((rect, index) => {
        // 判断图片是否在可视区域内或即将进入可视区域
        if (rect.top < screenHeight + 300 && rect.bottom > -300) {
          images[index].show = true;
        }
      });
      
      this.setData({ images });
    });
  },
  
  imageLoaded(e) {
    const index = e.currentTarget.dataset.index;
    console.log(`图片 ${index} 加载完成`);
  },
  
  onLoad() {
    // 初始检查哪些图片可见
    setTimeout(() => {
      this.checkImagesVisibility();
    }, 300);
  }
});
```

2. **图片预加载**
   - 提前加载重要图片
   - 使用小程序图片预加载 API

```javascript
// 预加载图片
function preloadImages(urls) {
  urls.forEach(url => {
    wx.getImageInfo({
      src: url,
      success: () => console.log(`预加载图片成功: ${url}`),
      fail: () => console.log(`预加载图片失败: ${url}`)
    });
  });
}

// 使用
Page({
  onLoad() {
    // 预加载重要图片
    preloadImages([
      'https://example.com/banner1.jpg',
      'https://example.com/banner2.jpg'
    ]);
  }
});
```

### 图片资源优化

1. **选择合适的图片格式**
   - JPEG：适合照片和复杂图像
   - PNG：适合需要透明度的图像
   - WebP：更小的文件大小，但需要检查兼容性
   - SVG：适合图标和简单图形

2. **图片压缩**
   - 使用工具压缩图片（如 TinyPNG）
   - 根据实际显示尺寸调整图片大小

3. **使用 CDN**
   - 利用 CDN 加速图片加载
   - 选择离用户近的节点

```javascript
// 配置 CDN 域名
const CDN_BASE = 'https://cdn.example.com/images/';

// 使用 CDN 路径
function getImageUrl(path) {
  return `${CDN_BASE}${path}`;
}

Page({
  data: {
    bannerImage: getImageUrl('banner.jpg'),
    productImages: [
      getImageUrl('product1.jpg'),
      getImageUrl('product2.jpg')
    ]
  }
});
```

## 存储优化

### 合理使用本地存储

1. **存储策略**
   - 只存储必要的数据
   - 定期清理过期数据
   - 避免存储过大的数据

```javascript
// 存储管理工具
const Storage = {
  // 设置带过期时间的数据
  set(key, data, expireSeconds) {
    wx.setStorageSync(key, {
      data,
      expire: expireSeconds ? Date.now() + expireSeconds * 1000 : null
    });
  },
  
  // 获取数据，自动处理过期情况
  get(key) {
    const item = wx.getStorageSync(key);
    if (!item) return null;
    
    // 检查是否过期
    if (item.expire && Date.now() > item.expire) {
      wx.removeStorageSync(key);
      return null;
    }
    
    return item.data;
  },
  
  // 清理所有过期数据
  clearExpired() {
    const keys = wx.getStorageInfoSync().keys;
    keys.forEach(key => {
      this.get(key); // 会自动检查并清理过期数据
    });
  }
};

// 使用示例
Page({
  onLoad() {
    // 清理过期数据
    Storage.clearExpired();
    
    // 存储数据，设置1天过期
    Storage.set('userInfo', { name: '张三' }, 86400);
    
    // 获取数据
    const userInfo = Storage.get('userInfo');
    console.log(userInfo);
  }
});
```

2. **存储容量监控**
   - 监控存储使用情况
   - 超过阈值时清理不重要的数据

```javascript
function checkStorageSize() {
  const { currentSize, limitSize } = wx.getStorageInfoSync();
  const usageRate = currentSize / limitSize;
  
  console.log(`存储使用率: ${(usageRate * 100).toFixed(2)}%`);
  
  // 如果使用率超过80%，清理部分数据
  if (usageRate > 0.8) {
    clearLowPriorityData();
  }
}

function clearLowPriorityData() {
  // 清理优先级低的缓存数据
  const lowPriorityKeys = ['tempImages', 'searchHistory', 'viewedProducts'];
  
  lowPriorityKeys.forEach(key => {
    wx.removeStorageSync(key);
  });
  
  console.log('已清理低优先级数据');
}
```

## 小程序框架优化

### 使用 WXS 提升性能

WXS 可以在视图层直接运行，避免了逻辑层和视图层的通信开销：

```html
<!-- 使用 WXS 格式化价格 -->
<wxs module="format">
function formatPrice(price) {
  return '¥' + parseFloat(price).toFixed(2);
}

module.exports = {
  price: formatPrice
};
</wxs>

<view>商品价格: {{format.price(product.price)}}</view>
```

### 使用 Component 构造器

组件化开发可以提高代码复用性和性能：

```javascript
// 自定义组件
Component({
  properties: {
    items: {
      type: Array,
      value: []
    }
  },
  
  data: {
    activeIndex: -1
  },
  
  methods: {
    selectItem(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({ activeIndex: index });
      this.triggerEvent('select', { index, item: this.data.items[index] });
    }
  }
});
```

```html
<!-- 使用自定义组件 -->
<custom-list 
  items="{{listData}}" 
  bind:select="handleItemSelect"
></custom-list>
```

### 使用 behaviors 复用代码

behaviors 类似于 mixins，可以复用组件逻辑：

```javascript
// 定义 behavior
const listBehavior = Behavior({
  data: {
    loading: false,
    list: [],
    page: 1,
    hasMore: true
  },
  
  methods: {
    loadMore() {
      if (this.data.loading || !this.data.hasMore) return;
      
      this.setData({ loading: true });
      
      // 加载数据的逻辑
      this.fetchData(this.data.page).then(res => {
        const newList = [...this.data.list, ...res.data];
        this.setData({
          list: newList,
          page: this.data.page + 1,
          hasMore: res.hasMore,
          loading: false
        });
      });
    }
  }
});

// 在组件中使用 behavior
Component({
  behaviors: [listBehavior],
  
  methods: {
    fetchData(page) {
      // 实现具体的数据获取逻辑
      return new Promise(resolve => {
        wx.request({
          url: `https://api.example.com/list?page=${page}`,
          success: res => resolve(res.data)
        });
      });
    }
  }
});
```

## 工具和监控

### 性能监控

1. **小程序性能监控 API**
   - 使用 Performance API 监控关键性能指标

```javascript
const performance = wx.getPerformance();
const observer = performance.createObserver((entryList) => {
  const entries = entryList.getEntries();
  entries.forEach((entry) => {
    console.log('性能指标:', entry.name, entry.duration);
  });
});

// 监听页面性能
observer.observe({ entryTypes: ['navigation', 'render', 'script'] });
```

2. **自定义性能打点**
   - 在关键流程添加性能打点

```javascript
const performanceData = {};

// 开始计时
function startMeasure(name) {
  performanceData[name] = Date.now();
}

// 结束计时并记录
function endMeasure(name) {
  if (!performanceData[name]) return;
  
  const duration = Date.now() - performanceData[name];
  console.log(`${name} 耗时: ${duration}ms`);
  
  // 可以上报到服务器
  reportPerformance(name, duration);
  
  delete performanceData[name];
}

// 使用示例
Page({
  onLoad() {
    startMeasure('pageLoad');
    
    // 加载数据
    startMeasure('fetchData');
    this.fetchData().then(() => {
      endMeasure('fetchData');
      endMeasure('pageLoad');
    });
  }
});
```

### 使用开发者工具分析性能

1. **Audits 面板**
   - 使用微信开发者工具的 Audits 面板分析性能问题
   - 根据建议优化代码

2. **Memory 面板**
   - 监控内存使用情况
   - 排查内存泄漏问题

3. **Performance 面板**
   - 分析渲染性能
   - 识别性能瓶颈

## 最佳实践总结

1. **启动优化**
   - 减小代码包体积
   - 使用分包加载
   - 优化启动流程

2. **渲染优化**
   - 合理使用 setData
   - 优化长列表渲染
   - 减少页面重绘和回流

3. **网络优化**
   - 合并和优化请求
   - 实施数据缓存策略
   - 使用预加载和预请求

4. **图片优化**
   - 实现图片懒加载
   - 压缩和优化图片资源
   - 使用合适的图片格式

5. **存储优化**
   - 合理使用本地存储
   - 定期清理过期数据
   - 监控存储使用情况

6. **框架优化**
   - 使用 WXS 提升性能
   - 组件化开发
   - 使用 behaviors 复用代码

7. **持续监控**
   - 实施性能监控
   - 定期分析性能数据
   - 持续优化改进

## 下一步

现在你已经了解了小程序性能优化的关键策略，可以继续学习：

- [调试技巧](./debugging-tips.md)
- [最佳实践](./best-practices.md)
- [发布部署](./deployment.md)