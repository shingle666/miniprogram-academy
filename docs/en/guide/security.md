# Security Best Practices

Comprehensive security guidelines and best practices for developing secure mini programs, protecting user data, and preventing common security vulnerabilities.

## Security Fundamentals

### Data Protection Principles
- **Data Minimization**: Collect only necessary user data
- **Purpose Limitation**: Use data only for stated purposes
- **Storage Limitation**: Retain data only as long as necessary
- **Accuracy**: Ensure data accuracy and keep it up-to-date

### Security by Design
- **Threat Modeling**: Identify potential security threats early
- **Defense in Depth**: Implement multiple layers of security
- **Least Privilege**: Grant minimum necessary permissions
- **Fail Securely**: Ensure secure failure modes

## Authentication & Authorization

### User Authentication
```javascript
// Secure authentication implementation
class AuthenticationService {
  async authenticateUser(credentials) {
    try {
      // Validate input
      this.validateCredentials(credentials);
      
      // Hash password with salt
      const hashedPassword = await this.hashPassword(
        credentials.password, 
        credentials.salt
      );
      
      // Verify against stored hash
      const user = await this.verifyCredentials(
        credentials.username, 
        hashedPassword
      );
      
      if (user) {
        // Generate secure session token
        const token = this.generateSecureToken(user.id);
        
        // Set secure session
        this.setSecureSession(token, user.id);
        
        return { success: true, token, user: this.sanitizeUser(user) };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      this.logSecurityEvent('authentication_failure', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
  
  generateSecureToken(userId) {
    const payload = {
      userId: userId,
      timestamp: Date.now(),
      nonce: this.generateNonce()
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  }
}
```

### Session Management
```javascript
// Secure session handling
class SessionManager {
  createSession(userId, deviceInfo) {
    const session = {
      id: this.generateSessionId(),
      userId: userId,
      deviceFingerprint: this.generateDeviceFingerprint(deviceInfo),
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
      securityFlags: {
        requiresReauth: false,
        suspiciousActivity: false
      }
    };
    
    // Store session securely
    this.storeSession(session);
    
    // Set session timeout
    this.setSessionTimeout(session.id);
    
    return session;
  }
  
  validateSession(sessionToken) {
    try {
      const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
      const session = this.getSession(decoded.sessionId);
      
      if (!session || !session.isActive) {
        throw new Error('Invalid session');
      }
      
      // Check for session hijacking
      if (this.detectSessionAnomaly(session)) {
        this.invalidateSession(session.id);
        throw new Error('Session security violation');
      }
      
      // Update last activity
      this.updateSessionActivity(session.id);
      
      return session;
    } catch (error) {
      this.logSecurityEvent('session_validation_failed', error);
      throw error;
    }
  }
}
```

## Data Encryption

### Encryption at Rest
```javascript
// Data encryption for storage
class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyDerivation = 'pbkdf2';
  }
  
  async encryptSensitiveData(data, userKey) {
    try {
      // Generate random IV
      const iv = crypto.randomBytes(16);
      
      // Derive encryption key
      const key = await this.deriveKey(userKey, iv);
      
      // Create cipher
      const cipher = crypto.createCipher(this.algorithm, key, iv);
      
      // Encrypt data
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      this.logSecurityEvent('encryption_failed', error);
      throw new Error('Encryption failed');
    }
  }
  
  async decryptSensitiveData(encryptedData, userKey) {
    try {
      // Reconstruct IV and auth tag
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const authTag = Buffer.from(encryptedData.authTag, 'hex');
      
      // Derive decryption key
      const key = await this.deriveKey(userKey, iv);
      
      // Create decipher
      const decipher = crypto.createDecipher(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt data
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      this.logSecurityEvent('decryption_failed', error);
      throw new Error('Decryption failed');
    }
  }
}
```

### Encryption in Transit
```javascript
// Secure API communication
class SecureAPIClient {
  constructor() {
    this.baseURL = process.env.API_BASE_URL;
    this.publicKey = process.env.API_PUBLIC_KEY;
  }
  
  async makeSecureRequest(endpoint, data, options = {}) {
    try {
      // Encrypt request payload
      const encryptedPayload = await this.encryptPayload(data);
      
      // Add request signature
      const signature = this.signRequest(encryptedPayload);
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'X-Request-Signature': signature,
        'X-Timestamp': Date.now(),
        'X-Nonce': this.generateNonce(),
        ...options.headers
      };
      
      // Make request with certificate pinning
      const response = await this.httpClient.post(endpoint, {
        data: encryptedPayload,
        headers: headers,
        timeout: 30000,
        validateCertificate: true
      });
      
      // Verify response signature
      this.verifyResponseSignature(response);
      
      // Decrypt response
      return await this.decryptResponse(response.data);
    } catch (error) {
      this.logSecurityEvent('secure_request_failed', error);
      throw error;
    }
  }
}
```

