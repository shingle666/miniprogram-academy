# Basic Concepts

## What are Mini Programs?

Mini Programs are lightweight applications that run within a super app (like WeChat, Alipay, etc.) without requiring separate installation. They provide a way for users to access services quickly without leaving the host application.

## Key Features of Mini Programs

- **No Installation Required**: Users can access mini programs directly within the host app
- **Small Size**: Mini programs are designed to be lightweight
- **Cross-Platform**: Many frameworks allow development for multiple platforms
- **Native-Like Experience**: They offer performance close to native apps
- **Easy Access**: Can be accessed via QR codes, search, or sharing

## Core Components

### App Instance

The App instance is the global entry point of a mini program. It manages the application lifecycle and global data.

```javascript
// app.js
App({
  onLaunch() {
    // Called when the mini program is launched
    console.log('App launched')
  },
  onShow() {
    // Called when the mini program is shown to the user
    console.log('App shown')
  },
  onHide() {
    // Called when the mini program is hidden
    console.log('App hidden')
  },
  globalData: {
    // Global data accessible throughout the app
    userInfo: null
  }
})
```

### Page Instance

Pages are the individual screens of a mini program. Each page has its own lifecycle and data.

```javascript
// pages/index/index.js
Page({
  data: {
    // Page data, used for rendering
    message: 'Hello World'
  },
  onLoad() {
    // Called when the page is first loaded
    console.log('Page loaded')
  },
  onShow() {
    // Called when the page is shown
    console.log('Page shown')
  },
  onHide() {
    // Called when the page is hidden
    console.log('Page hidden')
  },
  onUnload() {
    // Called when the page is unloaded
    console.log('Page unloaded')
  }
})
```

### Component Instance

Components are reusable UI elements that can be used across different pages.

```javascript
// components/custom/custom.js
Component({
  properties: {
    // Properties passed from parent
    title: {
      type: String,
      value: 'Default Title'
    }
  },
  data: {
    // Component internal data
    count: 0
  },
  methods: {
    // Component methods
    increment() {
      this.setData({
        count: this.data.count + 1
      })
    }
  }
})
```

## File Structure

Mini programs typically have the following file types:

### JavaScript Files (.js)

Contains the logic for the app, pages, and components.

### Template Files (.wxml, .axml, .swan, etc.)

Contains the structure and layout of the UI. The extension depends on the platform:
- WeChat: .wxml
- Alipay: .axml
- Baidu: .swan
- ByteDance: .ttml
- QQ: .qml

### Style Files (.wxss, .acss, .css, etc.)

Contains the styling for the UI. The extension depends on the platform:
- WeChat: .wxss
- Alipay: .acss
- Baidu: .css
- ByteDance: .ttss
- QQ: .qss

### Configuration Files (.json)

Contains configuration information for the app, pages, and components.

## Data Binding

Mini programs use a data binding system to connect the UI with the JavaScript data.

```html
<!-- One-way data binding -->
<view>{{message}}</view>

<!-- Event binding -->
<button bindtap="handleTap">Click Me</button>
```

```javascript
Page({
  data: {
    message: 'Hello World'
  },
  handleTap() {
    this.setData({
      message: 'Button clicked!'
    })
  }
})
```

## Lifecycle

### App Lifecycle

1. **onLaunch**: Called when the mini program is first launched
2. **onShow**: Called when the mini program is shown to the user
3. **onHide**: Called when the mini program is hidden
4. **onError**: Called when a JavaScript error occurs
5. **onPageNotFound**: Called when a page is not found

### Page Lifecycle

1. **onLoad**: Called when the page is first loaded
2. **onShow**: Called when the page is shown
3. **onReady**: Called when the page is ready (after first render)
4. **onHide**: Called when the page is hidden
5. **onUnload**: Called when the page is unloaded

### Component Lifecycle

1. **created**: Called when the component instance is created
2. **attached**: Called when the component is attached to the page
3. **ready**: Called when the component is ready (after first render)
4. **moved**: Called when the component is moved to another position
5. **detached**: Called when the component is detached from the page

## Next Steps

Now that you understand the basic concepts of mini programs, you can proceed to learn about:

- [Project Structure](./project-structure.md)
- [Page Development](./page-development.md)
- [Component Development](./component-development.md)