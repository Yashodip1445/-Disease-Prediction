import React, { useState, useEffect } from 'react';
import { Bug, Download, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { logger, LogLevel, LogEntry } from '../utils/logger';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onToggle }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel>(LogLevel.DEBUG);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => log.level >= filterLevel);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG: return 'text-gray-600 bg-gray-100';
      case LogLevel.INFO: return 'text-blue-600 bg-blue-100';
      case LogLevel.WARN: return 'text-yellow-600 bg-yellow-100';
      case LogLevel.ERROR: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelName = (level: LogLevel) => {
    return LogLevel[level];
  };

  const handleDownloadLogs = () => {
    const logsData = logger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
        title="Show Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-96 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-900">Debug Panel</span>
          <span className="text-xs text-gray-500">({filteredLogs.length} logs)</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
            title="Hide Debug Panel"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-gray-200 space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-xs text-gray-600">Filter Level:</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(Number(e.target.value) as LogLevel)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value={LogLevel.DEBUG}>DEBUG</option>
            <option value={LogLevel.INFO}>INFO</option>
            <option value={LogLevel.WARN}>WARN</option>
            <option value={LogLevel.ERROR}>ERROR</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadLogs}
            className="flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="flex items-center space-x-1 text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className={`overflow-y-auto ${isExpanded ? 'flex-1' : 'max-h-48'}`}>
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No logs to display
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredLogs.map((log, index) => (
              <div key={index} className="text-xs border border-gray-200 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                    {getLevelName(log.level)}
                  </span>
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-800 mb-1">{log.message}</div>
                {log.data && (
                  <div className="bg-gray-50 rounded p-1 text-gray-600 font-mono text-xs overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </div>
                )}
                {log.stack && (
                  <div className="bg-red-50 rounded p-1 text-red-600 font-mono text-xs overflow-x-auto mt-1">
                    {log.stack}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};