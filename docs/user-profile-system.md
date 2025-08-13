# User Profile System - Implementation Plan

## Overview
This document outlines the comprehensive user profile system for the Backstreet Betas backtesting application. The system provides user account management, personalization, and preferences while maintaining consistency with the existing application design.

## MoSCoW Prioritization

### **MUST HAVE** (Essential for MVP user experience)

#### 1. User Profile Dashboard (`UserProfileScreen.tsx`)
- **Purpose**: Main profile overview and navigation hub
- **Features**:
  - User avatar/initials display with upload capability
  - Basic user info (name, email) with inline editing
  - Recent activity summary (strategies, backtests, portfolios)
  - Navigation cards to other profile sections
- **UI Pattern**: Full-screen layout matching existing screens (Dashboard, SettingsScreen)

#### 2. Basic Account Settings (`AccountSettingsScreen.tsx`)
- **Purpose**: Essential account management functionality
- **Features**:
  - Personal information editing (display name, email)
  - Password change with validation
  - Basic notification preferences
  - Account deletion with confirmation
- **UI Pattern**: Form-based layout matching PortfolioFormModal styling

#### 3. Header Profile Integration
- **Purpose**: Primary access point for profile features
- **Features**:
  - User avatar/initials in header
  - Profile dropdown menu
  - Quick access to profile, settings, sign out
- **UI Pattern**: Dropdown styling consistent with existing modals

#### 4. User Context System (`UserContext.tsx`)
- **Purpose**: State management foundation
- **Features**:
  - User data management following WatchlistContext patterns
  - Local storage persistence
  - Authentication state handling
- **Technical Pattern**: React Context API with TypeScript interfaces

### **SHOULD HAVE** (Important for good UX)

#### 5. Trading Preferences Screen (`TradingPreferencesScreen.tsx`)
- **Purpose**: Backtesting-specific user preferences
- **Features**:
  - Default portfolio parameters
  - Preferred timeframes and chart settings
  - Default benchmark selections
  - Auto-save preferences
- **Integration**: Works with existing strategy and portfolio systems

#### 6. Enhanced Profile Components
- **ProfileSection.tsx**: Reusable section wrapper
- **AvatarUpload.tsx**: Photo upload with crop functionality
- **PreferenceToggle.tsx**: Styled toggle switches
- **UI Pattern**: Consistent theming with app CSS variables

#### 7. Settings Hub Enhancement
- **Purpose**: Organized settings access
- **Features**:
  - Enhanced SettingsScreen as central dashboard
  - Categorized settings navigation
  - Breadcrumb navigation
- **UI Pattern**: Grid-based layout with navigation cards

### **COULD HAVE** (Nice additions if time permits)

#### 8. Notification Preferences (`NotificationSettingsScreen.tsx`)
- Email notification settings
- In-app notification preferences
- Portfolio alert thresholds

#### 9. Data Export Preferences (`DataSettingsScreen.tsx`)
- Default export formats
- Backup and sync preferences
- API integration settings

#### 10. Usage Statistics Dashboard
- Backtests run over time
- Strategy creation statistics
- Feature usage insights

### **WON'T HAVE** (Future releases)

#### 11. Subscription/Billing Management
- Payment processing (requires backend)
- Plan management
- Usage-based billing

#### 12. Advanced Security Features
- Two-factor authentication
- Security audit logs
- Device management

#### 13. Social Features
- Strategy sharing
- Community features
- Public profiles

## User Journey Flows

### Primary Journey: Profile Access
1. **Entry Point**: User clicks profile avatar/icon in header
2. **Navigation**: Dropdown shows quick options (profile, settings, sign out)
3. **Profile Screen**: Overview with edit options and navigation
4. **Settings**: Organized by category with clear navigation paths

### Secondary Journey: Account Management
1. **Access**: Profile dropdown → Account Settings
2. **Editing**: Inline editing for basic info, dedicated forms for sensitive data
3. **Validation**: Real-time validation with clear error messaging
4. **Feedback**: Success/error messages with auto-dismiss

### Tertiary Journey: Personalization
1. **Trading Setup**: Configure default backtesting parameters
2. **Visual Customization**: Avatar upload and display preferences
3. **Notifications**: Set communication preferences
4. **Data Management**: Configure export and backup settings

## Component Architecture

### State Management
```typescript
// UserContext.tsx
interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  preferences: {
    trading: TradingPreferences;
    notifications: NotificationPreferences;
    display: DisplayPreferences;
  };
  createdAt: string;
  lastLoginAt: string;
}

interface TradingPreferences {
  defaultPortfolioSize: number;
  defaultRiskLevel: number;
  preferredTimeframes: string[];
  defaultBenchmark: string;
  autoSaveInterval: number;
}
```

