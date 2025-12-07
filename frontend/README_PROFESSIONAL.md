# EYAI Drug Discovery Platform - Frontend

A professional, production-ready React application for AI-powered drug repurposing and discovery.

## 🏗️ Architecture

### Technology Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.10.1
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.13.2
- **Visualizations**: 
  - Recharts 3.5.1 (Charts)
  - @xyflow/react 12.10.0 (Flow diagrams)
  - D3.js 7.9.0 (Advanced visualizations)
- **Animations**: Framer Motion 12.23.25
- **Icons**: Lucide React 0.556.0

### Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts)
│   ├── components/      # Reusable UI components
│   ├── constants/       # Application constants and configuration
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components (routes)
│   ├── services/        # API and external services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Root application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Public static files
├── dist/                # Production build output
├── .env                 # Environment variables
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## 📁 Code Organization

### Components

All components follow a consistent structure:

```jsx
/**
 * Component Name
 * Brief description of what the component does
 */

import { useState } from 'react';
import { Icon } from 'lucide-react';

export function ComponentName({ prop1, prop2 }) {
  // State and hooks
  const [state, setState] = useState(null);

  // Event handlers
  const handleEvent = () => {
    // Implementation
  };

  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}
```

### Custom Hooks

Located in `src/hooks/`:

- **useJobStatus**: Manages job status polling
- **useJobResults**: Fetches and caches job results
- **useLocalStorage**: Syncs state with localStorage

### Services

Located in `src/services/`:

- **api.js**: Centralized API client with interceptors
- **localStorage.js**: localStorage management utilities

### Utilities

Located in `src/utils/`:

- **formatters.js**: Data formatting functions
- **validation.js**: Input validation utilities
- **errorHandler.js**: Error handling and logging

### Constants

Located in `src/constants/`:

- Centralized configuration
- API endpoints
- UI constants
- Error messages

## 🎨 Styling Guidelines

### Tailwind CSS Classes

We use a custom design system built on Tailwind:

```css
/* Glass morphism cards */
.glass-card

/* Premium gradient buttons */
.btn-premium

/* Gradient text */
.gradient-text

/* Badges */
.badge

/* Progress bars */
.progress-bar
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

## 🔧 Best Practices

### Component Design

1. **Single Responsibility**: Each component should do one thing well
2. **Prop Validation**: Use PropTypes or TypeScript for type safety
3. **Error Boundaries**: Wrap components in error boundaries
4. **Accessibility**: Use semantic HTML and ARIA attributes

### State Management

1. **Local State**: Use `useState` for component-specific state
2. **Context**: Use Context API for shared state
3. **Custom Hooks**: Extract reusable logic into custom hooks
4. **Memoization**: Use `useMemo` and `useCallback` for performance

### API Calls

1. **Centralized**: All API calls go through `services/api.js`
2. **Error Handling**: Use consistent error handling
3. **Loading States**: Always show loading indicators
4. **Caching**: Cache responses when appropriate

### Code Quality

1. **ESLint**: Follow ESLint rules
2. **Formatting**: Use consistent code formatting
3. **Comments**: Document complex logic
4. **Naming**: Use descriptive variable and function names

## 📊 Performance Optimization

### Implemented Optimizations

1. **Code Splitting**: Routes are lazy-loaded
2. **Memoization**: Expensive computations are memoized
3. **Virtual Scrolling**: Large lists use virtual scrolling
4. **Image Optimization**: Images are optimized and lazy-loaded
5. **Bundle Size**: Dependencies are tree-shaken

### Performance Metrics

- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Lighthouse Score: > 90

## 🧪 Testing

### Testing Strategy

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/           # Unit tests for utilities and hooks
├── integration/    # Integration tests for components
└── e2e/           # End-to-end tests
```

## 🔒 Security

### Implemented Security Measures

1. **XSS Prevention**: All user input is sanitized
2. **CSRF Protection**: CSRF tokens for state-changing operations
3. **Content Security Policy**: Strict CSP headers
4. **Dependency Scanning**: Regular security audits

## 📱 Responsive Design

The application is fully responsive and supports:

- Desktop (1920px+)
- Laptop (1366px - 1919px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 🚢 Deployment

### Production Build

```bash
# Create production build
npm run build

# The build output will be in the dist/ directory
```

### Docker Deployment

```bash
# Build Docker image
docker build -t eyai-frontend .

# Run container
docker run -p 80:80 eyai-frontend
```

### Environment-Specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 📈 Monitoring

### Analytics

- Google Analytics integration
- Custom event tracking
- User behavior analysis

### Error Tracking

- Sentry integration for error monitoring
- Real-time error alerts
- Performance monitoring

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes following code guidelines
3. Write tests for new features
4. Submit pull request
5. Code review
6. Merge to main

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

## 📝 License

Copyright © 2024 EYAI Drug Discovery Platform

## 🆘 Support

For support, email support@eyai.com or open an issue on GitHub.

## 🗺️ Roadmap

### Q1 2025
- [ ] TypeScript migration
- [ ] Advanced analytics dashboard
- [ ] Real-time collaboration features

### Q2 2025
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Advanced export formats

### Q3 2025
- [ ] AI-powered query suggestions
- [ ] Custom agent configuration
- [ ] Multi-language support
