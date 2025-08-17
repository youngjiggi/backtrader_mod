# Changelog

All notable changes to the Backstreet Betas backtesting application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Trade Journal Accordion Enhancement** - Improved performance and UX for large trade datasets
  - Trade journal now shows only first 10 trades by default in main table
  - Additional trades displayed in expandable accordion section with "Show X more trades" button
  - Accordion uses chevron icons (up/down) to indicate expand/collapse state
  - All existing functionality maintained: filtering, sorting, search, and summary statistics
  - Performance improvement for strategies with many trades (100+ entries)
  - Consistent styling with existing table design and theme colors
  - Applied to both single strategy view and multi-strategy view through BottomPanel component
- **Panel Layout Default Changed** - Combined mode now default for better UX
  - Changed default panel layout from 'separate' to 'combined' mode
  - Affects both single strategy view and multi-strategy view screens
  - Combined mode provides cleaner interface with expanded left panel and hidden right panel
  - Users can still toggle to separate mode if preferred
  - Setting persists in localStorage for individual user preference
- **Consolidated Navigation System** - Modern single-bar navigation replacing 3-level header structure
  - SingleNavigationBar component with exact layout: [☰] [Library] [Strategy Tabs] [Compare] [⋮]
  - Responsive design optimized for Tesla Model 3/Y (1920x1200 @150 PPI), iPad, desktop, and 4K displays
  - Touch-friendly interface with larger targets for automotive use cases
  - HamburgerMenu slide-out drawer with organized navigation sections
  - MoreMenu dropdown with 5 sections: Layout & View Controls, Strategy Management, Data & Export, Chart Settings, Share Strategy
  - Integrated with PanelManager for layout controls and panel visibility toggles
- **Resizable Chart System** - Dynamic chart height control with drag-to-resize functionality
  - ChartResizeHandle component for vertical chart height adjustment only
  - Touch-optimized with larger interaction areas for Tesla/mobile use
  - ResizableChartContainer wrapper with localStorage persistence for user preferences
  - Responsive height constraints based on screen size (max 70% of viewport height)
  - Visual feedback during resize with accent color highlighting
  - Chart axis zoom/pan functionality placeholder implementation
- **User Profile System** - Complete user account management system
  - User Context for state management with TypeScript interfaces
  - UserProfileScreen with avatar display, inline name editing, and user statistics
  - AccountSettingsScreen with personal info editing, password change, and notification preferences
  - TradingPreferencesScreen for backtesting-specific preferences
  - ProfileSection reusable component for consistent layouts
  - AvatarUpload component with preview and validation
  - PreferenceToggle component for settings controls
  - Enhanced Header with profile dropdown and user avatar
  - Enhanced SettingsScreen as comprehensive settings hub

- **Additional Profile Settings Screens** - Completed the user profile system
  - NotificationSettingsScreen for comprehensive notification management
  - DataSettingsScreen for data export, backup, and retention preferences
  - Full navigation integration with SettingsScreen buttons
  - Alert threshold settings and notification frequency controls
  - Data export in multiple formats (CSV, JSON, Excel, PDF)
  - Privacy and security information sections

- **Display Settings Screen** - Dedicated interface for theme and display customization
  - DisplaySettingsScreen with comprehensive display controls
  - Theme selection with visual preview cards (Light/Dark themes)
  - Font size settings with live preview and sample text
  - Interface preferences (compact mode, tooltips, animations)
  - Accessibility options placeholder (high contrast, reduced motion)
  - Live preview panel showing current theme, colors, and settings summary
  - Quick actions for theme toggle and font size toggle
  - Reset to defaults functionality with confirmation dialog

- **Strategy Library Modernization** - Complete redesign with modern minimal interface
  - Modern minimal header with refined typography and improved spacing
  - Table/Card view toggle with seamless switching between display modes
  - Enhanced search functionality with real-time filtering by name and tags
  - Timeframe filter dropdown for focused strategy browsing
  - Redesigned strategy cards with clean, minimal aesthetic and hover interactions
  - Compact table view with sortable columns and inline actions
  - Modernized empty state with contextual messaging and call-to-action
  - Enhanced feature pills with color-coded indicators for strategy capabilities
  - Improved navigation integration with proper StrategyViewScreen routing

- **Advanced Strategy Management Features** - Complete "Should Have" feature set
  - Performance metrics preview with trend indicators, win rates, and health scores
  - Smart sorting system (name, performance, win rate, created date, updated date)
  - Ascending/descending sort controls with visual direction indicator
  - Recent strategies section showing strategies updated within 7 days
  - Favorites section with quick-access strategy buttons
  - Comprehensive strategy status system (active, draft, archived, paused)
  - Color-coded health indicators based on performance scores
  - Bulk operations for table view with multi-select checkboxes
  - Bulk action toolbar for duplicate and delete operations
  - Enhanced strategy cards with favorite stars and status indicators

### Fixed
- **User Profile Navigation** - Connected existing user profile screens to main navigation system
  - Added imports for UserProfileScreen, AccountSettingsScreen, TradingPreferencesScreen to App.tsx
  - Extended CurrentView type with 'profile', 'account-settings', 'trading-preferences'
  - Added navigation handlers and routing for all profile screens
  - Connected Header profile dropdown and SettingsScreen navigation buttons
  - Profile navigation now works: Header dropdown → Profile, Settings buttons → respective screens

- **StrategyViewScreen Layout** - Fixed purple gap between chart and trade journal panel
  - Updated StrategyLayout chart content container to use proper flex layout
  - Modified StrategyViewScreen to use `flex-1` instead of `h-full` for better space utilization
  - Improved AccountBalanceChart positioning to eliminate excessive spacing

- **Strategy Library Navigation** - Fixed strategy execution flow from library to strategy view
  - Updated App.tsx onRunStrategy callback to properly convert StrategyTemplate to RecentRun
  - Strategy execution now navigates to StrategyViewScreen with mock backtest data
  - Replaced console logging with functional navigation integration

- **Chart-Trade Journal Gap Removal** - Eliminated unwanted spacing between chart and trade journal
  - Updated StrategyLayout to remove bottom padding from chart container (pb-0)
  - Applied only horizontal padding (px-4) to bottom panel to maintain alignment
  - Used integrated variant for BottomPanel to prevent extra padding
  - Ensures seamless visual connection between chart and trade journal

- **CSS Hover Syntax Error** - Fixed invalid hover object syntax in HamburgerMenu component
  - Removed problematic CSS-in-JS hover object syntax
  - Implemented proper hover effects using onMouseEnter/onMouseLeave event handlers
  - Maintains hover functionality while following React event handling patterns

### Changed
- App.tsx now includes UserProvider wrapper for user context functionality
- Header component enhanced with profile dropdown and authentication state management
- SettingsScreen redesigned as organized settings hub with categorized navigation
- SettingsScreen simplified by removing Quick Settings panel (replaced by dedicated DisplaySettingsScreen)
- **StrategyLayout Architecture** - Major refactor to support new navigation system
  - Replaced 3-level header structure with SingleNavigationBar component
  - Updated component props to support new navigation callbacks (onLibraryClick, onCompareClick)
  - Enhanced strategy tabs creation from strategy data with proper active state management
  - Integrated ResizableChartContainer for dynamic chart height control

---

## How to Use This Changelog

### Categories
- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Format
Each entry should include:
- Brief description of the change
- Impact on users or functionality
- Related component/file names when relevant
- Any breaking changes clearly marked