/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

/**
 * Validate query string
 */
export function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query must be a non-empty string' };
  }

  const trimmed = query.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Query must be at least 3 characters long' };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Query must be less than 500 characters' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate job ID format
 */
export function validateJobId(jobId) {
  if (!jobId || typeof jobId !== 'string') {
    return false;
  }

  // Job ID should match pattern: #XXXXXX or similar
  const pattern = /^#?[A-Z0-9]{6,10}$/i;
  return pattern.test(jobId);
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate file size
 */
export function validateFileSize(file, maxSizeMB = 10) {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(file, allowedTypes = []) {
  if (!file || allowedTypes.length === 0) return false;
  return allowedTypes.includes(file.type);
}
