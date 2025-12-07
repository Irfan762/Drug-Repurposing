# Developer Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Route components
├── hooks/           # Custom React hooks
├── services/        # API and external services
├── utils/           # Utility functions
├── constants/       # Configuration and constants
├── context/         # React context providers
├── layouts/         # Page layouts
└── assets/          # Static assets
```

## 🎯 Common Tasks

### Creating a New Component

```jsx
/**
 * ComponentName
 * Brief description
 */

import { useState } from 'react';
import { Icon } from 'lucide-react';

export function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  const handleEvent = () => {
    // Implementation
  };

  return (
    <div className="glass-card p-6">
      {/* Content */}
    </div>
  );
}
```

### Creating a Custom Hook

```javascript
/**
 * useCustomHook
 * Brief description
 */

import { useState, useEffect } from 'react';

export function useCustomHook(param) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Implementation
    return () => {
      // Cleanup
    };
  }, [param]);

  return { data, loading, error };
}
```

### Making API Calls

```javascript
import { jobsApi } from '../services/api';
import { handleApiError } from '../utils/errorHandler';

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await jobsApi.getResults(jobId);
    setData(response.data);
  } catch (error) {
    const appError = handleApiError(error);
    setError(appError);
  } finally {
    setLoading(false);
  }
};
```

### Using Constants

```javascript
import { 
  AGENTS, 
  AGENT_STATUS, 
  UI_CONFIG,
  ERROR_MESSAGES 
} from '../constants';

// Use constants instead of magic strings
if (agent.status === AGENT_STATUS.RUNNING) {
  // Do something
}

// Use configuration
const interval = UI_CONFIG.POLLING_INTERVAL;
```

### Formatting Data

```javascript
import { 
  formatConfidence,
  formatNumber,
  formatFileSize,
  formatRelativeTime 
} from '../utils/formatters';

const score = formatConfidence(0.85);        // "85%"
const size = formatNumber(1500000);          // "1.5M"
const fileSize = formatFileSize(2048576);    // "2.0 MB"
const time = formatRelativeTime(date);       // "2 hours ago"
```

### Validating Input

```javascript
import { validateQuery, validateEmail } from '../utils/validation';

const result = validateQuery(userInput);
if (!result.valid) {
  setError(result.error);
  return;
}

const isValid = validateEmail(email);
```

### Using localStorage

```javascript
import { 
  saveJobToHistory,
  getJobHistory,
  LocalStorageService 
} from '../services/localStorage';
import { STORAGE_KEYS } from '../constants';

// Save job
saveJobToHistory({ jobId, query, candidatesCount });

// Get history
const history = getJobHistory();

// Generic storage
LocalStorageService.setItem(STORAGE_KEYS.USER_PREFERENCES, prefs);
const prefs = LocalStorageService.getItem(STORAGE_KEYS.USER_PREFERENCES);
```

## 🎨 Styling Guide

### Using Tailwind Classes

```jsx
<div className="glass-card p-6 rounded-2xl">
  <h2 className="text-2xl font-bold gradient-text">Title</h2>
  <button className="btn-premium">Click Me</button>
</div>
```

### Available Custom Classes

```css
/* Cards */
.glass-card          /* Glass morphism card */
.glass-ultra         /* Enhanced glass card */
.card-holographic    /* Holographic effect card */

/* Buttons */
.btn-premium         /* Premium gradient button */
.btn-neon            /* Neon glow button */

/* Text */
.gradient-text       /* Gradient text effect */
.text-neon-gradient  /* Neon gradient text */

/* Badges */
.badge               /* Standard badge */
.badge-neon          /* Neon badge */

/* Progress */
.progress-bar        /* Progress bar container */
.progress-fill       /* Progress bar fill */
.progress-neon       /* Neon progress bar */

/* Effects */
.spotlight-effect    /* Spotlight hover effect */
.icon-glow           /* Icon glow effect */
.glow-pulse          /* Pulsing glow animation */
.float-slow          /* Floating animation */

/* Animations */
.animate-fade-in     /* Fade in animation */
.slide-in-bottom     /* Slide from bottom */
.scale-in            /* Scale in animation */
```

### Color Palette

```javascript
{
  background: '#0f172a',  // Slate 900
  surface: '#1e293b',     // Slate 800
  primary: '#6366f1',     // Indigo 500
  secondary: '#ec4899',   // Pink 500
  accent: '#8b5cf6',      // Violet 500
  text: '#f8fafc',        // Slate 50
  muted: '#94a3b8',       // Slate 400
}
```

## 🔧 Useful Hooks

### useJobStatus

```javascript
import { useJobStatus } from '../hooks';

