# Frontend Architecture Documentation

## Overview

The EYAI Drug Discovery Platform frontend is built with a modern, scalable architecture designed for maintainability, performance, and developer experience.

## Core Principles

### 1. Separation of Concerns

- **Presentation Layer**: React components focused on UI
- **Business Logic**: Custom hooks and services
- **Data Layer**: API services and state management
- **Utilities**: Pure functions for common operations

### 2. Component Architecture

```
┌─────────────────────────────────────┐
│         Application Root            │
│            (App.jsx)                │
└──────────────┬──────────────────────┘
               │
               ├─── Context Providers
               │    ├─── AuthContext
               │    └─── ThemeContext (future)
               │
               ├─── Router (BrowserRouter)
               │    │
               │    └─── Routes
               │         ├─── DashboardLayout
               │         │    ├─── Sidebar
               │         │    └─── Page Components
               │         │         ├─── QueryBuilder
               │         │         ├─── AgentDashboard
               │         │         ├─── Candidates
               │         │         ├─── Explainability
               │         │         └─── FDAExport
               │         │
               │         └─── Shared Components
               │              ├─── AgentStatusCard
               │              ├─── LiveLogs
               │              ├─── DataAnalyticsCharts
               │              └─── ...
               │
               └─── Global Modals
                    └─── OnboardingModal
```

### 3. Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (optional)
    ↓
API Service
    ↓
Backend API
    ↓
Response Processing
    ↓
State Update
    ↓
Component Re-render
```

## Directory Structure Deep Dive

### `/src/components`

Reusable UI components that can be used across multiple pages.

**Naming Convention**: PascalCase (e.g., `AgentStatusCard.jsx`)

**Structure**:
```jsx
export function ComponentName({ props }) {
  // Component logic
  return <div>...</div>;
}
```

**Categories**:
- **Display Components**: Pure presentational components
- **Container Components**: Components with business logic
- **Composite Components**: Components composed of other components

### `/src/pages`

Top-level route components representing full pages.

**Naming Convention**: PascalCase (e.g., `QueryBuilder.jsx`)

**Responsibilities**:
- Route-level data fetching
- Page-specific state management
- Composition of smaller components
- SEO metadata (future)

### `/src/hooks`

Custom React hooks for reusable logic.

**Naming Convention**: camelCase with `use` prefix (e.g., `useJobStatus.js`)

**Types**:
- **Data Hooks**: Fetch and manage data (`useJobResults`)
- **State Hooks**: Manage complex state (`useLocalStorage`)
- **Effect Hooks**: Handle side effects (`useJobStatus`)

### `/src/services`

External service integrations and API clients.

**Naming Convention**: camelCase (e.g., `api.js`)

**Structure**:
```javascript
export const serviceApi = {
  method1: (params) => api.call(...),
  method2: (params) => api.call(...),
};
```

### `/src/utils`

Pure utility functions with no side effects.

**Naming Convention**: camelCase (e.g., `formatters.js`)

**Categories**:
- **Formatters**: Data formatting functions
- **Validators**: Input validation functions
- **Helpers**: General helper functions

### `/src/constants`

Application-wide constants and configuration.

**Naming Convention**: SCREAMING_SNAKE_CASE for constants

**Structure**:
```javascript
export const CONSTANT_NAME = {
  KEY: 'value',
};
```

## State Management Strategy

### Local State (useState)

Use for:
- Component-specific UI state
- Form inputs
- Toggle states
- Temporary data

```jsx
const [isOpen, setIsOpen] = useState(false);
```

### Context API

Use for:
- Authentication state
- Theme preferences
- User settings
- Global UI state

```jsx
const { user, login, logout } = useAuth();
```

### Custom Hooks

Use for:
- Reusable stateful logic
- Data fetching patterns
- Complex state management

```jsx
const { data, loading, error } = useJobResults(jobId);
```

### URL State (React Router)

Use for:
- Navigation state
- Shareable state
- Deep linking

```jsx
const { jobId } = useParams();
const navigate = useNavigate();
```

## API Integration Pattern

### Request Flow

```javascript
// 1. Component initiates request
const handleSubmit = async () => {
  setLoading(true);
  try {
    // 2. Call API service
    const response = await jobsApi.create(data);
    
    // 3. Handle success
    onSuccess(response.data);
  } catch (error) {
    // 4. Handle error
    const appError = handleApiError(error);
    setError(appError);
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

```javascript
// Centralized error handling in api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);
```

## Performance Optimization

### Code Splitting

```jsx
// Lazy load routes
const QueryBuilder = lazy(() => import('./pages/QueryBuilder'));

<Suspense fallback={<Loading />}>
  <QueryBuilder />
</Suspense>
```

### Memoization

```jsx
// Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Virtual Scrolling

```jsx
// For large lists
<VirtualList
  items={candidates}
  itemHeight={100}
  renderItem={(item) => <CandidateCard {...item} />}
/>
```

## Styling Architecture

### Tailwind CSS Utility-First

```jsx
<div className="flex items-center gap-4 p-6 rounded-xl bg-white/5">
  {/* Content */}
</div>
```

### Custom CSS Classes

```css
/* For reusable patterns */
.glass-card {
  @apply bg-white/5 backdrop-blur-xl border border-white/10;
}
```

### Component-Scoped Styles

```jsx
// Use CSS modules for component-specific styles
import styles from './Component.module.css';

<div className={styles.container}>...</div>
```

## Testing Strategy

### Unit Tests

```javascript
// Test utilities and pure functions
describe('formatters', () => {
  it('should format confidence score', () => {
    expect(formatConfidence(0.85)).toBe('85%');
  });
});
```

### Integration Tests

```javascript
// Test component interactions
describe('QueryBuilder', () => {
  it('should submit query and navigate', async () => {
    render(<QueryBuilder />);
    // Test implementation
  });
});
```

### E2E Tests

```javascript
// Test complete user flows
describe('Drug Discovery Flow', () => {
  it('should complete full analysis workflow', () => {
    // Test implementation
  });
});
```

## Security Considerations

### Input Sanitization

```javascript
// Sanitize all user input
const sanitized = sanitizeHtml(userInput);
```

### XSS Prevention

```jsx
// Use dangerouslySetInnerHTML sparingly
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

### CSRF Protection

```javascript
// Include CSRF token in requests
api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

## Accessibility

### Semantic HTML

```jsx
<nav aria-label="Main navigation">
  <button aria-label="Open menu">Menu</button>
</nav>
```

### Keyboard Navigation

```jsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

### Screen Reader Support

```jsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

## Build and Deployment

### Development Build

```bash
npm run dev
# Fast refresh, source maps, dev tools
```

### Production Build

```bash
npm run build
# Minification, tree-shaking, optimization
```

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [asset]-[hash].[ext]
├── index.html
└── favicon.ico
```

## Future Enhancements

### TypeScript Migration

- Add type safety
- Improve IDE support
- Catch errors at compile time

### State Management Library

- Consider Redux Toolkit or Zustand
- For complex global state
- Better dev tools

### Testing Coverage

- Increase test coverage to 80%+
- Add visual regression tests
- Implement E2E test suite

### Performance Monitoring

- Add performance metrics
- Implement real user monitoring
- Track Core Web Vitals

## Conclusion

This architecture provides a solid foundation for building a scalable, maintainable, and performant React application. It follows industry best practices while remaining flexible enough to adapt to changing requirements.
