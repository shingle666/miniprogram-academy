# Monitoring and Analytics

Comprehensive monitoring and analytics strategies for mini programs, including performance monitoring, user analytics, error tracking, and business intelligence.

## Monitoring Fundamentals

### Key Metrics Overview
- **Performance Metrics**: Response time, throughput, resource utilization
- **User Experience Metrics**: Page load time, interaction responsiveness
- **Business Metrics**: User engagement, conversion rates, revenue
- **Technical Metrics**: Error rates, API performance, system health

### Monitoring Strategy
- **Real-Time Monitoring**: Live system health and performance tracking
- **Historical Analysis**: Trend analysis and pattern recognition
- **Predictive Analytics**: Forecasting and capacity planning
- **Alerting Systems**: Proactive issue detection and notification

## Performance Monitoring

### Application Performance Monitoring (APM)
```javascript
// Performance monitoring implementation
class PerformanceMonitor {
  constructor() {
    this.metrics = new MetricsCollector();
    this.tracer = new DistributedTracer();
    this.profiler = new ApplicationProfiler();
  }
  
  startTransaction(name, context = {}) {
    const transaction = {
      id: this.generateTransactionId(),
      name: name,
      startTime: performance.now(),
      context: context,
      spans: [],
      metadata: {
        userId: context.userId,
        sessionId: context.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    this.activeTransactions.set(transaction.id, transaction);
    return transaction;
  }
  
  endTransaction(transactionId, result = {}) {
    const transaction = this.activeTransactions.get(transactionId);
    
    if (!transaction) {
      console.warn('Transaction not found:', transactionId);
      return;
    }
    
    transaction.endTime = performance.now();
    transaction.duration = transaction.endTime - transaction.startTime;
    transaction.result = result;
    
    // Calculate performance metrics
    const metrics = this.calculateMetrics(transaction);
    
    // Send to analytics
    this.sendMetrics({
      type: 'transaction',
      transaction: transaction,
      metrics: metrics,
      timestamp: Date.now()
    });
    
    // Check for performance issues
    this.checkPerformanceThresholds(transaction, metrics);
    
    this.activeTransactions.delete(transactionId);
  }
  
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        // Core Web Vitals
        firstContentfulPaint: this.getFCP(paint),
        largestContentfulPaint: this.getLCP(),
        cumulativeLayoutShift: this.getCLS(),
        firstInputDelay: this.getFID(),
        
        // Navigation timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        
        // Resource timing
        resourceLoadTime: this.calculateResourceLoadTime(),
        
        // Custom metrics
        timeToInteractive: this.calculateTTI(),
        totalBlockingTime: this.calculateTBT()
      };
      
      this.sendMetrics({
        type: 'page_load',
        metrics: metrics,
        url: window.location.href,
        timestamp: Date.now()
      });
    }
  }
}
```

### Real User Monitoring (RUM)
```javascript
// Real user monitoring implementation
class RealUserMonitor {
  constructor() {
    this.sessionTracker = new SessionTracker();
    this.interactionTracker = new InteractionTracker();
    this.errorTracker = new ErrorTracker();
  }
  
  initializeRUM() {
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.setupInteractionTracking();
    
    // Track errors
    this.setupErrorTracking();
    
    // Track performance
    this.setupPerformanceTracking();
    
    // Track custom events
    this.setupCustomEventTracking();
  }
  
  trackPageView() {
    const pageView = {
      id: this.generatePageViewId(),
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionTracker.getSessionId(),
      userId: this.getUserId(),
      deviceInfo: this.getDeviceInfo(),
      performanceMetrics: this.getPagePerformanceMetrics()
    };
    
    this.sendEvent('page_view', pageView);
  }
  
  setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackInteraction('click', {
        element: this.getElementInfo(event.target),
        coordinates: { x: event.clientX, y: event.clientY },
        timestamp: Date.now()
      });
    });
    
    // Track form submissions
    document.addEventListener('submit', (event) => {
      this.trackInteraction('form_submit', {
        form: this.getFormInfo(event.target),
        timestamp: Date.now()
      });
    });
    
    // Track scroll behavior
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackInteraction('scroll', {
          scrollPosition: window.scrollY,
          scrollPercentage: this.calculateScrollPercentage(),
          timestamp: Date.now()
        });
      }, 100);
    });
  }
  
  trackCustomEvent(eventName, properties = {}) {
    const customEvent = {
      name: eventName,
      properties: properties,
      timestamp: Date.now(),
      sessionId: this.sessionTracker.getSessionId(),
      userId: this.getUserId(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
    
    this.sendEvent('custom_event', customEvent);
  }
}
```

