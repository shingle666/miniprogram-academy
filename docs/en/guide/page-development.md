# Page Development

Pages are the fundamental building blocks of mini programs. Each page represents a screen that users interact with. This guide covers the essentials of page development in mini programs.

## Page Structure

A mini program page typically consists of four files:

1. **JavaScript File (.js)**: Contains the page logic
2. **Template File (.wxml/.axml/.swan)**: Contains the page structure
3. **Style File (.wxss/.acss/.css)**: Contains the page styling
4. **Configuration File (.json)**: Contains the page configuration

## Creating a New Page

### 1. Create the Page Directory

First, create a new directory for your page in the `pages` folder:

```
pages/
└── my-page/
```

### 2. Create the Page Files

Create the four required files in the page directory:

```
pages/
└── my-page/
    ├── my-page.js
    ├── my-page.wxml
    ├── my-page.wxss
    └── my-page.json
```

### 3. Register the Page

Add the page path to the `pages` array in `app.json`:

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs",
    "pages/my-page/my-page"
  ]
}
```

## Page JavaScript

The page JavaScript file defines the page instance, data, and methods.

### Basic Structure

```javascript
// pages/my-page/my-page.js
Page({
  // Page initial data
  data: {
    title: 'My Page',
    items: ['Item 1', 'Item 2', 'Item 3']
  },

  // Lifecycle functions
  onLoad(options) {
    // Page load
    console.log('Page loaded with options:', options)
  },
  
  onReady() {
    // Page initial rendering complete
    console.log('Page ready')
  },
  
  onShow() {
    // Page entering the foreground
    console.log('Page shown')
  },
  
  onHide() {
    // Page entering the background
    console.log('Page hidden')
  },
  
  onUnload() {
    // Page closed
    console.log('Page unloaded')
  },
  
  // Page event handlers
  handleTap() {
    this.setData({
      title: 'Title Updated!'
    })
  },
  
  // Custom methods
  fetchData() {
    // Fetch data from API
    wx.request({
      url: 'https://api.example.com/data',
      success: (res) => {
        this.setData({
          items: res.data.items
        })
      }
    })
  }
})
```

### Page Lifecycle

1. **onLoad**: Called when the page is first loaded
2. **onShow**: Called when the page enters the foreground
3. **onReady**: Called after the page's first rendering
4. **onHide**: Called when the page enters the background
5. **onUnload**: Called when the page is closed

### Data Management

Use `this.setData()` to update the page data and trigger UI updates:

```javascript
this.setData({
  title: 'New Title',
  'user.name': 'John',
  'items[0]': 'Updated Item'
})
```

## Page Template

The page template file defines the structure and layout of the page using a markup language similar to HTML.

### Basic Structure

```html
<!-- pages/my-page/my-page.wxml -->
<view class="container">
  <view class="header">
    <text class="title">{{title}}</text>
  </view>
  
  <view class="content">
    <block wx:for="{{items}}" wx:key="index">
      <view class="item">{{item}}</view>
    </block>
  </view>
  
  <view class="footer">
    <button bindtap="handleTap">Update Title</button>
  </view>
</view>
```

### Data Binding

Bind data from the JavaScript file to the template:

```html
<text>{{title}}</text>
```

### Conditional Rendering

Use `wx:if`, `wx:elif`, and `wx:else` for conditional rendering:

```html
<view wx:if="{{condition}}">Shown if condition is true</view>
<view wx:elif="{{anotherCondition}}">Shown if anotherCondition is true</view>
<view wx:else>Shown otherwise</view>
```

### List Rendering

Use `wx:for` to render lists:

```html
<view wx:for="{{items}}" wx:key="index">
  {{index}}: {{item}}
</view>
```

Customize the item and index variable names:

```html
<view wx:for="{{items}}" wx:for-item="product" wx:for-index="idx" wx:key="idx">
  {{idx}}: {{product}}