## Input Validation & Sanitization

### Data Validation
```javascript
// Comprehensive input validation
class InputValidator {
  validateUserInput(input, schema) {
    const errors = [];
    
    // Type validation
    if (!this.validateType(input, schema.type)) {
      errors.push(`Invalid type: expected ${schema.type}`);
    }
    
    // Length validation
    if (schema.minLength && input.length < schema.minLength) {
      errors.push(`Input too short: minimum ${schema.minLength} characters`);
    }
    
    if (schema.maxLength && input.length > schema.maxLength) {
      errors.push(`Input too long: maximum ${schema.maxLength} characters`);
    }
    
    // Pattern validation
    if (schema.pattern && !schema.pattern.test(input)) {
      errors.push('Input format is invalid');
    }
    
    // Custom validation
    if (schema.customValidator) {
      const customResult = schema.customValidator(input);
      if (!customResult.valid) {
        errors.push(customResult.error);
      }
    }
    
    // SQL injection prevention
    if (this.detectSQLInjection(input)) {
      errors.push('Potentially malicious input detected');
      this.logSecurityEvent('sql_injection_attempt', { input });
    }
    
    // XSS prevention
    if (this.detectXSS(input)) {
      errors.push('Cross-site scripting attempt detected');
      this.logSecurityEvent('xss_attempt', { input });
    }
    
    return {
      valid: errors.length === 0,
      errors: errors,
      sanitized: this.sanitizeInput(input)
    };
  }
  
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>"'&]/g, (match) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match];
      })
      .trim();
  }
}
```

## API Security

### Rate Limiting
```javascript
// API rate limiting implementation
class RateLimiter {
  constructor() {
    this.limits = new Map();
    this.windows = new Map();
  }
  
  async checkRateLimit(identifier, endpoint) {
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    const windowSize = this.getWindowSize(endpoint);
    const maxRequests = this.getMaxRequests(endpoint);
    
    // Get current window
    let window = this.windows.get(key);
    
    if (!window || now - window.start > windowSize) {
      // Create new window
      window = {
        start: now,
        count: 0
      };
      this.windows.set(key, window);
    }
    
    // Check if limit exceeded
    if (window.count >= maxRequests) {
      this.logSecurityEvent('rate_limit_exceeded', {
        identifier,
        endpoint,
        count: window.count
      });
      
      return {
        allowed: false,
        resetTime: window.start + windowSize,
        remaining: 0
      };
    }
    
    // Increment counter
    window.count++;
    
    return {
      allowed: true,
      resetTime: window.start + windowSize,
      remaining: maxRequests - window.count
    };
  }
}
```

### API Authentication
```javascript
// API key and token management
class APIAuthenticator {
  async validateAPIKey(apiKey, request) {
    try {
      // Validate API key format
      if (!this.isValidAPIKeyFormat(apiKey)) {
        throw new Error('Invalid API key format');
      }
      
      // Get API key details
      const keyDetails = await this.getAPIKeyDetails(apiKey);
      
      if (!keyDetails || !keyDetails.isActive) {
        throw new Error('Invalid or inactive API key');
      }
      
      // Check permissions
      if (!this.hasPermission(keyDetails, request.endpoint)) {
        throw new Error('Insufficient permissions');
      }
      
      // Check rate limits
      const rateLimitResult = await this.checkRateLimit(
        keyDetails.id, 
        request.endpoint
      );
      
      if (!rateLimitResult.allowed) {
        throw new Error('Rate limit exceeded');
      }
      
      // Log successful authentication
      this.logAPIUsage(keyDetails.id, request);
      
      return {
        valid: true,
        keyDetails: keyDetails,
        rateLimit: rateLimitResult
      };
    } catch (error) {
      this.logSecurityEvent('api_auth_failed', error);
      return { valid: false, error: error.message };
    }
  }
}
```

## Security Monitoring

