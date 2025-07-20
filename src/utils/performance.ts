import { logger } from './logger';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
    logger.debug(`Performance measurement started: ${name}`);
  }

  endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      logger.warn(`No start time found for measurement: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    logger.info(`Performance measurement completed: ${name}`, { 
      duration: `${duration.toFixed(2)}ms` 
    });

    return duration;
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(name);
      try {
        const result = await asyncFn();
        this.endMeasurement(name);
        resolve(result);
      } catch (error) {
        this.endMeasurement(name);
        logger.error(`Error in measured async function: ${name}`, { error }, error instanceof Error ? error : undefined);
        reject(error);
      }
    });
  }

  measureSync<T>(name: string, syncFn: () => T): T {
    this.startMeasurement(name);
    try {
      const result = syncFn();
      this.endMeasurement(name);
      return result;
    } catch (error) {
      this.endMeasurement(name);
      logger.error(`Error in measured sync function: ${name}`, { error }, error instanceof Error ? error : undefined);
      throw error;
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();