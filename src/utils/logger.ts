export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private currentLevel = LogLevel.DEBUG;

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private addLog(level: LogLevel, message: string, data?: any, error?: Error) {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      stack: error?.stack
    };

    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output for development
    const levelName = LogLevel[level];
    const timestamp = new Date().toLocaleTimeString();
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] DEBUG: ${message}`, data);
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] INFO: ${message}`, data);
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] WARN: ${message}`, data);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] ERROR: ${message}`, data, error);
        break;
    }
  }

  debug(message: string, data?: any) {
    this.addLog(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.addLog(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.addLog(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any, error?: Error) {
    this.addLog(LogLevel.ERROR, message, data, error);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();