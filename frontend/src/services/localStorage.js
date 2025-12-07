/**
 * Local Storage Service
 * Utility functions for managing EYAI platform data in localStorage
 */

import { STORAGE_KEYS, UI_CONFIG } from '../constants';

/**
 * Generic localStorage wrapper with error handling
 */
class LocalStorageService {
  /**
   * Get item from localStorage
   */
  static getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   */
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

/**
 * Save a job to history
 */
export function saveJobToHistory(jobData) {
  try {
    const { jobId, query, candidatesCount = 0, status = 'completed' } = jobData;

    const job = {
      id: jobId,
      query,
      timestamp: new Date().toISOString(),
      candidatesCount,
      status,
    };

    // Get existing history
    let history = LocalStorageService.getItem(STORAGE_KEYS.JOB_HISTORY, []);

    // Check if job already exists
    const existingIndex = history.findIndex((j) => j.id === jobId);
    if (existingIndex >= 0) {
      // Update existing job
      history[existingIndex] = { ...history[existingIndex], ...job };
    } else {
      // Add new job to beginning
      history = [job, ...history];
    }

    // Keep only last N jobs
    history = history.slice(0, UI_CONFIG.MAX_HISTORY_ITEMS);

    // Save back to localStorage
    return LocalStorageService.setItem(STORAGE_KEYS.JOB_HISTORY, history);
  } catch (error) {
    console.error('Failed to save job to history:', error);
    return false;
  }
}

/**
 * Get all jobs from history
 */
export function getJobHistory() {
  return LocalStorageService.getItem(STORAGE_KEYS.JOB_HISTORY, []);
}

/**
 * Save an export to history
 */
export function saveExportToHistory(exportData) {
  try {
    const { jobId, format, size } = exportData;

    const exportRecord = {
      id: `EXP${Date.now()}`,
      jobId,
      format,
      timestamp: new Date().toISOString(),
      size,
    };

    // Get existing history
    let history = LocalStorageService.getItem(STORAGE_KEYS.EXPORT_HISTORY, []);

    // Add new export to beginning
    history = [exportRecord, ...history];

    // Keep only last N exports
    history = history.slice(0, UI_CONFIG.MAX_EXPORT_HISTORY);

    // Save back to localStorage
    LocalStorageService.setItem(STORAGE_KEYS.EXPORT_HISTORY, history);

    return exportRecord;
  } catch (error) {
    console.error('Failed to save export to history:', error);
    return null;
  }
}

/**
 * Get all exports from history
 */
export function getExportHistory() {
  return LocalStorageService.getItem(STORAGE_KEYS.EXPORT_HISTORY, []);
}

/**
 * Clear all history (for testing/reset)
 */
export function clearAllHistory() {
  const success1 = LocalStorageService.removeItem(STORAGE_KEYS.JOB_HISTORY);
  const success2 = LocalStorageService.removeItem(STORAGE_KEYS.EXPORT_HISTORY);
  return success1 && success2;
}

/**
 * Get statistics from history
 */
export function getHistoryStats() {
  try {
    const jobs = getJobHistory();
    const exports = getExportHistory();

    return {
      totalJobs: jobs.length,
      totalExports: exports.length,
      recentActivity: jobs.length > 0 ? jobs[0].timestamp : 'No activity',
      mostExportedFormat: getMostExportedFormat(exports),
    };
  } catch (error) {
    console.error('Failed to get history stats:', error);
    return {
      totalJobs: 0,
      totalExports: 0,
      recentActivity: 'N/A',
      mostExportedFormat: 'N/A',
    };
  }
}

/**
 * Get most exported format
 */
function getMostExportedFormat(exports) {
  if (exports.length === 0) return 'N/A';

  const formatCounts = exports.reduce((acc, exp) => {
    acc[exp.format] = (acc[exp.format] || 0) + 1;
    return acc;
  }, {});

  return (
    Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  );
}

/**
 * Save user preferences
 */
export function saveUserPreferences(preferences) {
  return LocalStorageService.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

/**
 * Get user preferences
 */
export function getUserPreferences() {
  return LocalStorageService.getItem(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
  });
}

export { LocalStorageService };
