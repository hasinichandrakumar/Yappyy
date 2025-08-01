interface PerformanceMetrics {
  navigation: {
    domContentLoaded: number;
    loadComplete: number;
    totalTime: number;
    dnsLookup: number;
    tcpConnection: number;
    serverResponse: number;
    domProcessing: number;
  };
  resources: Array<{
    name: string;
    duration: number;
    size: number;
    type: string;
  }>;
  paint: {
    firstPaint: number;
    firstContentfulPaint: number;
  };
  custom: {
    [key: string]: number;
  };
  realTime: {
    memoryUsage: number;
    jsHeapSize: number;
    jsHeapSizeLimit: number;
    connectionLatency: number;
    renderingTime: number;
  };
}

interface SystemMetrics {
  deviceMemory: number | undefined;
  hardwareConcurrency: number;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  onLine: boolean;
  cookieEnabled: boolean;
  javaEnabled: boolean;
  language: string;
  platform: string;
  userAgent: string;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];
  private monitoring = false;
  private customMarks = new Map<string, number>();

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupObservers();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      navigation: {
        domContentLoaded: 0,
        loadComplete: 0,
        totalTime: 0,
        dnsLookup: 0,
        tcpConnection: 0,
        serverResponse: 0,
        domProcessing: 0
      },
      resources: [],
      paint: {
        firstPaint: 0,
        firstContentfulPaint: 0
      },
      custom: {},
      realTime: {
        memoryUsage: 0,
        jsHeapSize: 0,
        jsHeapSizeLimit: 0,
        connectionLatency: 0,
        renderingTime: 0
      }
    };
  }

  private setupObservers(): void {
    try {
      // Navigation timing observer
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.navigation = {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
              dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcpConnection: navEntry.connectEnd - navEntry.connectStart,
              serverResponse: navEntry.responseEnd - navEntry.requestStart,
              domProcessing: navEntry.domComplete - navEntry.domLoading
            };
          }
        });
      });
      
      if (this.isObserverSupported('navigation')) {
        navObserver.observe({ type: 'navigation', buffered: true });
        this.observers.push(navObserver);
      }

      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.metrics.resources.push({
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize || 0,
              type: resourceEntry.initiatorType
            });
          }
        });
      });

      if (this.isObserverSupported('resource')) {
        resourceObserver.observe({ type: 'resource', buffered: true });
        this.observers.push(resourceObserver);
      }

      // Paint timing observer
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.name === 'first-paint') {
            this.metrics.paint.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.paint.firstContentfulPaint = entry.startTime;
          }
        });
      });

      if (this.isObserverSupported('paint')) {
        paintObserver.observe({ type: 'paint', buffered: true });
        this.observers.push(paintObserver);
      }

      // Custom measurements observer
      const measureObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'measure') {
            this.metrics.custom[entry.name] = entry.duration;
          }
        });
      });

      if (this.isObserverSupported('measure')) {
        measureObserver.observe({ type: 'measure', buffered: true });
        this.observers.push(measureObserver);
      }

      console.log('✅ Performance monitoring initialized');
    } catch (error) {
      console.warn('⚠️ Some performance observers not supported:', error);
    }
  }

  private isObserverSupported(type: string): boolean {
    try {
      return PerformanceObserver.supportedEntryTypes?.includes(type) || false;
    } catch {
      return false;
    }
  }

  startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.startRealTimeMetrics();
    console.log('🚀 Real-time performance monitoring started');
  }

  stopMonitoring(): void {
    this.monitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  private startRealTimeMetrics(): void {
    const updateMetrics = () => {
      if (!this.monitoring) return;

      try {
        // Memory metrics
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          this.metrics.realTime.memoryUsage = memory.usedJSHeapSize;
          this.metrics.realTime.jsHeapSize = memory.totalJSHeapSize;
          this.metrics.realTime.jsHeapSizeLimit = memory.jsHeapSizeLimit;
        }

        // Connection latency estimate
        this.metrics.realTime.connectionLatency = this.estimateLatency();

        // Rendering performance
        this.metrics.realTime.renderingTime = this.measureRenderingTime();

      } catch (error) {
        console.warn('Error updating real-time metrics:', error);
      }

      // Continue monitoring
      setTimeout(updateMetrics, 1000);
    };

    updateMetrics();
  }

  private estimateLatency(): number {
    // Use navigation timing to estimate latency
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return navigation.responseStart - navigation.requestStart;
    }
    return 0;
  }

  private measureRenderingTime(): number {
    const start = performance.now();
    
    // Force a layout calculation
    document.body.offsetHeight;
    
    return performance.now() - start;
  }

  // Custom timing methods
  markStart(name: string): void {
    const markName = `${name}-start`;
    performance.mark(markName);
    this.customMarks.set(name, performance.now());
  }

  markEnd(name: string): number {
    const endMarkName = `${name}-end`;
    const measureName = `${name}-duration`;
    
    try {
      performance.mark(endMarkName);
      performance.measure(measureName, `${name}-start`, endMarkName);
      
      const startTime = this.customMarks.get(name) || 0;
      const duration = performance.now() - startTime;
      
      this.customMarks.delete(name);
      return duration;
    } catch (error) {
      console.warn(`Error measuring ${name}:`, error);
      return 0;
    }
  }

  // Measure specific operations
  measureAPICall(name: string, apiCall: () => Promise<any>): Promise<any> {
    this.markStart(`api-${name}`);
    
    return apiCall().finally(() => {
      const duration = this.markEnd(`api-${name}`);
      console.log(`API call ${name} took ${duration.toFixed(2)}ms`);
    });
  }

  measureComponentRender(componentName: string, renderFn: () => any): any {
    this.markStart(`component-${componentName}`);
    
    const result = renderFn();
    
    const duration = this.markEnd(`component-${componentName}`);
    console.log(`Component ${componentName} rendered in ${duration.toFixed(2)}ms`);
    
    return result;
  }

  // System information
  getSystemMetrics(): SystemMetrics {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: nav.hardwareConcurrency || 1,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      onLine: nav.onLine,
      cookieEnabled: nav.cookieEnabled,
      javaEnabled: nav.javaEnabled?.() || false,
      language: nav.language,
      platform: nav.platform,
      userAgent: nav.userAgent
    };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getMetricsSummary(): {
    score: number;
    recommendations: string[];
    criticalIssues: string[];
  } {
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    // Check navigation timing
    if (this.metrics.navigation.totalTime > 3000) {
      score -= 20;
      criticalIssues.push('Slow page load time (>3s)');
    } else if (this.metrics.navigation.totalTime > 1000) {
      score -= 10;
      recommendations.push('Consider optimizing page load time');
    }

    // Check first contentful paint
    if (this.metrics.paint.firstContentfulPaint > 2500) {
      score -= 15;
      criticalIssues.push('Slow First Contentful Paint (>2.5s)');
    } else if (this.metrics.paint.firstContentfulPaint > 1000) {
      score -= 8;
      recommendations.push('Optimize First Contentful Paint');
    }

    // Check memory usage
    if (this.metrics.realTime.memoryUsage > 50 * 1024 * 1024) { // 50MB
      score -= 10;
      recommendations.push('High memory usage detected');
    }

    // Check resource count
    if (this.metrics.resources.length > 100) {
      score -= 5;
      recommendations.push('Consider reducing number of resources');
    }

    return {
      score: Math.max(0, score),
      recommendations,
      criticalIssues
    };
  }

  cleanup(): void {
    this.monitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.customMarks.clear();
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();