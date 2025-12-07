/**
 * Error Handling Utilities
 * Centralized error handling and logging for the application
 */

import { ERROR_MESSAGES } from '../constants';

/**
 * Error types for categorization
 */
export const ErrorType = {
  NETWORK: 'NETWORK',
  API: 'API',
  VALIDATION: 'VALIDATION',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, type = ErrorType.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Determine error type from axios error
 */
export function getErrorType(error) {
  if (!error.response) {
    return ErrorType.NETWORK;
  }
  if (error.response.status >= 400 && error.response.status < 500) {
    return ErrorType.VALIDATION;
  }
  if (error.response.status >= 500) {
    return ErrorType.API;
  }
  return ErrorType.UNKNOWN;
}

/**
 * Extract user-friendly error message
 */
export function getErrorMessage(error) {
  // Handle AppError
  if (error instanceof AppError) {
    return error.message;
  }

  // Handle axios errors
  if (error.response) {
    const detail = error.response.data?.detail;
    const message = error.response.data?.message;
    return detail || message || ERROR_MESSAGES.API_ERROR;
  }

  // Handle network errors
  if (error.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Handle other errors
  return error.message || ERROR_MESSAGES.API_ERROR;
}

/**
 * Log error to console (can be extended to send to logging service)
 */
export function logError(error, context = {}) {
  const errorInfo = {
    message: error.message,
    type: error.type || ErrorType.UNKNOWN,
    timestamp: new Date().toISOString(),
    context,
    stack: error.stack,
  };

  console.error('[ERROR]', errorInfo);

  // TODO: Send to logging service (e.g., Sentry, LogRocket)
  // sendToLoggingService(errorInfo);
}

/**
 * Handle API errors with consistent logging and user feedback
 */
export function handleApiError(error, context = {}) {
  const errorType = getErrorType(error);
  const errorMessage = getErrorMessage(error);
  
  const appError = new AppError(errorMessage, errorType, error);
  logError(appError, context);
  
  return appError;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff(
  fn,
  maxRetries = 3,
  baseDelay = 1000
) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry attempt ${i + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync(fn, fallbackValue = null) {
  try {
    return await fn();
  } catch (error) {
    logError(error, { function: fn.name });
    return fallbackValue;
  }
}
