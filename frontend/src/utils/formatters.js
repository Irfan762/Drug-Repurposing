/**
 * Formatting Utilities
 * Functions for formatting data for display
 */

/**
 * Format confidence score as percentage
 */
export function formatConfidence(score) {
  if (typeof score !== 'number') return 'N/A';
  return `${Math.round(score * 100)}%`;
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return 'N/A';
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== 'number') return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  
  return then.toLocaleDateString();
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number') return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format market estimate
 */
export function formatMarketEstimate(estimate) {
  if (!estimate) return 'N/A';
  
  // Extract number from string like "$8.2B by 2030"
  const match = estimate.match(/\$?([\d.]+)([BMK])?/i);
  if (!match) return estimate;
  
  const value = parseFloat(match[1]);
  const unit = match[2]?.toUpperCase() || '';
  
  return `$${value}${unit}`;
}

/**
 * Format agent name for display
 */
export function formatAgentName(agentName) {
  if (!agentName || typeof agentName !== 'string') return '';
  return agentName.charAt(0).toUpperCase() + agentName.slice(1).toLowerCase();
}

/**
 * Format job ID for display
 */
export function formatJobId(jobId) {
  if (!jobId || typeof jobId !== 'string') return '';
  return jobId.startsWith('#') ? jobId : `#${jobId}`;
}
