# Environment Setup

This guide will help you set up a complete mini program development environment, from tool installation to project creation.

## 📋 Table of Contents

- [Development Tools Installation](#development-tools-installation)
- [Environment Configuration](#environment-configuration)
- [Creating Your First Project](#creating-your-first-project)
- [Developer Account Registration](#developer-account-registration)
- [Common Issues](#common-issues)

## 🛠️ Development Tools Installation

### WeChat Developer Tools

WeChat Developer Tools is the official IDE for developing WeChat mini programs, providing code editing, debugging, preview, and upload functions.

#### Download and Installation

1. Visit [WeChat Developer Tools Official Website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. Choose the version for your operating system:
   - Windows 64-bit
   - Windows 32-bit
   - macOS
   - Linux

3. Run the installer after download
4. Follow the installation wizard to complete

#### First Launch

1. Launch WeChat Developer Tools
2. Scan QR code with WeChat to login
3. Select "Mini Program" development mode

### Code Editor

While WeChat Developer Tools has a built-in code editor, we recommend using a professional code editor for better development efficiency.

#### Visual Studio Code

VS Code is one of the most popular code editors with a rich plugin ecosystem.

**Installation Steps:**

1. Visit [VS Code Official Website](https://code.visualstudio.com/)
2. Download the version for your system
3. Install and launch

**Recommended Plugins:**

```bash
# Mini program development related plugins
- minapp: Smart completion for mini program tags and attributes
- wechat-snippet: WeChat mini program code assistant
- wxapp-helper: Mini program development helper
- Prettier: Code formatter
- ESLint: Code linter
- GitLens: Git enhancement tool
```

Plugin Installation:
1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
3. Search for plugin name and install

### Node.js Environment

Node.js is server-side JavaScript, used for package management and build tools in mini program development.

#### Install Node.js

1. Visit [Node.js Official Website](https://nodejs.org/)
2. Download LTS (Long Term Support) version
3. Run the installer
4. Verify installation:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

#### Configure npm

```bash
# Set npm registry mirror (optional, improves download speed)
npm config set registry https://registry.npmmirror.com

# View current configuration
npm config list
```

## ⚙️ Environment Configuration

### Git Version Control

Git is an essential version control tool for code management and team collaboration.

#### Install Git

**Windows:**
1. Visit [Git Official Website](https://git-scm.com/)
2. Download Windows version
3. Run installer, keep default settings

**macOS:**
```bash
# Install using Homebrew
brew install git

# Or download official installer
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

#### Configure Git

```bash
# Set username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"

# View configuration
git config --list
```

### Development Environment Optimization

#### Terminal Tools

**Windows:**
- Windows Terminal (recommended)
- PowerShell
- Git Bash

**macOS/Linux:**
- iTerm2 (macOS recommended)
- System default terminal

#### Shell Configuration

```bash
# Install Oh My Zsh (macOS/Linux)
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Configure aliases
echo 'alias ll="ls -la"' >> ~/.zshrc
echo 'alias gs="git status"' >> ~/.zshrc
echo 'alias ga="git add"' >> ~/.zshrc
echo 'alias gc="git commit"' >> ~/.zshrc

# Reload configuration
source ~/.zshrc
```

## 🚀 Creating Your First Project

### Using WeChat Developer Tools

1. **Launch WeChat Developer Tools**
2. **Click "+" to create new project**
3. **Fill in project information:**
   - Project Name: `my-first-miniprogram`
   - Directory: Choose an empty folder
   - AppID: Use test AppID or registered AppID
   - Development Mode: Mini Program
   - Backend Service: Don't use cloud service

4. **Select template:**
   - JavaScript Basic Template
   - TypeScript Template
   - Cloud Development Template

5. **Click "Create" to finish**

### Project Structure Explanation

After creation, you'll see this directory structure:

```
my-first-miniprogram/
├── pages/              # Pages folder
│   ├── index/         # Home page
│   │   ├── index.js   # Page logic
│   │   ├── index.json # Page configuration
│   │   ├── index.wxml # Page structure
│   │   └── index.wxss # Page styles
│   └── logs/          # Logs page
├── utils/             # Utility functions
│   └── util.js
├── app.js            # App logic
├── app.json          # App configuration
├── app.wxss          # App styles
├── project.config.json # Project configuration
└── sitemap.json      # Sitemap
```

### Running the Project

1. **Preview in WeChat Developer Tools**
   - Project compiles automatically after creation
   - View effects in simulator
   - Use real device debugging for testing

2. **Basic Operations:**
   - `Ctrl+S`: Save and auto-compile
   - `Ctrl+Shift+S`: Save all files
   - `F5`: Refresh
   - `F12`: Open debug tools

## 👤 Developer Account Registration

### WeChat Mini Program Account

1. **Visit Registration Page**
   - Open [WeChat Public Platform](https://mp.weixin.qq.com/)
   - Click "Register Now"

2. **Select Account Type**
   - Choose "Mini Program"
   - Fill in email and password
   - Email activation

3. **Information Registration**
   - Entity Type: Individual/Enterprise/Government/Other Organization
   - Fill in entity information
   - Administrator verification

4. **Get AppID**
   - Login to mini program backend
   - View AppID in "Development" -> "Development Settings"

### Other Platform Accounts

#### Alipay Mini Program

1. Visit [Alipay Open Platform](https://open.alipay.com/)
2. Register developer account
3. Create mini program application
4. Get AppID

#### Baidu Smart Mini Program

1. Visit [Baidu Smart Mini Program Platform](https://smartprogram.baidu.com/)
2. Register developer account
3. Create smart mini program
4. Get App Key

## 🔧 Development Tools Configuration

### WeChat Developer Tools Settings

#### Editor Settings

1. **Open Settings**: `Settings` -> `Editor Settings`
2. **Recommended Configuration:**

```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.formatOnSave": true
}
```

#### Project Settings

1. **Open Project Settings**: `Settings` -> `Project Settings`
2. **Recommended Configuration:**
   - Enable ES6 to ES5 conversion
   - Enable automatic style completion on upload
   - Enable code compression on upload
   - Enable code protection on upload

### VS Code Configuration

#### Workspace Settings

Create `.vscode/settings.json` in project root:

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css",
    "*.wxs": "javascript"
  },
  "emmet.includeLanguages": {
    "wxml": "html"
  }
}
```

#### Code Snippets

Create `.vscode/snippets.json`:

```json
{
  "Page": {
    "prefix": "page",
    "body": [
      "Page({",
      "  data: {",
      "    $1",
      "  },",
      "",
      "  onLoad: function (options) {",
      "    $2",
      "  }",
      "})"
    ],
    "description": "Mini program page template"
  },
  "Component": {
    "prefix": "component",
    "body": [
      "Component({",
      "  properties: {",
      "    $1",
      "  },",
      "",
      "  data: {",
      "    $2",
      "  },",
      "",
      "  methods: {",
      "    $3",
      "  }",
      "})"
    ],
    "description": "Mini program component template"
  }
}
```

## 🔍 Environment Verification

### Verification Checklist

Create a simple test project to verify environment setup:

```javascript
// app.js
App({
  onLaunch: function () {
    console.log('Mini program launched successfully!')
    
    // Verify basic API
    wx.getSystemInfo({
      success: function(res) {
        console.log('System info:', res)
      }
    })
  }
})
```

```json
// app.json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "Environment Test",
    "navigationBarTextStyle": "black"
  }
}
```

```xml
<!-- pages/index/index.wxml -->
<view class="container">
  <text class="title">Environment Setup Successful!</text>
  <button bindtap="testAPI">Test API</button>
</view>
```

```javascript
// pages/index/index.js
Page({
  data: {
    message: 'Hello World!'
  },
  
  testAPI: function() {
    wx.showToast({
      title: 'API call successful',
      icon: 'success'
    })
  }
})
```

### Testing Steps

1. **Create test project**
2. **Copy above code**
3. **Run in simulator**
4. **Test on real device**
5. **Verify all functions work**

## ❓ Common Issues

### Issue 1: Developer Tools Won't Start
**Solution:**
- Check if WeChat is logged in
- Restart WeChat Developer Tools
- Clear cache and restart

### Issue 2: Project Creation Failed
**Solution:**
- Ensure directory is empty
- Check AppID format
- Verify network connection

### Issue 3: Code Not Auto-completing
**Solution:**
- Install recommended VS Code plugins
- Check file associations
- Restart editor

### Issue 4: Simulator Display Issues
**Solution:**
- Check simulator settings
- Try different device models
- Update developer tools

### Issue 5: Real Device Preview Not Working
**Solution:**
- Ensure phone and computer on same network
- Check firewall settings
- Restart developer tools

## 🎯 Next Steps

After environment setup:

1. **Learn Basic Concepts**: Understand mini program architecture
2. **Create First App**: Follow the first app tutorial
3. **Explore Components**: Learn about built-in components
4. **Study APIs**: Familiarize with mini program APIs
5. **Join Community**: Participate in developer forums
6. **Read Documentation**: Study official documentation

### Useful Resources

- [Official Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Component Reference](https://developers.weixin.qq.com/miniprogram/dev/component/)
- [API Reference](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [Developer Community](https://developers.weixin.qq.com/community/minihome)

---

Your development environment is now ready! You can start building amazing mini programs with this solid foundation.