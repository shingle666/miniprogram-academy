# Debugging Tips

Effective debugging is essential for mini program development. This guide provides practical tips and techniques to help you identify and fix issues in your mini program applications.

## Developer Tools

### Using the Official Developer Tools

Each mini program platform provides official developer tools with built-in debugging capabilities:

- **WeChat Developer Tools**: For WeChat mini programs
- **Alipay Developer Tools**: For Alipay mini programs
- **Baidu Developer Tools**: For Baidu smart programs
- **ByteDance Developer Tools**: For ByteDance mini programs
- **QQ Developer Tools**: For QQ mini programs

These tools typically include the following debugging features:

#### Console

The console is the most basic debugging tool for viewing log output and error messages:

```javascript
// Output different levels of logs
console.log('Normal log message');
console.info('Info level message');
console.warn('Warning level message');
console.error('Error level message');

// Output objects
console.log('User info:', userInfo);

// Group output
console.group('Group title');
console.log('Group content 1');
console.log('Group content 2');
console.groupEnd();

// Timing
console.time('Operation time');
// Perform some operations
console.timeEnd('Operation time');
```

#### Network Monitor

The network panel monitors all network requests and shows detailed information about requests and responses:

- Request URL and method
- Request headers and body
- Response status code and body
- Request timing

#### Storage Viewer

You can view and edit the local storage data of your mini program:

- Local storage
- Cache
- Cookies (if applicable)

#### Performance Monitor

The performance panel helps identify performance bottlenecks:

- Page load time
- Rendering performance
- Memory usage
- Frame rate monitoring

### Real Device Debugging

The simulator in developer tools cannot fully simulate the environment of real devices, so real device debugging is important:

1. Select "Preview" or "Real Device Debugging" in the developer tools
2. Scan the QR code with your phone
3. Test and debug on the real device

## Common Debugging Techniques

### Breakpoint Debugging

Setting breakpoints in your code allows you to pause execution and inspect variable states:

1. Open the source code file in the developer tools
2. Click on the line number to set a breakpoint
3. When code execution reaches the breakpoint, you can:
   - Inspect variable values
   - Step through execution
   - Continue or skip execution

You can also set breakpoints programmatically:

```javascript
debugger; // Code execution will automatically pause here
```

### Log Debugging

Adding log output at key points is the simplest debugging method:

```javascript
Page({
  onLoad(options) {
    console.log('Page load - parameters:', options);
    
    this.fetchData()
      .then(res => {
        console.log('Data fetch successful:', res);
      })
      .catch(err => {
        console.error('Data fetch failed:', err);
      });
  }
})
```

### Conditional Breakpoints

For issues that only occur under specific conditions, you can use conditional breakpoints:

1. Set a breakpoint in the developer tools
2. Right-click on the breakpoint and select "Edit breakpoint"
3. Enter a condition expression, such as `count > 10`

### Exception Catching

Globally catching unhandled exceptions can help discover hidden errors:

```javascript
// app.js
App({
  onError(error) {
    console.error('Application error:', error);
    // You can report errors to your server
    this.reportError(error);
  },
  
  reportError(error) {
    wx.request({
      url: 'https://your-server.com/log',
      method: 'POST',
      data: {
        error: error,
        time: Date.now(),
        // Other context information
      }
    });
  }
})
```

### Network Request Debugging

For API call issues, you can use these techniques:

```javascript
wx.request({
  url: 'https://api.example.com/data',
  data: {
    id: 123
  },
  success(res) {
    console.log('Request successful - status code:', res.statusCode);
    console.log('Response data:', res.data);
  },
  fail(err) {
    console.error('Request failed:', err);
  },
  complete() {
    console.log('Request completed');
  }
});
```

### Mock Data

When APIs are not ready or unstable, you can use mock data for development and testing:

```javascript
// mock-api.js
export const mockUserInfo = {
  id: 1001,
  name: 'Test User',
  avatar: '/assets/default-avatar.png'
};

export const mockProductList = [
  { id: 1, name: 'Product 1', price: 99 },
  { id: 2, name: 'Product 2', price: 199 },
  { id: 3, name: 'Product 3', price: 299 }
];

// Use in pages
import { mockUserInfo, mockProductList } from '../../utils/mock-api';

Page({
  data: {
    userInfo: null,
    products: []
  },
  
  onLoad() {
    // Decide whether to use real API or mock data based on environment
    if (wx.getSystemInfoSync().platform === 'devtools') {
      this.setData({
        userInfo: mockUserInfo,
        products: mockProductList
      });
    } else {
      this.fetchRealData();
    }
  }
})
```

## Common Issue Troubleshooting

### Page Not Displaying or Displaying Abnormally

Possible causes and solutions:

1. **JSON Configuration Error**
   - Check if the page is correctly registered in app.json
   - Check if the page path is correct