## Error Tracking and Logging

### Error Monitoring System
```javascript
// Comprehensive error tracking
class ErrorTracker {
  constructor() {
    this.errorQueue = [];
    this.errorFilters = new Set();
    this.contextCollector = new ContextCollector();
  }
  
  initialize() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'unhandled_promise_rejection',
        reason: event.reason,
        promise: event.promise,
        stack: event.reason?.stack
      });
    });
    
    // Network error handler
    this.setupNetworkErrorTracking();
  }
  
  captureError(errorData) {
    try {
      // Filter out known non-critical errors
      if (this.shouldFilterError(errorData)) {
        return;
      }
      
      const enrichedError = {
        ...errorData,
        id: this.generateErrorId(),
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        context: this.contextCollector.collect(),
        breadcrumbs: this.getBreadcrumbs(),
        fingerprint: this.generateErrorFingerprint(errorData),
        severity: this.calculateSeverity(errorData)
      };
      
      // Add to queue
      this.errorQueue.push(enrichedError);
      
      // Send immediately for critical errors
      if (enrichedError.severity === 'critical') {
        this.sendErrorsImmediately([enrichedError]);
      } else {
        this.scheduleErrorBatch();
      }
      
      // Log locally for debugging
      this.logErrorLocally(enrichedError);
    } catch (error) {
      console.error('Error in error tracking:', error);
    }
  }
  
  setupNetworkErrorTracking() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        
        // Track successful requests
        this.trackNetworkRequest({
          url: args[0],
          method: args[1]?.method || 'GET',
          status: response.status,
          duration: performance.now() - startTime,
          success: true
        });
        
        return response;
      } catch (error) {
        // Track failed requests
        this.captureError({
          type: 'network_error',
          url: args[0],
          method: args[1]?.method || 'GET',
          error: error.message,
          duration: performance.now() - startTime
        });
        
        throw error;
      }
    };
  }
}
```

### Logging System
```javascript
// Structured logging implementation
class Logger {
  constructor() {
    this.logLevel = this.getLogLevel();
    this.logBuffer = [];
    this.contextEnrichers = [];
  }
  
  log(level, message, context = {}) {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      context: this.enrichContext(context),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      source: this.getSource(),
      environment: this.getEnvironment()
    };
    
    // Add to buffer
    this.logBuffer.push(logEntry);
    
    // Console output for development
    if (this.isDevelopment()) {
      this.outputToConsole(logEntry);
    }
    
    // Send to logging service
    this.scheduleLogTransmission();
  }
  
  info(message, context) {
    this.log('info', message, context);
  }
  
  warn(message, context) {
    this.log('warn', message, context);
  }
  
  error(message, context) {
    this.log('error', message, context);
  }
  
  debug(message, context) {
    this.log('debug', message, context);
  }
  
  enrichContext(context) {
    let enrichedContext = { ...context };
    
    // Apply context enrichers
    this.contextEnrichers.forEach(enricher => {
      enrichedContext = enricher(enrichedContext);
    });
    
    return enrichedContext;
  }
}
```

## User Analytics

