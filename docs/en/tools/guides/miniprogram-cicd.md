# Mini Program CI/CD

Continuous Integration and Continuous Deployment (CI/CD) is essential for modern mini program development. This guide covers how to set up automated workflows for testing, building, and deploying mini programs across different platforms.

## Introduction to Mini Program CI/CD

### What is CI/CD?

Continuous Integration (CI) is the practice of frequently merging code changes into a central repository, followed by automated builds and tests. Continuous Deployment (CD) extends this process by automatically deploying successful builds to production or staging environments.

### Benefits for Mini Program Development

- **Faster Release Cycles**: Automate repetitive tasks to release updates more frequently
- **Improved Code Quality**: Catch bugs early through automated testing
- **Consistent Builds**: Ensure builds are reproducible and consistent across environments
- **Reduced Manual Errors**: Minimize human error in the deployment process
- **Version Control**: Maintain clear history of deployments and easy rollbacks
- **Team Collaboration**: Enable multiple developers to work on the same project efficiently

## CI/CD Tools for Mini Programs

### Platform-Specific Tools

#### WeChat Mini Program CI

WeChat provides official CI tools for automating mini program deployment:

1. **miniprogram-ci**: An npm package for WeChat mini program CI/CD
   ```bash
   npm install --save-dev miniprogram-ci
   ```

2. **WeChat DevTools CLI**: Command-line interface for the WeChat Developer Tools
   ```bash
   # Example usage
   cli auto --project /path/to/project --auto-port 9420
   ```

#### Alipay Mini Program CI

Alipay offers the mini-program-ci package:

```bash
npm install --save-dev mini-program-ci
```

### General CI/CD Platforms

These platforms can be configured to work with mini programs:

1. **GitHub Actions**: Integrated CI/CD service in GitHub repositories
2. **GitLab CI/CD**: Built-in CI/CD in GitLab
3. **Jenkins**: Self-hosted automation server
4. **CircleCI**: Cloud-based CI/CD service
5. **Travis CI**: CI service for open source and private projects

## Setting Up CI/CD Workflows

### Prerequisites

Before setting up CI/CD for mini programs, ensure you have:

1. **Source Control**: Your code should be in a Git repository (GitHub, GitLab, etc.)
2. **Project Configuration**: Properly configured project files (project.config.json, etc.)
3. **Build Scripts**: Scripts to build your mini program
4. **Test Suite**: Automated tests for your mini program
5. **Deployment Credentials**: API keys or certificates for deployment

### Basic Workflow Structure

A typical mini program CI/CD workflow includes:

1. **Code Checkout**: Pull the latest code from the repository
2. **Dependencies Installation**: Install required packages
3. **Linting**: Check code quality and style
4. **Testing**: Run automated tests
5. **Building**: Compile and build the mini program
6. **Preview/Testing Deployment**: Deploy to a testing environment
7. **Production Deployment**: Deploy to production after approval

## WeChat Mini Program CI/CD Implementation

### Using miniprogram-ci

1. **Create a Private Key**:
   - In WeChat Developer Tools, go to Settings > Project Settings > Project Details
   - Click "Add" in the "Deploy Private Key" section
   - Download and save the private key file

2. **Create a CI Script**:

```javascript
// ci.js
const ci = require('miniprogram-ci');
const path = require('path');

(async () => {
  const project = new ci.Project({
    appid: 'wx1234567890abcdef',
    type: 'miniProgram',
    projectPath: path.resolve('./'),
    privateKeyPath: path.resolve('./private.key'),
    ignores: ['node_modules/**/*'],
  });

  // Upload to WeChat for preview
  try {
    const previewResult = await ci.preview({
      project,
      version: '1.0.0',
      desc: 'CI automated preview',
      setting: {
        es6: true,
        minify: true,
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.resolve('./preview.jpg'),
      onProgressUpdate: console.log,
    });
    console.log('Preview successful:', previewResult);
  } catch (error) {
    console.error('Preview failed:', error);
    process.exit(1);
  }

  // Upload to WeChat for release
  try {
    const uploadResult = await ci.upload({
      project,
      version: '1.0.0',
      desc: 'CI automated upload',
      setting: {
        es6: true,
        minify: true,
      },
      onProgressUpdate: console.log,
    });
    console.log('Upload successful:', uploadResult);
  } catch (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }
})();
```

3. **Run the CI Script**:
```bash
node ci.js
```

### GitHub Actions Workflow

Create a `.github/workflows/wechat-ci.yml` file:

