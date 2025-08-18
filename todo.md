# Todo List - Backstreet Betas

## Current Priority Tasks

### ✅ Complete Header Redesign - COMPLETED
- [x] **Replace dual header system with single minimal header**
  - ✅ **SOLUTION:** Completely redesigned TabbedLibrary header system
  - ✅ Removed old main header: "Back to Main | Strategy Analysis | Compare View | Close All Strategies"
  - ✅ Removed old tab bar system with traditional tabs
  - ✅ Implemented SingleNavigationBar as the only header for all views
  - ✅ Achieved consistent single-row header: "☰ Library | Strategy Tabs | Compare ⋮"
  - ✅ Maintained all navigation functionality (back, tab switching, compare, close)
  - ✅ Fixed header height consistency - no more growing when tabs are added
  - ✅ Preserved functionality for all other screens (Dashboard, Settings, etc.)

### 🔄 Outstanding Issues
- [ ] **Fix Compare button functionality**
  - Compare button currently doesn't activate comparison view
  - Header remains visible (fixed) but view doesn't switch to comparison mode
  - Need to investigate comparison view activation logic

### 🎯 Next Phase Tasks
- [ ] **Complete comparison view functionality**
- [ ] **Test all navigation flows thoroughly**
- [ ] **Remove any remaining debug code**

## Completed Tasks ✅

### 📱 Inline Accordion System (Recently Completed)
- [x] Convert SidebarPanel to inline accordion system
- [x] Remove tab switching logic and activeTab state management
- [x] Replace TabNavigation with inline accordion menu system
- [x] Each configuration section now expands directly in menu
- [x] Implement Tesla optimization: single accordion on screens ≤1200px
- [x] Maintain localStorage persistence for accordion states
- [x] Portfolio defaults to expanded, others collapsed
- [x] Smooth 300ms transitions for expand/collapse animations

## Notes
- Accordion UI is working correctly for sidebar
- Focus now on header consolidation and tab functionality
- Tesla screen optimization is already implemented in accordion system

## 📅 2025-08-18 - Dashboard Header Redesign

### 🎯 Dashboard Minimal Header Implementation
- [ ] **Create DashboardHamburgerMenu component**
  - Add Favorites section for quick access to starred items
  - Include Account & Settings section (Profile, Account Settings, Trading Preferences, etc.)
  - Add Theme toggle within menu
  - Include Sign Out functionality
  - Optimize for Tesla/car usage with large touch targets

- [ ] **Implement Favorites System**
  - Create FavoritesContext for state management
  - Add bookmark/unbookmark functionality throughout app
  - Create "Add to Favorites" action for any screen
  - Store favorites in localStorage with user preferences
  - Support favorites for strategies, reports, comparisons, portfolios

- [ ] **Create Minimal Dashboard Header**
  - Replace current Header component with minimal design
  - Layout: [☰] [Backstreet Betas] [Beta]
  - Remove separate Theme, Settings, Profile buttons
  - Add hamburger menu button on left
  - Keep brand name and Beta badge only

- [ ] **Update Dashboard Component**
  - Replace Header usage with new minimal header
  - Add hamburger menu state management
  - Connect favorites to existing navigation functions
  - Ensure all current functionality is preserved
  - Test automotive/mobile UX

### 🎯 Goals
- Consistent header design across app (matches strategy view)
- Tesla/car-optimized quick access via favorites
- Personalized user experience with bookmarked screens
- Reduced navigation steps for power users
- Clean, minimal dashboard interface