### User Behavior Analytics
```javascript
// User behavior tracking and analysis
class UserAnalytics {
  constructor() {
    this.eventQueue = [];
    this.userProperties = new Map();
    this.sessionProperties = new Map();
  }
  
  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        ...this.getDefaultProperties()
      },
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      eventId: this.generateEventId()
    };
    
    this.eventQueue.push(event);
    this.scheduleEventTransmission();
    
    // Update user journey
    this.updateUserJourney(event);
  }
  
  identifyUser(userId, properties = {}) {
    this.userId = userId;
    this.userProperties.set(userId, {
      ...this.userProperties.get(userId),
      ...properties,
      lastSeen: Date.now()
    });
    
    this.trackEvent('user_identified', {
      userId: userId,
      properties: properties
    });
  }
  
  trackPageView(page, properties = {}) {
    this.trackEvent('page_view', {
      page: page,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      ...properties
    });
  }
  
  trackConversion(conversionType, value = 0, properties = {}) {
    this.trackEvent('conversion', {
      type: conversionType,
      value: value,
      currency: properties.currency || 'USD',
      ...properties
    });
  }
  
  createFunnel(funnelName, steps) {
    return {
      name: funnelName,
      steps: steps,
      trackStep: (stepName, properties = {}) => {
        this.trackEvent('funnel_step', {
          funnel: funnelName,
          step: stepName,
          stepIndex: steps.indexOf(stepName),
          ...properties
        });
      }
    };
  }
}
```

### A/B Testing Analytics
```javascript
// A/B testing and experimentation
class ExperimentAnalytics {
  constructor() {
    this.activeExperiments = new Map();
    this.userAssignments = new Map();
  }
  
  assignUserToExperiment(experimentId, userId) {
    const experiment = this.activeExperiments.get(experimentId);
    
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }
    
    // Check if user is already assigned
    let assignment = this.userAssignments.get(`${userId}:${experimentId}`);
    
    if (!assignment) {
      // Assign user to variant
      const variant = this.selectVariant(experiment, userId);
      
      assignment = {
        userId: userId,
        experimentId: experimentId,
        variant: variant,
        assignedAt: Date.now()
      };
      
      this.userAssignments.set(`${userId}:${experimentId}`, assignment);
      
      // Track assignment
      this.trackEvent('experiment_assignment', {
        experimentId: experimentId,
        variant: variant,
        userId: userId
      });
    }
    
    return assignment.variant;
  }
  
  trackExperimentGoal(experimentId, goalName, value = 1) {
    const userId = this.getUserId();
    const assignment = this.userAssignments.get(`${userId}:${experimentId}`);
    
    if (assignment) {
      this.trackEvent('experiment_goal', {
        experimentId: experimentId,
        variant: assignment.variant,
        goal: goalName,
        value: value,
        userId: userId
      });
    }
  }
  
  selectVariant(experiment, userId) {
    // Use consistent hashing for stable assignment
    const hash = this.hashUserId(userId + experiment.id);
    const bucket = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (bucket < cumulativeWeight) {
        return variant.name;
      }
    }
    
    return experiment.variants[0].name; // fallback
  }
}
```

## Business Intelligence

### KPI Dashboard
```javascript
// Key Performance Indicators tracking
class KPIDashboard {
  constructor() {
    this.kpis = new Map();
    this.targets = new Map();
    this.alerts = new Map();
  }
  
  defineKPI(name, config) {
    this.kpis.set(name, {
      name: name,
      description: config.description,
      calculation: config.calculation,
      unit: config.unit,
      target: config.target,
      thresholds: config.thresholds,
      updateFrequency: config.updateFrequency || 'daily'
    });
  }
  
  calculateKPI(name, timeRange) {
    const kpi = this.kpis.get(name);
    
    if (!kpi) {
      throw new Error(`KPI ${name} not found`);
    }
    
    const data = this.getDataForTimeRange(timeRange);
    const value = kpi.calculation(data);
    
    const result = {
      name: name,
      value: value,
      unit: kpi.unit,
      target: kpi.target,
      performance: this.calculatePerformance(value, kpi.target),
      trend: this.calculateTrend(name, value, timeRange),
      timestamp: Date.now()
    };
    
    // Check thresholds and send alerts
    this.checkThresholds(name, result);
    
    return result;
  }
  
  generateReport(timeRange, kpiNames = []) {
    const kpisToCalculate = kpiNames.length > 0 ? kpiNames : Array.from(this.kpis.keys());
    
    const report = {
      timeRange: timeRange,
      generatedAt: Date.now(),
      kpis: {},
      summary: {
        totalKPIs: kpisToCalculate.length,
        onTarget: 0,
        belowTarget: 0,
        aboveTarget: 0
      }
    };
    
    kpisToCalculate.forEach(kpiName => {
      const kpiResult = this.calculateKPI(kpiName, timeRange);
      report.kpis[kpiName] = kpiResult;
      
      // Update summary
      if (kpiResult.performance === 'on_target') {
        report.summary.onTarget++;
      } else if (kpiResult.performance === 'below_target') {
        report.summary.belowTarget++;
      } else {
        report.summary.aboveTarget++;
      }
    });
    
    return report;
  }
}
```