```yaml
name: WeChat Mini Program CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm install
      
    - name: Lint
      run: npm run lint
      
    - name: Test
      run: npm test
      
    - name: Create private key file
      run: echo "${{ secrets.WECHAT_PRIVATE_KEY }}" > private.key
      
    - name: Build and deploy
      run: node ci.js
      env:
        NODE_ENV: production
```

## Alipay Mini Program CI/CD Implementation

### Using mini-program-ci

1. **Create a CI Script**:

```javascript
// alipay-ci.js
const { minidev } = require('mini-program-ci');

(async () => {
  try {
    // Initialize the project
    await minidev.init({
      appId: '2021000000000000',
      toolId: 'your-tool-id',
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
    });
    
    // Build the project
    await minidev.compile();
    
    // Preview the mini program
    const previewResult = await minidev.preview({
      qrcodeFormat: 'image',
      qrcodeOutput: './preview.png',
    });
    console.log('Preview successful:', previewResult);
    
    // Upload for review
    const uploadResult = await minidev.upload({
      version: '1.0.0',
      description: 'CI automated upload',
    });
    console.log('Upload successful:', uploadResult);
  } catch (error) {
    console.error('CI process failed:', error);
    process.exit(1);
  }
})();
```

2. **GitLab CI Configuration**:

Create a `.gitlab-ci.yml` file:

```yaml
stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_ENV: production

install:
  stage: install
  image: node:14
  script:
    - npm install
  cache:
    paths:
      - node_modules/
  artifacts:
    paths:
      - node_modules/

test:
  stage: test
  image: node:14
  script:
    - npm run lint
    - npm test
  dependencies:
    - install

build:
  stage: build
  image: node:14
  script:
    - npm run build
  dependencies:
    - install
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: node:14
  script:
    - echo "$ALIPAY_PRIVATE_KEY" > private.key
    - node alipay-ci.js
  dependencies:
    - build
  only:
    - main
```

## Cross-Platform Mini Program CI/CD

For projects targeting multiple mini program platforms (e.g., using Taro or uni-app):

### Using Taro with GitHub Actions

Create a `.github/workflows/taro-ci.yml` file:

```yaml
name: Taro Multi-Platform CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm install
      
    - name: Lint
      run: npm run lint
      
    - name: Test
      run: npm test
      
    - name: Build WeChat Mini Program
      run: npm run build:weapp
      
    - name: Build Alipay Mini Program
      run: npm run build:alipay
      
    - name: Create private key files
      run: |
        echo "${{ secrets.WECHAT_PRIVATE_KEY }}" > wechat.key
        echo "${{ secrets.ALIPAY_PRIVATE_KEY }}" > alipay.key
      
    - name: Deploy WeChat Mini Program
      run: node ci/wechat-deploy.js
      
    - name: Deploy Alipay Mini Program
      run: node ci/alipay-deploy.js
```

### Deployment Scripts

Create separate deployment scripts for each platform:

```javascript
// ci/wechat-deploy.js
const ci = require('miniprogram-ci');
const path = require('path');

(async () => {
  const project = new ci.Project({
    appid: 'wx1234567890abcdef',
    type: 'miniProgram',
    projectPath: path.resolve('./dist/weapp'),
    privateKeyPath: path.resolve('./wechat.key'),
    ignores: ['node_modules/**/*'],
  });

  try {
    const uploadResult = await ci.upload({
      project,
      version: process.env.VERSION || '1.0.0',
      desc: 'CI automated upload',
      setting: {
        es6: true,
        minify: true,
      },
      onProgressUpdate: console.log,
    });
    console.log('WeChat upload successful:', uploadResult);
  } catch (error) {
    console.error('WeChat upload failed:', error);
    process.exit(1);
  }
})();
```

```javascript
// ci/alipay-deploy.js
const { minidev } = require('mini-program-ci');
const fs = require('fs');

(async () => {
  try {
    const privateKey = fs.readFileSync('./alipay.key', 'utf8');
    
    // Initialize the project
    await minidev.init({
      appId: '2021000000000000',
      toolId: 'your-tool-id',
      privateKey: privateKey,
      projectPath: './dist/alipay',
    });
    
    // Upload for review
    const uploadResult = await minidev.upload({
      version: process.env.VERSION || '1.0.0',
      description: 'CI automated upload',
    });
    console.log('Alipay upload successful:', uploadResult);
  } catch (error) {
    console.error('Alipay upload failed:', error);
    process.exit(1);
  }
})();
```

## Advanced CI/CD Techniques

### Environment-Specific Configurations