</view>
```

### Event Handling

Bind events to methods defined in the JavaScript file:

```html
<button bindtap="handleTap">Click Me</button>
```

Pass data with the event:

```html
<button bindtap="handleItemTap" data-id="{{item.id}}">View Item</button>
```

In the JavaScript file:

```javascript
handleItemTap(event) {
  const itemId = event.currentTarget.dataset.id
  console.log('Item ID:', itemId)
}
```

## Page Styling

The page style file contains CSS rules specific to the page.

### Basic Structure

```css
/* pages/my-page/my-page.wxss */
.container {
  padding: 20rpx;
}

.header {
  margin-bottom: 20rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
}

.content {
  margin-bottom: 20rpx;
}

.item {
  padding: 10rpx;
  border-bottom: 1rpx solid #eee;
}

.footer {
  margin-top: 20rpx;
}
```

### Units

- **rpx**: Responsive pixel, adapts to screen size (750rpx = screen width)
- **px**: Physical pixel
- **em**: Relative to the font-size of the element
- **rem**: Relative to the font-size of the root element

### Import Styles

Import styles from other files:

```css
@import "../../common/styles/common.wxss";
```

## Page Configuration

The page configuration file contains settings specific to the page.

### Basic Structure

```json
{
  "navigationBarTitleText": "My Page",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#f8f8f8",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "usingComponents": {
    "custom-component": "/components/custom/custom"
  }
}
```

### Common Configuration Options

- **navigationBarTitleText**: Sets the title in the navigation bar
- **navigationBarBackgroundColor**: Sets the background color of the navigation bar
- **navigationBarTextStyle**: Sets the text color of the navigation bar (black/white)
- **backgroundColor**: Sets the background color of the page
- **backgroundTextStyle**: Sets the style of the pull-down loading indicator (dark/light)
- **enablePullDownRefresh**: Enables pull-down refresh functionality
- **usingComponents**: Registers custom components for use in the page

## Page Navigation

### Navigate to a Page

```javascript
wx.navigateTo({
  url: '/pages/another-page/another-page?id=123',
  success: function() {
    console.log('Navigation successful')
  },
  fail: function(error) {
    console.error('Navigation failed:', error)
  }
})
```

### Redirect to a Page (Replace Current Page)

```javascript
wx.redirectTo({
  url: '/pages/another-page/another-page?id=123'
})
```

### Navigate Back

```javascript
wx.navigateBack({
  delta: 1 // Number of pages to go back
})
```

### Switch Tab

```javascript
wx.switchTab({
  url: '/pages/home/home'
})
```

### Receiving Parameters

In the target page's `onLoad` function:

```javascript
onLoad(options) {
  const id = options.id
  console.log('Received ID:', id)
}
```

## Pull-Down Refresh

Enable pull-down refresh in the page configuration:

```json
{
  "enablePullDownRefresh": true
}
```

Handle the refresh event:

```javascript
onPullDownRefresh() {
  // Refresh data
  this.fetchData()
    .then(() => {
      // Stop pull-down refresh animation
      wx.stopPullDownRefresh()
    })
}
```

## Reach Bottom Event

Handle the reach bottom event for infinite scrolling:

```javascript
onReachBottom() {
  // Load more data
  this.loadMoreData()
}
```

## Page Sharing

Configure page sharing:

```javascript
onShareAppMessage() {
  return {
    title: 'Check out this page!',
    path: '/pages/my-page/my-page?id=123',
    imageUrl: '/assets/share-image.png'
  }
}
```

## Best Practices

1. **Keep Pages Focused**: Each page should have a single responsibility
2. **Separate Logic**: Move complex logic to separate modules
3. **Optimize Data**: Only store necessary data in the page instance
4. **Use Components**: Break down complex UIs into reusable components
5. **Handle Errors**: Implement proper error handling for API calls
6. **Optimize Performance**: Minimize unnecessary renders and data updates
7. **Follow Platform Guidelines**: Adhere to the design guidelines of each platform

## Next Steps

Now that you understand page development, you can proceed to learn about:

- [Component Development](./component-development.md)
- [Data Binding](./data-binding.md)
- [Event Handling](./event-handling.md)