### Threat Detection
```javascript
// Security monitoring and threat detection
class SecurityMonitor {
  constructor() {
    this.anomalyDetector = new AnomalyDetector();
    this.threatIntelligence = new ThreatIntelligence();
    this.alertManager = new AlertManager();
  }
  
  async monitorUserActivity(userId, activity) {
    try {
      // Analyze activity patterns
      const anomalyScore = await this.anomalyDetector.analyze(userId, activity);
      
      if (anomalyScore > 0.8) {
        // High anomaly score - potential threat
        await this.handleSecurityThreat(userId, activity, anomalyScore);
      }
      
      // Check against threat intelligence
      const threatMatch = await this.threatIntelligence.checkActivity(activity);
      
      if (threatMatch.isMatch) {
        await this.handleKnownThreat(userId, activity, threatMatch);
      }
      
      // Log activity for analysis
      this.logSecurityActivity(userId, activity, anomalyScore);
    } catch (error) {
      this.logSecurityEvent('monitoring_error', error);
    }
  }
  
  async handleSecurityThreat(userId, activity, score) {
    const threat = {
      id: this.generateThreatId(),
      userId: userId,
      activity: activity,
      score: score,
      timestamp: Date.now(),
      status: 'detected'
    };
    
    // Store threat record
    await this.storeThreatRecord(threat);
    
    // Determine response level
    if (score > 0.95) {
      // Critical threat - immediate action
      await this.suspendUser(userId, 'security_threat');
      await this.alertManager.sendCriticalAlert(threat);
    } else if (score > 0.8) {
      // High threat - require additional authentication
      await this.requireReauthentication(userId);
      await this.alertManager.sendHighPriorityAlert(threat);
    }
  }
}
```

## Compliance & Privacy

### GDPR Compliance
```javascript
// GDPR compliance implementation
class GDPRCompliance {
  async handleDataRequest(userId, requestType) {
    switch (requestType) {
      case 'access':
        return await this.exportUserData(userId);
      
      case 'rectification':
        return await this.updateUserData(userId);
      
      case 'erasure':
        return await this.deleteUserData(userId);
      
      case 'portability':
        return await this.exportPortableData(userId);
      
      case 'restriction':
        return await this.restrictDataProcessing(userId);
      
      default:
        throw new Error('Invalid request type');
    }
  }
  
  async exportUserData(userId) {
    const userData = {
      profile: await this.getUserProfile(userId),
      activities: await this.getUserActivities(userId),
      preferences: await this.getUserPreferences(userId),
      consents: await this.getUserConsents(userId)
    };
    
    // Anonymize sensitive data
    const anonymizedData = this.anonymizeSensitiveData(userData);
    
    // Create export package
    const exportPackage = {
      userId: userId,
      exportDate: new Date().toISOString(),
      data: anonymizedData,
      format: 'JSON',
      version: '1.0'
    };
    
    // Log data export
    this.logDataExport(userId, exportPackage);
    
    return exportPackage;
  }
}
```

## Security Testing

### Penetration Testing
```javascript
// Security testing framework
class SecurityTester {
  async runSecurityTests() {
    const results = {
      vulnerabilities: [],
      passed: 0,
      failed: 0
    };
    
    // Test authentication
    const authTests = await this.testAuthentication();
    results.vulnerabilities.push(...authTests.vulnerabilities);
    
    // Test authorization
    const authzTests = await this.testAuthorization();
    results.vulnerabilities.push(...authzTests.vulnerabilities);
    
    // Test input validation
    const inputTests = await this.testInputValidation();
    results.vulnerabilities.push(...inputTests.vulnerabilities);
    
    // Test encryption
    const encryptionTests = await this.testEncryption();
    results.vulnerabilities.push(...encryptionTests.vulnerabilities);
    
    // Calculate totals
    results.passed = authTests.passed + authzTests.passed + 
                    inputTests.passed + encryptionTests.passed;
    results.failed = authTests.failed + authzTests.failed + 
                    inputTests.failed + encryptionTests.failed;
    
    return results;
  }
  
  async testAuthentication() {
    const tests = [
      this.testWeakPasswords,
      this.testBruteForceProtection,
      this.testSessionManagement,
      this.testTokenSecurity
    ];
    
    return await this.runTestSuite('Authentication', tests);
  }
}
```

## Security Checklist

### Development Security
- [ ] Implement secure authentication and session management
- [ ] Use strong encryption for sensitive data
- [ ] Validate and sanitize all user inputs
- [ ] Implement proper error handling without information leakage
- [ ] Use secure coding practices and code reviews
- [ ] Implement logging and monitoring
- [ ] Regular security testing and vulnerability assessments

### Deployment Security
- [ ] Use HTTPS for all communications
- [ ] Implement proper certificate management
- [ ] Configure secure headers (HSTS, CSP, etc.)
- [ ] Set up Web Application Firewall (WAF)
- [ ] Implement DDoS protection
- [ ] Regular security updates and patches
- [ ] Secure server configuration

### Operational Security
- [ ] Regular security audits and assessments
- [ ] Incident response plan and procedures
- [ ] Security awareness training for team
- [ ] Backup and disaster recovery procedures
- [ ] Compliance with relevant regulations
- [ ] Third-party security assessments
- [ ] Continuous security monitoring

This comprehensive security guide provides the foundation for building secure mini programs that protect user data and maintain trust while complying with security best practices and regulatory requirements.