### Component Hierarchy
```
UserContext (Global State)
├── Header (Updated with ProfileDropdown)
├── UserProfileScreen (Main Dashboard)
├── AccountSettingsScreen (Account Management)
├── TradingPreferencesScreen (Trading Settings)
├── SettingsScreen (Enhanced Hub)
└── Shared Components
    ├── ProfileSection (Layout Wrapper)
    ├── AvatarUpload (Photo Management)
    └── PreferenceToggle (Settings Controls)
```

### Routing Structure
```
/profile - Main profile dashboard
/profile/account - Account settings
/profile/trading - Trading preferences
/profile/notifications - Notification settings (Could Have)
/profile/data - Data management (Could Have)
```

## Technical Implementation

### Styling Approach
- **CSS Variables**: Use existing variables (--accent, --surface, --text-primary)
- **Form Patterns**: Match PortfolioFormModal and WatchlistFormModal styling
- **Layout Patterns**: Follow Dashboard and SettingsScreen layouts
- **Responsive Design**: Touch-friendly controls matching recent improvements

### State Persistence
- **Local Storage**: User preferences and non-sensitive data
- **Session Storage**: Temporary UI state
- **Context API**: Real-time state management
- **Form State**: Controlled components with validation

### Integration Points
- **WatchlistContext**: Trading preferences affect portfolio defaults
- **ThemeContext**: User display preferences
- **FontSizeContext**: Enhanced with more granular controls
- **Existing Forms**: Consistent validation and error handling

## Implementation Timeline

### Phase 1: Foundation (Week 1)
1. **Documentation** (Day 1)
   - Complete user-profile-system.md
   - Component wireframes and specifications

2. **Core Infrastructure** (Days 2-3)
   - UserContext.tsx implementation
   - Header.tsx profile dropdown integration
   - Basic routing setup

3. **Main Dashboard** (Days 4-5)
   - UserProfileScreen.tsx implementation
   - Basic profile editing functionality
   - Navigation to other sections

### Phase 2: Essential Features (Week 2)
4. **Account Management** (Days 1-2)
   - AccountSettingsScreen.tsx implementation
   - Password change functionality
   - Account deletion with confirmation

5. **Trading Preferences** (Days 3-4)
   - TradingPreferencesScreen.tsx implementation
   - Integration with existing systems
   - Default parameter management

6. **Component Library** (Day 5)
   - ProfileSection.tsx wrapper component
   - Basic styling and layout consistency

### Phase 3: Enhancement (Week 3)
7. **Advanced Components** (Days 1-2)
   - AvatarUpload.tsx with crop functionality
   - PreferenceToggle.tsx for settings

8. **Settings Hub** (Days 3-4)
   - Enhanced SettingsScreen.tsx
   - Navigation organization
   - Breadcrumb implementation

9. **Polish & Testing** (Day 5)
   - UI refinements and bug fixes
   - Responsive design verification
   - Integration testing

## Success Metrics

### User Experience
- **Intuitive Navigation**: Users can access profile features without guidance
- **Consistent Design**: Profile screens feel integrated with existing app
- **Mobile Friendly**: Touch-optimized interface works on all devices
- **Fast Performance**: No noticeable lag in profile interactions

### Technical Quality
- **Reusable Components**: Profile components can be used in other contexts
- **Maintainable Code**: Clear separation of concerns and documentation
- **Scalable Architecture**: Easy to add new profile features
- **Integration**: Seamless working with existing systems

### Business Value
- **User Engagement**: Increased time spent in application
- **Personalization**: Users customize app to their workflow
- **Retention**: Profile investment increases user stickiness
- **Foundation**: Platform for future premium features

## Files to Create

### Documentation
- ✅ `docs/user-profile-system.md` - This comprehensive plan

### Core System Files
- `frontend/src/contexts/UserContext.tsx` - User state management
- `frontend/src/components/UserProfileScreen.tsx` - Main dashboard
- `frontend/src/components/AccountSettingsScreen.tsx` - Account management
- `frontend/src/components/TradingPreferencesScreen.tsx` - Trading preferences

### Reusable Components
- `frontend/src/components/ProfileSection.tsx` - Section wrapper
- `frontend/src/components/AvatarUpload.tsx` - Photo upload
- `frontend/src/components/PreferenceToggle.tsx` - Toggle controls

### Enhanced Existing Files
- Update `frontend/src/components/Header.tsx` - Add profile dropdown
- Update `frontend/src/components/SettingsScreen.tsx` - Settings hub
- Update `frontend/src/App.tsx` - Profile screen routing

## Conclusion

This user profile system provides a solid foundation for user account management while maintaining the high-quality design standards of the Backstreet Betas application. The MoSCoW prioritization ensures we deliver essential functionality first while building toward a comprehensive user experience.

The implementation follows established patterns in the codebase, ensuring consistency and maintainability. The modular architecture allows for easy expansion as user needs evolve and new features are required.