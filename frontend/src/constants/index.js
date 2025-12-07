/**
 * Application Constants
 * Centralized configuration for the EYAI Drug Discovery Platform
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Agent Configuration
export const AGENTS = {
  CLINICAL: 'Clinical',
  GENOMICS: 'Genomics',
  RESEARCH: 'Research',
  MARKET: 'Market',
  PATENT: 'Patent',
  SAFETY: 'Safety',
};

export const AGENT_LIST = Object.values(AGENTS);

// Agent Status
export const AGENT_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  ERROR: 'error',
};

// Job Status
export const JOB_STATUS = {
  INITIALIZING: 'initializing',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Export Formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  XLSX: 'xlsx',
  PPTX: 'pptx',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  JOB_HISTORY: 'eyai_job_history',
  EXPORT_HISTORY: 'eyai_export_history',
  USER_PREFERENCES: 'eyai_user_preferences',
};

// UI Configuration
export const UI_CONFIG = {
  MAX_HISTORY_ITEMS: 20,
  MAX_EXPORT_HISTORY: 50,
  POLLING_INTERVAL: 1000, // ms
  LOG_UPDATE_INTERVAL: 1200, // ms
  MAX_LOGS_DISPLAYED: 30,
  ANIMATION_DURATION: 300, // ms
};

// Chart Colors
export const CHART_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
];

// Confidence Score Thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 85,
  MEDIUM: 70,
  LOW: 50,
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CANDIDATES: '/candidates',
  EXPLAINABILITY: '/explain',
  EXPORT: '/export',
};

// Example Queries
export const EXAMPLE_QUERIES = [
  {
    text: "Find kinase inhibitors for Alzheimer's disease",
    category: "Neuroscience",
  },
  {
    text: "Discover FDA-approved drugs with neuroprotective effects",
    category: "Safety",
  },
  {
    text: "Identify antibiotics for resistant bacterial infections",
    category: "Infectious Disease",
  },
  {
    text: "Find PPARγ agonists for neurodegenerative diseases",
    category: "Metabolic",
  },
];

// Quick Filters
export const QUICK_FILTERS = [
  'FDA Approved',
  'Phase 3',
  'Small Molecule',
  'Oral',
  'Brain Penetrant',
];

// Data Sources
export const DATA_SOURCES = {
  DRUGS_DB: 'CSV: drugs_database.csv',
  RESEARCH_PAPERS: 'CSV: research_papers.csv',
  CLINICAL_TRIALS: 'CSV: clinical_trials.csv',
  PATENTS: 'CSV: patents.csv',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Failed to communicate with the server.',
  INVALID_QUERY: 'Please enter a valid query.',
  EXPORT_FAILED: 'Failed to generate export. Please try again.',
  NO_RESULTS: 'No results found for your query.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPORT_COMPLETE: 'Export completed successfully!',
  JOB_CREATED: 'Analysis job created successfully.',
  DATA_LOADED: 'Data loaded successfully.',
};