Create different configurations for development, testing, and production:

```javascript
// config/index.js
const config = {
  development: {
    apiBaseUrl: 'https://dev-api.example.com',
    logLevel: 'debug',
  },
  testing: {
    apiBaseUrl: 'https://test-api.example.com',
    logLevel: 'info',
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    logLevel: 'error',
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### Automated Version Management

Create a script to automatically increment version numbers:

```javascript
// scripts/version-bump.js
const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.resolve('./package.json');
const package = require(packagePath);

// Increment version (semver)
const [major, minor, patch] = package.version.split('.').map(Number);
package.version = `${major}.${minor}.${patch + 1}`;

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));

console.log(`Version bumped to ${package.version}`);

// Update version in project config files
const updateProjectConfig = (platform) => {
  const configPath = path.resolve(`./dist/${platform}/project.config.json`);
  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    config.version = package.version;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Updated ${platform} project config version to ${package.version}`);
  }
};

updateProjectConfig('weapp');
updateProjectConfig('alipay');
```

### Notification Systems

Add notifications to your CI/CD pipeline:

```javascript
// scripts/notify.js
const axios = require('axios');

async function sendSlackNotification(message, channel, webhookUrl) {
  try {
    await axios.post(webhookUrl, {
      channel,
      text: message,
    });
    console.log('Slack notification sent');
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}

async function sendWeChatWorkNotification(message, webhookUrl) {
  try {
    await axios.post(webhookUrl, {
      msgtype: 'text',
      text: {
        content: message,
      },
    });
    console.log('WeChat Work notification sent');
  } catch (error) {
    console.error('Failed to send WeChat Work notification:', error);
  }
}

// Usage in CI script
const version = require('../package.json').version;
const platform = process.argv[2] || 'unknown';
const status = process.argv[3] || 'completed';

const message = `Mini Program ${platform} deployment ${status} for version ${version}`;

// Send notifications
sendSlackNotification(message, '#deployments', process.env.SLACK_WEBHOOK_URL);
sendWeChatWorkNotification(message, process.env.WECHAT_WORK_WEBHOOK_URL);
```

## Best Practices

### Security

1. **Protect Sensitive Information**:
   - Store private keys and API tokens as encrypted secrets
   - Never commit sensitive information to your repository
   - Use environment variables for configuration

2. **Access Control**:
   - Limit who can trigger deployments
   - Implement approval workflows for production deployments
   - Use separate accounts for CI/CD and development

### Workflow Optimization

1. **Caching**:
   - Cache dependencies to speed up builds
   - Use build artifacts between jobs

2. **Parallel Jobs**:
   - Run tests and builds for different platforms in parallel
   - Split large test suites into parallel jobs

3. **Conditional Workflows**:
   - Only deploy when specific files change
   - Skip unnecessary steps based on commit messages

### Testing Integration

1. **Automated Testing**:
   - Unit tests for business logic
   - Component tests for UI elements
   - Integration tests for API interactions
   - E2E tests for critical user flows

2. **Test Reports**:
   - Generate and store test reports
   - Track test coverage over time
   - Fail builds when coverage decreases

## Troubleshooting Common Issues

### Authentication Problems

If you encounter authentication issues:

1. Verify that your private key is correct and not expired
2. Check that your appid matches your project configuration
3. Ensure your developer account has deployment permissions
4. Verify that your CI environment variables are correctly set

### Build Failures

For build failures:

1. Check your dependency versions for compatibility issues
2. Verify that your build scripts work locally
3. Look for platform-specific syntax that might cause errors
4. Check for missing files or resources

### Deployment Timeouts

If deployments time out:

1. Check your network connectivity
2. Verify that the platform's deployment service is operational
3. Consider breaking large deployments into smaller chunks
4. Increase timeout limits in your CI configuration

## Conclusion

Implementing CI/CD for mini programs significantly improves development efficiency and code quality. By automating the build, test, and deployment processes, teams can focus on developing features rather than managing manual deployments.

As mini program platforms continue to evolve, staying updated with the latest CI/CD tools and techniques will help ensure your deployment process remains efficient and reliable.

## Next Steps

- [WeChat Developer Tools](./wechat-devtools.md) - Learn more about the official development tools
- [Taro Getting Started](./taro-getting-started.md) - Explore cross-platform development with Taro
- [uni-app Getting Started](./uniapp-getting-started.md) - Discover another cross-platform framework
- [Performance Optimization](./performance-optimization.md) - Optimize your mini program's performance
- [Cloud Development](./cloud-development.md) - Integrate serverless backend services