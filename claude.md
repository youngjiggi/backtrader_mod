# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Best Practice

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md

## Project Overview

This is **Backstreet Betas**, a modern full-stack backtesting application built on top of the backtrader Python library. The project consists of a React/TypeScript frontend and Python backend, currently focused on frontend development with mock data.

## Development Commands

### Frontend Development
```bash
cd frontend
npm install              # Install dependencies
npm run dev             # Start development server (Vite)
npm run build           # Build for production (TypeScript + Vite)
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

### Python Backend
```bash
python -m venv venv     # Create virtual environment
venv\Scripts\activate   # Activate venv (Windows)
pip install -r requirements.txt  # Install dependencies (if exists)
python bt-run.py        # Run backtrader examples
```

## Architecture Overview

### Frontend Architecture (React/TypeScript)
- **State-based routing**: Simple `currentView` state in App.tsx, no React Router
- **Context-heavy state management**: Multiple React contexts (Theme, User, Strategy, Watchlist, FontSize, PanelManager)
- **Sophisticated panel system**: Resizable, collapsible panels with layout modes ('separate'/'combined')
- **Mock-first development**: Heavy use of sample data, no API integration yet

### Key Layout Components
- **App.tsx**: Main navigation controller with view state management
- **StrategyLayout.tsx**: Reusable layout wrapper with header + resizable panels
- **PanelManager.tsx**: Centralized panel state (visibility, sizing, layout modes)
- **ResizablePanel.tsx**: Drag-to-resize panels with localStorage persistence

### Context Providers (nested in App.tsx)
```tsx
<UserProvider>          // User profile, auth, preferences
  <ThemeProvider>       // Light/dark theme
    <FontSizeProvider>  // Typography scaling
      <StrategyProvider>// Strategy templates & CRUD
        <WatchlistProvider> // Watchlist management
```

### Navigation Pattern
- Dashboard → Library/Strategies/Reports via callback props
- All screens have `onBack()` returning to dashboard
- Data passed via props (strategies, backtests) and contexts

## Working with Existing Code

### Layout System
- Use `StrategyLayout` for any strategy-related screens (consistent header + panels)
- Panel system supports left sidebar, right analytics panel, bottom trade journal
- All panels are resizable and collapsible with localStorage persistence

### State Management
- User data: Use `useUser()` hook from UserContext (includes profile, preferences, mock auth)
- Themes: Use `useTheme()` for light/dark mode
- Panel state: Use `usePanelManager()` for panel visibility/sizing

### UI Patterns
- CSS custom properties for theming (`var(--bg-primary)`, `var(--accent)`, etc.)
- Tailwind CSS for component styling
- Lucide React for icons
- ProfileSection component for consistent settings/profile layouts

### User Profile System (Recently Added)
- Complete user account management with UserContext
- UserProfileScreen, AccountSettingsScreen, TradingPreferencesScreen
- AvatarUpload, PreferenceToggle, ProfileSection reusable components
- Enhanced Header with profile dropdown
- Enhanced SettingsScreen as settings hub

## Development Workflow

### Planning & Tasks
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan
4. Then, begin working on the todo items, marking them as complete as you go
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity
7. Finally, add a review section to the todo.md
8. In the end, document the changes in the changelog.md concisely.

### Code Style
- Follow existing patterns: context providers, callback props, mock data
- Use TypeScript interfaces consistently
- Maintain responsive design patterns
- Follow established CSS custom property naming
- Update CHANGELOG.md with all changes

### Common Development Patterns
- New screens: Create component, add to App.tsx routing, handle navigation callbacks
- New user features: Extend UserContext interfaces, update related screens
- Panel modifications: Work with PanelManager context, maintain localStorage persistence
- Theme changes: Use CSS custom properties, ensure both light/dark mode support

## File Structure

```
frontend/src/
├── components/          # All React components (screens, UI elements)
├── contexts/           # React contexts for state management
├── utils/              # Utility functions and mock data
└── types/              # TypeScript type definitions

docs/                   # Project documentation and planning
tasks/                  # Current development tasks and todos
tests/                  # Python tests for backtrader functionality
tools/                  # Python scripts and utilities
```

## Key Development Considerations

- **Mock data**: Frontend currently uses sample/mock data extensively
- **No backend integration**: API layer not yet implemented
- **Panel-centric UI**: Complex resizable panel system is core to UX
- **Context over Redux**: State management relies on React Context API
- **Theme-first design**: Dark/light mode support is fundamental
- **Mobile responsive**: Panel system adapts to smaller screens

## Current Focus Areas

The project is actively developing the frontend user interface with emphasis on:
- User profile and account management systems
- Advanced layout and panel management
- Trading preferences and settings
- Mock data visualization and backtesting results display

