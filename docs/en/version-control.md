# Version Control

This guide covers version control best practices for mini program development, including Git workflows, branching strategies, and release management.

## 📋 Table of Contents

- [Git Setup](#git-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Code Review Process](#code-review-process)
- [Release Management](#release-management)
- [Collaboration Workflows](#collaboration-workflows)
- [Best Practices](#best-practices)

## 🔧 Git Setup

### Initial Repository Setup

```bash
# Initialize repository
git init
git remote add origin https://github.com/username/miniprogram-project.git

# Create .gitignore file
cat > .gitignore << EOF
# Mini Program
dist/
node_modules/
.DS_Store
*.log

# IDE
.vscode/
.idea/

# Environment
.env
.env.local
.env.*.local

# Build artifacts
build/
coverage/

# Temporary files
*.tmp
*.temp
.cache/
EOF

# Initial commit
git add .
git commit -m "feat: initial project setup"
git push -u origin main
```

### Git Configuration

```bash
# Global configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase false

# Project-specific configuration
git config user.name "Project Name"
git config user.email "project@company.com"

# Useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## 🌿 Branching Strategy

### Git Flow Model

```
main (production)
├── develop (integration)
│   ├── feature/user-authentication
│   ├── feature/product-catalog
│   └── feature/payment-integration
├── release/v1.2.0
├── hotfix/critical-bug-fix
└── support/v1.1.x
```

### Branch Types

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features

# Supporting branches
feature/*     # New features
release/*     # Release preparation
hotfix/*      # Critical production fixes
support/*     # Maintenance of older versions

# Examples
feature/user-profile
feature/shopping-cart
release/v2.0.0
hotfix/login-bug
support/v1.x
```

### Branch Operations

```bash
# Create and switch to feature branch
git checkout -b feature/user-authentication develop

# Work on feature
git add .
git commit -m "feat: add user login functionality"
git push -u origin feature/user-authentication

# Merge feature to develop
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# Delete feature branch
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication

# Create release branch
git checkout -b release/v1.2.0 develop
git push -u origin release/v1.2.0

# Finish release
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop

# Create hotfix
git checkout -b hotfix/critical-bug main
# Fix the bug
git commit -m "fix: resolve critical login issue"

# Merge hotfix
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix version 1.2.1"
git push origin main --tags

git checkout develop
git merge --no-ff hotfix/critical-bug
git push origin develop
```

## 📝 Commit Guidelines

### Conventional Commits

```bash
# Format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
perf:     # Performance improvements
test:     # Adding or updating tests
chore:    # Maintenance tasks
ci:       # CI/CD changes
build:    # Build system changes
```

### Commit Examples

```bash
# Feature commits
git commit -m "feat: add user authentication system"
git commit -m "feat(auth): implement OAuth2 login flow"
git commit -m "feat: add product search functionality with filters"

# Bug fix commits
git commit -m "fix: resolve login redirect issue"
git commit -m "fix(api): handle network timeout errors"
git commit -m "fix: correct price calculation in shopping cart"

# Documentation commits
git commit -m "docs: update API documentation"
git commit -m "docs: add installation guide"
git commit -m "docs(readme): update project description"

# Refactoring commits
git commit -m "refactor: extract user service into separate module"
git commit -m "refactor(components): simplify button component structure"

# Performance commits
git commit -m "perf: optimize image loading performance"
git commit -m "perf(api): implement request caching"

# Breaking changes
git commit -m "feat!: change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case"
```

### Commit Message Template

```bash
# Create commit template
cat > ~/.gitmessage << EOF
# <type>[optional scope]: <description>
# |<----  Using a Maximum Of 50 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Github issue #23

# --- COMMIT END ---
# Type can be 
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring production code)
#    style    (formatting, missing semi colons, etc; no code change)
#    docs     (changes to documentation)
#    test     (adding or refactoring tests; no production code change)
#    chore    (updating grunt tasks etc; no production code change)
#    perf     (performance improvement)
#    ci       (CI/CD changes)
#    build    (build system changes)
# --------------------
# Remember to
#    Capitalize the subject line
#    Use the imperative mood in the subject line
#    Do not end the subject line with a period
#    Separate subject from body with a blank line
#    Use the body to explain what and why vs. how
#    Can use multiple lines with "-" for bullet points in body
EOF

# Set template
git config --global commit.template ~/.gitmessage
```

## 👥 Code Review Process

### Pull Request Template

```markdown
<!-- .github/pull_request_template.md -->
## Description
Brief description of changes made in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing (if applicable)

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Related Issues
Closes #(issue number)
```

### Review Guidelines

```javascript
// Code review checklist
const reviewChecklist = {
  functionality: [
    'Does the code do what it is supposed to do?',
    'Are edge cases handled properly?',
    'Is error handling appropriate?',
    'Are there any obvious bugs?'
  ],
  
  design: [
    'Is the code well-structured?',
    'Are design patterns used appropriately?',
    'Is the code modular and reusable?',
    'Does it follow SOLID principles?'
  ],
  
  readability: [
    'Is the code easy to understand?',
    'Are variable and function names descriptive?',
    'Is the code properly commented?',
    'Is the formatting consistent?'
  ],
  
  performance: [
    'Are there any performance issues?',
    'Is memory usage optimized?',
    'Are database queries efficient?',
    'Are there unnecessary computations?'
  ],
  
  security: [
    'Are there any security vulnerabilities?',
    'Is user input properly validated?',
    'Are sensitive data handled securely?',
    'Are authentication and authorization correct?'
  ],
  
  testing: [
    'Are there adequate tests?',
    'Do tests cover edge cases?',
    'Are tests maintainable?',
    'Do all tests pass?'
  ]
}
```

### Review Process Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-functionality develop

# 2. Implement feature with commits
git add .
git commit -m "feat: implement new functionality"
git push -u origin feature/new-functionality

# 3. Create pull request
# Use GitHub/GitLab interface or CLI tools

# 4. Address review feedback
git add .
git commit -m "fix: address review feedback"
git push origin feature/new-functionality

# 5. Squash commits before merge (optional)
git rebase -i HEAD~3  # Interactive rebase for last 3 commits

# 6. Merge after approval
git checkout develop
git merge --no-ff feature/new-functionality
git push origin develop
```

## 🚀 Release Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)

Examples:
1.0.0 → 1.0.1 (patch)
1.0.1 → 1.1.0 (minor)
1.1.0 → 2.0.0 (major)
```

### Release Process

```bash
# 1. Create release branch
git checkout -b release/v1.2.0 develop

# 2. Update version numbers
# Update package.json, app.json, etc.
npm version 1.2.0 --no-git-tag-version

# 3. Update changelog
cat >> CHANGELOG.md << EOF
## [1.2.0] - $(date +%Y-%m-%d)

### Added
- New user authentication system
- Product search functionality

### Changed
- Improved performance of image loading

### Fixed
- Login redirect issue
- Price calculation bug

### Deprecated
- Old API endpoints (will be removed in v2.0.0)
EOF

# 4. Commit release changes
git add .
git commit -m "chore: prepare release v1.2.0"
git push -u origin release/v1.2.0

# 5. Create pull request for release
# Review and test release branch

# 6. Merge to main and tag
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 7. Merge back to develop
git checkout develop
git merge --no-ff release/v1.2.0
git push origin develop

# 8. Clean up
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0
```

### Automated Release with GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Generate changelog
        id: changelog
        uses: conventional-changelog/conventional-changelog-action@v3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false

      - name: Upload build artifacts
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./dist/miniprogram.zip
          asset_name: miniprogram-${{ github.ref_name }}.zip
          asset_content_type: application/zip
```

## 🤝 Collaboration Workflows

### Team Workflow

```bash
# Daily workflow for team members

# 1. Start of day - sync with latest changes
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/my-feature develop

# 3. Work on feature
# Make commits regularly
git add .
git commit -m "feat: add initial implementation"

# 4. Keep feature branch updated
git checkout develop
git pull origin develop
git checkout feature/my-feature
git rebase develop  # or merge develop

# 5. Push feature branch
git push -u origin feature/my-feature

# 6. Create pull request
# Use GitHub/GitLab interface

# 7. After review and approval, merge
git checkout develop
git pull origin develop  # Get latest changes including your merged feature
```

### Conflict Resolution

```bash
# When conflicts occur during merge/rebase

# 1. Identify conflicted files
git status

# 2. Open conflicted files and resolve conflicts
# Look for conflict markers:
# <<<<<<< HEAD
# Your changes
# =======
# Other changes
# >>>>>>> branch-name

# 3. After resolving conflicts
git add resolved-file.js
git commit -m "resolve: merge conflicts in user authentication"

# 4. Continue rebase if applicable
git rebase --continue

# 5. Push resolved changes
git push origin feature/my-feature
```

### Collaborative Best Practices

```javascript
// Team collaboration guidelines
const collaborationGuidelines = {
  communication: [
    'Use descriptive commit messages',
    'Comment on pull requests constructively',
    'Update issue status regularly',
    'Share knowledge through documentation'
  ],
  
  codeQuality: [
    'Follow established coding standards',
    'Write meaningful tests',
    'Review code thoroughly',
    'Refactor when necessary'
  ],
  
  workflow: [
    'Keep feature branches small and focused',
    'Rebase frequently to avoid conflicts',
    'Test before pushing',
    'Clean up merged branches'
  ],
  
  documentation: [
    'Update README for significant changes',
    'Document API changes',
    'Maintain changelog',
    'Write clear commit messages'
  ]
}
```

## 🎯 Best Practices

### Repository Organization

```
.
├── .github/                 # GitHub specific files
│   ├── workflows/          # GitHub Actions
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── pull_request_template.md
├── docs/                   # Documentation
├── src/                    # Source code
├── tests/                  # Test files
├── .gitignore             # Git ignore rules
├── .gitattributes         # Git attributes
├── README.md              # Project overview
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
└── LICENSE                # License file
```

### Git Hooks

```bash
# Pre-commit hook example
#!/bin/sh
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix tests before committing."
  exit 1
fi

echo "Pre-commit checks passed!"
```

```bash
# Commit message hook
#!/bin/sh
# .git/hooks/commit-msg

commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: <type>[optional scope]: <description>"
    echo "Example: feat(auth): add user login functionality"
    exit 1
fi
```

### Security Considerations

```bash
# .gitignore security items
# Secrets and credentials
.env
.env.local
.env.*.local
*.key
*.pem
config/secrets.json

# API keys and tokens
.env.production
.env.staging
secrets/
credentials/

# IDE and OS files
.DS_Store
Thumbs.db
.vscode/settings.json
.idea/

# Logs and temporary files
*.log
*.tmp
*.temp
node_modules/
dist/
build/
```

### Performance Tips

```bash
# Optimize repository performance

# 1. Use shallow clones for CI/CD
git clone --depth 1 https://github.com/user/repo.git

# 2. Clean up regularly
git gc --aggressive --prune=now

# 3. Use .gitattributes for large files
echo "*.zip filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
echo "*.png filter=lfs diff=lfs merge=lfs -text" >> .gitattributes

# 4. Exclude unnecessary files
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
echo "*.log" >> .gitignore
```

---

Effective version control is essential for collaborative mini program development. Follow these practices to maintain code quality, enable smooth collaboration, and ensure reliable releases.