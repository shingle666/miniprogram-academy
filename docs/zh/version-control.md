# 版本控制

掌握小程序项目的版本控制策略和最佳实践。

## 📋 目录

- [Git 基础配置](#git-基础配置)
- [分支策略](#分支策略)
- [提交规范](#提交规范)
- [版本标签](#版本标签)
- [协作流程](#协作流程)
- [最佳实践](#最佳实践)

## 🔧 Git 基础配置

### 初始化仓库

```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/username/miniprogram-project.git

# 设置用户信息
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 设置默认分支
git config init.defaultBranch main
```

### .gitignore 配置

```bash
# .gitignore
# 依赖文件
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 构建产物
dist/
build/
.temp/

# 开发工具
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 小程序相关
project.private.config.json
.miniprogram-ci/

# 环境变量
.env
.env.local
.env.development
.env.production

# 日志文件
logs/
*.log

# 临时文件
.tmp/
.cache/

# 测试覆盖率
coverage/

# 打包文件
*.zip
*.tar.gz
```

### Git 配置优化

```bash
# 设置长路径支持（Windows）
git config --global core.longpaths true

# 设置换行符处理
git config --global core.autocrlf input

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## 🌿 分支策略

### Git Flow 模型

```
master     ──●──────●──────●──────●──  (生产版本)
              │      │      │      │
release    ───┼──●───┼──────┼──────┼──  (发布准备)
              │  │   │      │      │
develop    ──●──●───●──●────●──────●──  (开发主线)
             │       │ │    │
feature    ──●───────┘ │    │           (功能开发)
                       │    │
hotfix     ────────────●────┘           (紧急修复)
```

### 分支命名规范

```bash
# 主要分支
main/master     # 主分支（生产环境）
develop         # 开发分支
release/*       # 发布分支

# 功能分支
feature/user-login          # 用户登录功能
feature/payment-integration # 支付集成
feature/ui-redesign         # UI重设计

# 修复分支
hotfix/critical-bug-fix     # 紧急bug修复
hotfix/security-patch       # 安全补丁

# 其他分支
bugfix/login-error          # bug修复
chore/update-dependencies   # 依赖更新
docs/api-documentation      # 文档更新
```

### 分支操作

```bash
# 创建并切换到新分支
git checkout -b feature/user-profile

# 切换分支
git checkout develop

# 查看所有分支
git branch -a

# 删除本地分支
git branch -d feature/completed-feature

# 删除远程分支
git push origin --delete feature/old-feature

# 合并分支
git checkout develop
git merge feature/user-profile

# 变基操作
git checkout feature/user-profile
git rebase develop
```

## 📝 提交规范

### Conventional Commits

```bash
# 提交格式
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

```bash
# 功能相关
feat: 新功能
fix: 修复bug
perf: 性能优化

# 代码质量
refactor: 重构代码
style: 代码格式调整
test: 测试相关

# 构建和工具
build: 构建系统或依赖变更
ci: CI配置文件和脚本变更
chore: 其他不修改src或test文件的变更

# 文档
docs: 文档变更

# 版本回退
revert: 回退之前的提交
```

### 提交示例

```bash
# 新功能
git commit -m "feat(auth): add user login functionality"

# 修复bug
git commit -m "fix(payment): resolve payment gateway timeout issue"

# 性能优化
git commit -m "perf(image): optimize image loading performance"

# 重构
git commit -m "refactor(api): restructure API service layer"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 依赖更新
git commit -m "chore(deps): update dependencies to latest versions"

# 详细提交信息
git commit -m "feat(user): add user profile management

- Add user profile editing functionality
- Implement avatar upload feature
- Add form validation for user data
- Update user settings page layout

Closes #123"
```

### 提交钩子配置

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,json,md}": [
      "prettier --write",
      "git add"
    ],
    "*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

## 🏷️ 版本标签

### 语义化版本

```bash
# 版本格式：主版本号.次版本号.修订号
# 例如：1.2.3

# 主版本号：不兼容的API修改
# 次版本号：向下兼容的功能性新增
# 修订号：向下兼容的问题修正
```

### 标签操作

```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 查看标签
git tag
git tag -l "v1.*"

# 查看标签信息
git show v1.0.0

# 推送标签
git push origin v1.0.0
git push origin --tags

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0

# 检出标签
git checkout v1.0.0
```

### 自动化版本管理

```javascript
// scripts/version.js
const fs = require('fs')
const { execSync } = require('child_process')

class VersionManager {
  constructor() {
    this.packagePath = './package.json'
  }

  // 获取当前版本
  getCurrentVersion() {
    const pkg = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'))
    return pkg.version
  }

  // 更新版本
  updateVersion(type = 'patch') {
    const current = this.getCurrentVersion()
    const [major, minor, patch] = current.split('.').map(Number)
    
    let newVersion
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`
        break
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    }
    
    // 更新 package.json
    const pkg = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'))
    pkg.version = newVersion
    fs.writeFileSync(this.packagePath, JSON.stringify(pkg, null, 2))
    
    // 提交变更
    execSync('git add package.json')
    execSync(`git commit -m "chore(release): bump version to ${newVersion}"`)
    
    // 创建标签
    execSync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`)
    
    console.log(`版本已更新至 ${newVersion}`)
    return newVersion
  }

  // 生成更新日志
  generateChangelog() {
    try {
      const log = execSync('git log --oneline --decorate --graph', { encoding: 'utf8' })
      fs.writeFileSync('./CHANGELOG.md', `# 更新日志\n\n${log}`)
      console.log('更新日志已生成')
    } catch (error) {
      console.error('生成更新日志失败:', error)
    }
  }
}

// 命令行使用
if (require.main === module) {
  const versionManager = new VersionManager()
  const type = process.argv[2] || 'patch'
  
  versionManager.updateVersion(type)
  versionManager.generateChangelog()
}

module.exports = VersionManager
```

## 👥 协作流程

### Feature Branch 工作流

```bash
# 1. 从 develop 分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交变更
git add .
git commit -m "feat: implement new feature"

# 4. 推送分支
git push origin feature/new-feature

# 5. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR

# 6. 代码审查和合并
# 审查通过后合并到 develop 分支

# 7. 清理分支
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

### 发布流程

```bash
# 1. 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. 准备发布
# 更新版本号、文档等

# 3. 测试和修复
git commit -m "fix: resolve release issues"

# 4. 合并到主分支
git checkout main
git merge release/v1.2.0

# 5. 创建标签
git tag -a v1.2.0 -m "Release version 1.2.0"

# 6. 合并回开发分支
git checkout develop
git merge release/v1.2.0

# 7. 推送所有变更
git push origin main
git push origin develop
git push origin --tags

# 8. 删除发布分支
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### 热修复流程

```bash
# 1. 从主分支创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. 修复问题
# ... 修复代码 ...
git commit -m "fix: resolve critical security issue"

# 3. 合并到主分支
git checkout main
git merge hotfix/critical-bug

# 4. 创建补丁版本标签
git tag -a v1.2.1 -m "Hotfix version 1.2.1"

# 5. 合并回开发分支
git checkout develop
git merge hotfix/critical-bug

# 6. 推送变更
git push origin main
git push origin develop
git push origin --tags

# 7. 清理分支
git branch -d hotfix/critical-bug
```

## 🔄 代码审查

### Pull Request 模板

```markdown
<!-- .github/pull_request_template.md -->
## 变更描述
简要描述本次变更的内容和目的。

## 变更类型
- [ ] 新功能 (feature)
- [ ] 修复 (fix)
- [ ] 重构 (refactor)
- [ ] 性能优化 (perf)
- [ ] 文档更新 (docs)
- [ ] 其他 (chore)

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成
- [ ] 性能测试通过

## 检查清单
- [ ] 代码符合项目规范
- [ ] 已添加必要的测试
- [ ] 文档已更新
- [ ] 无破坏性变更
- [ ] 已考虑向后兼容性

## 相关问题
关联的 Issue 编号：#123

## 截图
如果有UI变更，请提供截图。

## 其他说明
其他需要说明的内容。
```

### 代码审查规范

```javascript
// 代码审查检查点

// 1. 代码质量
// ✅ 好的示例
function calculateTotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0
  }
  
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

// ❌ 需要改进
function calc(items) {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity
  }
  return total
}

// 2. 错误处理
// ✅ 好的示例
async function fetchUserData(userId) {
  try {
    const response = await wx.request({
      url: `/api/users/${userId}`,
      method: 'GET'
    })
    
    if (response.statusCode === 200) {
      return response.data
    } else {
      throw new Error(`请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    wx.showToast({
      title: '获取数据失败',
      icon: 'error'
    })
    throw error
  }
}

// 3. 性能考虑
// ✅ 好的示例
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 搜索防抖
const debouncedSearch = debounce((keyword) => {
  this.searchData(keyword)
}, 300)
```

## 🛠️ 工具集成

### GitHub Actions 配置

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
      
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
        
    - name: 安装依赖
      run: npm ci
      
    - name: 代码检查
      run: npm run lint
      
    - name: 运行测试
      run: npm test
      
    - name: 构建项目
      run: npm run build
      
  release:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
      with:
        fetch-depth: 0
        
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
        
    - name: 安装依赖
      run: npm ci
      
    - name: 语义化发布
      run: npx semantic-release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 语义化发布配置

```json
// .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
```

## 📊 最佳实践

### 1. 提交频率

```bash
# ✅ 推荐：小而频繁的提交
git commit -m "feat: add user validation"
git commit -m "test: add user validation tests"
git commit -m "docs: update user validation docs"

# ❌ 避免：大而复杂的提交
git commit -m "feat: complete user management system"
```

### 2. 分支管理

```bash
# ✅ 推荐：描述性分支名
feature/user-authentication
bugfix/login-form-validation
hotfix/payment-gateway-timeout

# ❌ 避免：模糊的分支名
feature/new-stuff
fix/bug
update/changes
```

### 3. 合并策略

```bash
# 功能分支合并：使用 merge commit
git checkout develop
git merge --no-ff feature/user-profile

# 热修复合并：使用 fast-forward
git checkout main
git merge hotfix/critical-fix

# 保持历史清洁：使用 rebase
git checkout feature/clean-history
git rebase develop
```

### 4. 标签管理

```bash
# 版本标签
v1.0.0    # 主要版本
v1.1.0    # 次要版本
v1.1.1    # 补丁版本

# 预发布标签
v1.2.0-alpha.1
v1.2.0-beta.1
v1.2.0-rc.1
```

### 5. 冲突解决

```bash
# 1. 拉取最新代码
git fetch origin

# 2. 合并或变基
git merge origin/develop
# 或
git rebase origin/develop

# 3. 解决冲突
# 编辑冲突文件，保留需要的代码

# 4. 标记冲突已解决
git add conflicted-file.js

# 5. 完成合并或变基
git commit
# 或
git rebase --continue
```

### 6. 历史清理

```bash
# 交互式变基清理提交历史
git rebase -i HEAD~3

# 压缩提交
pick abc123 feat: add user login
squash def456 fix: resolve login bug
squash ghi789 refactor: improve login code

# 修改提交信息
git commit --amend -m "feat: implement user login with validation"

# 强制推送（谨慎使用）
git push --force-with-lease origin feature/user-login
```

## 🔍 故障排除

### 常见问题解决

```bash
# 1. 撤销最后一次提交
git reset --soft HEAD~1  # 保留文件变更
git reset --hard HEAD~1  # 丢弃文件变更

# 2. 修改最后一次提交
git commit --amend -m "new commit message"

# 3. 恢复删除的文件
git checkout HEAD -- deleted-file.js

# 4. 查看文件变更历史
git log --follow -- file.js

# 5. 找回丢失的提交
git reflog
git checkout lost-commit-hash

# 6. 清理未跟踪文件
git clean -fd

# 7. 暂存当前工作
git stash
git stash pop

# 8. 查看分支关系
git log --graph --oneline --all
```

### 紧急恢复

```bash
# 创建紧急备份
git bundle create backup.bundle --all

# 从备份恢复
git clone backup.bundle recovered-repo

# 恢复特定提交
git cherry-pick commit-hash

# 恢复特定文件的历史版本
git checkout commit-hash -- file.js
```

## 📚 相关文档

- [项目结构](./project-structure.md) - 了解项目组织方式
- [配置详解](./configuration.md) - 深入了解配置选项
- [发布部署](./deployment.md) - 学习发布流程
- [代码审核](./code-review.md) - 代码质量保证

## 🎯 总结

通过本指南，你应该掌握：

1. **Git 基础** - 仓库初始化和基本配置
2. **分支策略** - 合理的分支管理模型
3. **提交规范** - 标准化的提交信息格式
4. **版本管理** - 语义化版本和标签管理
5. **协作流程** - 团队协作的最佳实践
6. **工具集成** - 自动化工具的使用

良好的版本控制是团队协作和项目管理的基础！

---

*最后更新: 2025年*