const { status, agents, loading, error, refetch } = useJobStatus(jobId, {
  enabled: true,
  pollingInterval: 1000,
  onComplete: (data) => console.log('Complete!', data),
});
```

### useJobResults

```javascript
import { useJobResults } from '../hooks';

const { candidates, loading, error, refetch } = useJobResults(jobId, {
  enabled: true,
  onSuccess: (data) => console.log('Success!', data),
});
```

### useLocalStorage

```javascript
import { useLocalStorage } from '../hooks';

const [value, setValue, removeValue] = useLocalStorage('key', defaultValue);
```

## 🐛 Debugging

### Development Logging

```javascript
// API calls are automatically logged in development
// Check console for:
// [API Request] POST /api/v1/jobs/query
// [API Response] /api/v1/jobs/query {...}
```

### Error Logging

```javascript
import { logError } from '../utils/errorHandler';

try {
  // Code
} catch (error) {
  logError(error, { context: 'additional info' });
}
```

### React DevTools

- Install React DevTools browser extension
- Inspect component hierarchy
- View props and state
- Profile performance

## 📝 Code Style

### Naming Conventions

```javascript
// Components: PascalCase
export function AgentStatusCard() {}

// Hooks: camelCase with 'use' prefix
export function useJobStatus() {}

// Utilities: camelCase
export function formatConfidence() {}

// Constants: SCREAMING_SNAKE_CASE
export const API_CONFIG = {};

// Variables: camelCase
const jobId = '123';
const isLoading = true;
```

### File Naming

```
ComponentName.jsx      # Components
useHookName.js         # Hooks
utilityName.js         # Utilities
index.js               # Barrel exports
```

### Import Order

```javascript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 2. Internal modules
import { jobsApi } from '../services/api';
import { formatConfidence } from '../utils/formatters';
import { AGENTS } from '../constants';

// 3. Components
import { AgentStatusCard } from '../components/AgentStatusCard';

// 4. Styles
import './styles.css';
```

## 🧪 Testing

### Unit Test Example

```javascript
import { formatConfidence } from '../utils/formatters';

describe('formatConfidence', () => {
  it('should format score as percentage', () => {
    expect(formatConfidence(0.85)).toBe('85%');
  });

  it('should handle invalid input', () => {
    expect(formatConfidence(null)).toBe('N/A');
  });
});
```

### Component Test Example

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentStatusCard } from './AgentStatusCard';

describe('AgentStatusCard', () => {
  it('should render agent name', () => {
    render(<AgentStatusCard name="Clinical" status="running" />);
    expect(screen.getByText('Clinical')).toBeInTheDocument();
  });
});
```

## 🚨 Common Pitfalls

### ❌ Don't

```javascript
// Magic strings
if (status === 'running') {}

// Inline API calls
fetch('/api/v1/jobs').then(...)

// Repeated formatting
const score = `${Math.round(value * 100)}%`;

// No error handling
const data = await api.call();
```

### ✅ Do

```javascript
// Use constants
import { AGENT_STATUS } from '../constants';
if (status === AGENT_STATUS.RUNNING) {}

// Use API service
import { jobsApi } from '../services/api';
const response = await jobsApi.list();

// Use utilities
import { formatConfidence } from '../utils/formatters';
const score = formatConfidence(value);

// Handle errors
try {
  const data = await api.call();
} catch (error) {
  handleApiError(error);
}
```

## 📚 Resources

### Documentation
- [README_PROFESSIONAL.md](./README_PROFESSIONAL.md) - Complete guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture details
- [CHANGELOG.md](./CHANGELOG.md) - Version history

### External Resources
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)

## 🆘 Getting Help

1. Check the documentation
2. Search existing issues
3. Ask the team
4. Create a new issue

## 🎯 Checklist for New Features

- [ ] Create component/hook/utility
- [ ] Add JSDoc comments
- [ ] Use constants instead of magic values
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test accessibility
- [ ] Write tests
- [ ] Update documentation
- [ ] Run linter
- [ ] Test in browser

---

**Last Updated**: December 7, 2024
**Version**: 2.0.0
