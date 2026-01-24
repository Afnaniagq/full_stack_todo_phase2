import React from 'react';

/**
 * Performance Monitoring Utilities
 * For tracking and measuring performance metrics in the application
 */

// Performance measurement function
export const measurePerformance = (operationName: string, operation: () => any) => {
  const startTime = performance.now();
  const result = operation();
  const endTime = performance.now();

  console.log(`${operationName} took ${endTime - startTime} milliseconds`);

  // In a real implementation, you would send this to a monitoring service
  // sendMetricsToMonitoringService(operationName, endTime - startTime);

  return result;
};

// Performance observer for long tasks
export const setupLongTaskObserver = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('Long task detected:', {
          duration: entry.duration,
          name: entry.name,
          startTime: entry.startTime
        });
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  }
};

// Function to measure API call performance
export const measureApiCall = async (url: string, options: RequestInit = {}) => {
  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    const endTime = performance.now();

    console.log(`API call to ${url} took ${endTime - startTime} milliseconds`);

    return response;
  } catch (error) {
    const endTime = performance.now();
    console.error(`API call to ${url} failed after ${endTime - startTime} milliseconds`, error);
    throw error;
  }
};

// Performance monitoring hook for React components
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      console.log(`${componentName} unmounted after ${endTime - startTime} milliseconds`);
    };
  }, [componentName]);
};