## Alerting and Notifications

### Alert Management
```javascript
// Intelligent alerting system
class AlertManager {
  constructor() {
    this.alertRules = new Map();
    this.alertHistory = [];
    this.notificationChannels = new Map();
  }
  
  createAlertRule(name, config) {
    const rule = {
      name: name,
      condition: config.condition,
      threshold: config.threshold,
      severity: config.severity,
      channels: config.channels,
      cooldown: config.cooldown || 300000, // 5 minutes
      enabled: true,
      lastTriggered: null
    };
    
    this.alertRules.set(name, rule);
  }
  
  evaluateAlerts(metrics) {
    this.alertRules.forEach((rule, name) => {
      if (!rule.enabled) return;
      
      // Check cooldown
      if (rule.lastTriggered && 
          Date.now() - rule.lastTriggered < rule.cooldown) {
        return;
      }
      
      // Evaluate condition
      if (rule.condition(metrics)) {
        this.triggerAlert(name, rule, metrics);
      }
    });
  }
  
  triggerAlert(ruleName, rule, metrics) {
    const alert = {
      id: this.generateAlertId(),
      rule: ruleName,
      severity: rule.severity,
      message: this.generateAlertMessage(rule, metrics),
      metrics: metrics,
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false
    };
    
    // Store alert
    this.alertHistory.push(alert);
    
    // Send notifications
    rule.channels.forEach(channel => {
      this.sendNotification(channel, alert);
    });
    
    // Update rule
    rule.lastTriggered = Date.now();
    
    return alert;
  }
  
  sendNotification(channel, alert) {
    const notificationChannel = this.notificationChannels.get(channel);
    
    if (notificationChannel) {
      notificationChannel.send({
        subject: `Alert: ${alert.rule}`,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.timestamp
      });
    }
  }
}
```

## Data Visualization

### Dashboard Components
```javascript
// Interactive dashboard components
class DashboardBuilder {
  constructor() {
    this.widgets = new Map();
    this.layouts = new Map();
    this.dataProviders = new Map();
  }
  
  createWidget(type, config) {
    const widget = {
      id: this.generateWidgetId(),
      type: type,
      title: config.title,
      dataSource: config.dataSource,
      refreshInterval: config.refreshInterval || 60000,
      visualization: config.visualization,
      filters: config.filters || {},
      lastUpdated: null
    };
    
    this.widgets.set(widget.id, widget);
    return widget;
  }
  
  createTimeSeriesChart(config) {
    return this.createWidget('timeseries', {
      ...config,
      visualization: {
        type: 'line',
        xAxis: 'timestamp',
        yAxis: config.metrics,
        aggregation: config.aggregation || 'avg',
        timeRange: config.timeRange || '24h'
      }
    });
  }
  
  createMetricCard(config) {
    return this.createWidget('metric', {
      ...config,
      visualization: {
        type: 'card',
        metric: config.metric,
        format: config.format || 'number',
        comparison: config.comparison,
        trend: config.showTrend !== false
      }
    });
  }
  
  updateWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    
    if (!widget) return;
    
    const dataProvider = this.dataProviders.get(widget.dataSource);
    
    if (dataProvider) {
      const data = dataProvider.getData(widget.filters);
      widget.data = data;
      widget.lastUpdated = Date.now();
      
      // Emit update event
      this.emit('widget_updated', { widgetId, data });
    }
  }
}
```

This comprehensive monitoring and analytics guide provides the foundation for implementing robust monitoring systems that ensure optimal performance, user experience, and business success for mini programs.