2. **Data Binding Issues**
   - Check if the corresponding data exists in the data object
   - Check if the template syntax is correct

3. **Style Issues**
   - Check if CSS is correctly applied
   - Check if elements are hidden or improperly positioned

### Events Not Triggering

Possible causes and solutions:

1. **Event Binding Syntax Error**
   - Ensure you're using the correct event binding syntax, such as `bindtap` instead of `ontap`

2. **Event Handler Function Does Not Exist**
   - Ensure the corresponding event handler function is defined in the Page or Component

3. **Element Covered by Other Elements**
   - Check z-index and positioning

### Network Request Failures

Possible causes and solutions:

1. **Domain Not Configured**
   - Add the request domain to the whitelist in the mini program admin backend

2. **HTTPS Certificate Issues**
   - Ensure the API uses a valid SSL certificate

3. **Request Parameter Errors**
   - Check if the request parameter format is correct

4. **Cross-Origin Issues**
   - Ensure the server allows requests from the mini program domain

### Performance Issues

Possible causes and solutions:

1. **Frequent setData Calls**
   - Combine multiple setData calls
   - Only update necessary data

2. **Large Image Resources**
   - Compress images
   - Use appropriate image formats

3. **Heavy Logic Code**
   - Optimize algorithms
   - Use worker threads for complex calculations

## Advanced Debugging Techniques

### Remote Debugging

For issues that only occur on specific devices, you can use remote debugging:

1. Enable remote debugging in the developer tools
2. Enable debugging mode on the real device
3. Connect the device to the developer tools

### Memory Leak Detection

Use the performance panel to monitor memory usage and identify potential memory leaks:

1. Open the performance panel
2. Record memory usage
3. Perform operations that might cause memory leaks
4. Analyze memory growth patterns

### Custom Debug Panel

Some platforms allow you to develop custom debug panels:

```javascript
// Register custom debug panel
wx.setEnableDebug({
  enableDebug: true,
  success() {
    console.log('Debug mode enabled');
  }
});

// Add debug button in the page
<button bindtap="toggleDebugPanel">Show Debug Panel</button>

// Page logic
Page({
  toggleDebugPanel() {
    if (!this.debugPanel) {
      this.createDebugPanel();
    } else {
      this.debugPanel.show = !this.debugPanel.show;
      this.setData({
        showDebugPanel: this.debugPanel.show
      });
    }
  },
  
  createDebugPanel() {
    this.debugPanel = {
      show: true,
      logs: []
    };
    
    // Override console.log
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      this.debugPanel.logs.push({
        type: 'log',
        content: args.map(arg => JSON.stringify(arg)).join(' '),
        time: new Date().toLocaleTimeString()
      });
      this.updateDebugPanel();
    };
    
    this.setData({
      showDebugPanel: true
    });
  },
  
  updateDebugPanel() {
    this.setData({
      debugLogs: this.debugPanel.logs
    });
  }
})
```

## Debugging Tools and Libraries

### vConsole

vConsole is a lightweight mobile debugging tool that can be used in mini programs:

```javascript
// Import vConsole
import VConsole from './utils/vconsole.min.js';

// Initialize
const vConsole = new VConsole();

// Use
console.log('This log will be displayed in the vConsole panel');
```

### Analytics Debugging

For user behavior analysis, you can implement a simple analytics system:

```javascript
// Analytics tool
const Analytics = {
  track(eventName, properties = {}) {
    console.log(`[Analytics] ${eventName}`, properties);
    
    // Send to server
    wx.request({
      url: 'https://analytics.example.com/track',
      method: 'POST',
      data: {
        event: eventName,
        properties,
        timestamp: Date.now(),
        user: getApp().globalData.userInfo?.id || 'anonymous'
      }
    });
  }
};

// Use analytics
Page({
  onViewProduct(e) {
    const productId = e.currentTarget.dataset.id;
    
    Analytics.track('view_product', {
      product_id: productId
    });
    
    // Other business logic
  }
})
```

## Best Practices

1. **Plan Before Development**
   - Clarify functional requirements
   - Design a reasonable architecture
   - Establish coding standards

2. **Write Testable Code**
   - Separate business logic and UI
   - Avoid excessive coupling
   - Use dependency injection

3. **Use Version Control**
   - Commit code frequently
   - Write clear commit messages
   - Use branches for feature development

4. **Establish Error Monitoring System**
   - Collect production errors
   - Analyze error trends
   - Fix issues promptly

5. **Keep Code Clean**
   - Follow the single responsibility principle
   - Avoid over-optimization
   - Write clear comments

## Next Steps

Now that you understand the basic techniques for debugging mini programs, you can continue learning about:

- [Performance Optimization](./performance-optimization.md)
- [Deployment](./deployment.md)
- [Best Practices](./best-practices.md)