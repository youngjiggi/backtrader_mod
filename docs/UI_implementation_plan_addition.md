# UI Implementation Plan V2: Agentic Notification-Driven Evolution
## Backtesting MVP Frontend Development - Enhanced with Agentic Drone System and FSD-Optimized Review

---

### 1. Introduction

This UI Development Plan V2 extends the original backtesting MVP to incorporate an agentic, notification-driven system. It transforms the manual backtesting platform into a proactive system where strategies act as autonomous "drones" or "probes" scanning markets for trading setups. Core value: Shift from manual strategy creation/testing to background scanning → notifications → quick FSD review → execution, reducing manual work by 70-80% while maintaining desktop strategy creation capabilities. MVP focus: 3 new major screens/components integrated into existing flows, leveraging 70-80% of current codebase (ReportScreen for observations, Modal system for reviews, existing contexts for state management).

**Key Evolution:** Original journey (Login → Dashboard → New Run → Report) expands to include (Dashboard → Deploy Drones → Background Scanning → Notification Feed → Quick FSD Review → Execute/Inspect), enabling "set-it-and-forget-it" trading assistance.

---

### 2. FSD Design Principles & Constraints

#### Tesla FSD Screen Layout Considerations
- **Left Side Reserved:** Car animation occupies true left; app's "left panel" starts at screen center
- **Accessible Controls:** Left panel (app center) for primary controls, voice toggle, quick actions
- **Visual Content:** Right panel for scrollable notifications, charts, minimal interaction
- **Gesture Priority:** Swipe left (chat), swipe right (observation), tap (expand), vertical scroll
- **No Small Targets:** Avoid tiny X buttons; use swipe-to-close for modals and panels

#### Voice-First Design
- **Auto-Read:** Notifications read aloud on arrival or when selected
- **Voice Commands:** "Execute," "Dismiss," "Show chart," "Next notification"
- **Hands-Free Priority:** All primary functions accessible via voice during driving
- **Web Speech API Integration:** Speech-to-text for questions, text-to-speech for responses

#### Accessibility & Safety
- **Minimal Taps:** Primary actions via swipe gestures or voice
- **Large Touch Targets:** Buttons minimum 44px for driver accessibility
- **High Contrast:** Clear visual hierarchy for quick scanning
- **Progressive Disclosure:** Summary → Details → Deep dive flow

---

### 3. Updated User Journey & Wireframe

### Primary Flow (FSD-Optimized)
1. **Setup Phase (Desktop/Manual):** Dashboard → StrategyLibrary → "Deploy as Drone" → Set scan parameters
2. **Monitoring Phase:** Dashboard shows drone status badge (e.g., "5 Active Drones")
3. **Notification Receipt:** Real-time alerts arrive in background
4. **FSD Review Phase:** Enter FSD Mode → Notification Feed → Voice/swipe review
5. **Action Phase:** Execute trade or save for later via voice/gesture
6. **Deep Inspection (Optional):** Full observation mode with charts and indicators

### Secondary Flow (Management)
Dashboard → Hamburger Menu → "Fleet Manager" → Drone oversight and deployment

### Wireframe Structure
```
[Hamburger Menu] [Dashboard Header] [Voice Toggle]
[Left Panel - Controls]    [Right Panel - Notifications/Visuals]
- Quick Filters            - Scrollable notification cards
- Voice Commands           - Mini-chart thumbnails  
- Action Buttons           - Swipe actions (L: Chat, R: Observe)
```

---

### 4. New Screens & Components Implementation

#### a) Notification Feed Screen (New Primary Screen - High Priority)

**Access Point:** Dashboard hero card ("Enter FSD Mode") or Hamburger Menu → "Agent Reports"

**Layout Structure:**
- **Header (Fixed):**
  - Title: "Drone Notifications" with active count badge
  - Global voice toggle (microphone icon)
  - Filter button (opens FilterModal)
  - Search input (voice-enabled)

- **Left Panel (30% width - Control Zone):**
  - **Quick Filters Section:**
    - Confidence slider (80%+ filter)
    - Symbol filter dropdown
    - Drone/strategy filter
    - Time range (Last hour, Today, Week)
  - **Voice Commands Section:**
    - "Read Next" button
    - "Clear All" button  
    - Voice status indicator
  - **Action Buttons:**
    - "Execute Selected" (batch action)
    - "Mark All Read"

- **Right Panel (70% width - Visual Zone):**
  - **Notification Cards (Vertical Scroll):**
    - Card Structure:
      ```
      [Mini Chart] [AAPL] [Stage 2 Breakout] [85% Confidence]
      [Strategy: ATR+CVD v1.2] [2 min ago] [Mega Cap]
      ```
    - **Swipe Actions:**
      - Swipe Left: Enter Chat Mode with agent
      - Swipe Right: Enter Observation Mode (deep dive)
      - Tap: Expand card for summary details
    - **Visual Indicators:**
      - Confidence color coding (Green 80%+, Yellow 60-80%, Red <60%)
      - Strategy icon/badge
      - Urgency indicator (time-sensitive setups)

**Features:**
- Real-time WebSocket updates for new notifications
- Voice synthesis for reading notifications aloud
- Gesture-based navigation optimized for driving
- Infinite scroll with performance optimization
- Filter persistence via localStorage

**Component Reuse:**
- Build on `RecentRunsCarousel` structure for card layout
- Extend `FilterModal` for notification filtering
- Integrate `ViewToggle` pattern for display modes
- Use existing `SearchInput` components with voice enhancement

---

#### b) Drone Review Modal (New Modal Component - High Priority)

**Trigger:** Swipe right on notification card or tap for deep dive

**Design Pattern:** Slides from right-to-left (swipe right to close, no X button for safety)

**Layout Structure:**
- **Header (Minimal):**
  - Voice summary button (auto-play icon)
  - Quick action bar: [Execute] [Dismiss] [Save] [Chat]
  - Confidence badge and timestamp

- **Content Sections:**
  - **Summary Section (Top):**
    ```
    AAPL: Stage 2 Breakout Setup
    Mega Cap | High Volume | 85% Confidence
    Strategy: ATR+CVD Multi-timeframe v1.2
    ```
    
  - **Chart Preview (Middle):**
    - Reuse `StageAnalysisChart` with indicators overlay
    - Show volume bars, CVD signals, ATR lines
    - Strategy entry/exit markers
    - Timeframe toggle (1D/4H/1H views)
    
  - **Context Details (Bottom):**
    - Company information (market cap, sector, volume)
    - Setup rationale ("ATR expansion + CVD confirmation")
    - Risk metrics (stop loss, position sizing suggestions)
    - Recent performance of this strategy setup type

- **Voice Integration:**
  - Auto-read summary on modal open
  - Voice commands: "Show chart," "Execute trade," "Why this setup?"
  - Speech-to-text for questions/queries

- **Actions:**
  - Execute: Integration with broker API (confirmation required)
  - Dismiss: Remove from feed, log decision
  - Save: Add to watchlist or manual review queue
  - Chat: Open conversation with reasoning agent

**Component Reuse:**
- Extend existing `Modal.tsx` with swipe-close capability
- Embed `ReportScreen` chart components
- Use `PerformanceMetrics` for risk display
- Integrate `StageAnalysisChart` and `WeinsteinLegend`

---

#### c) Fleet Manager Screen (New Secondary Screen - Medium Priority)

**Access:** Hamburger Menu → "Fleet Manager" or Dashboard → "Manage Drones"

**Purpose:** Deploy, monitor, and manage autonomous scanning drones

**Layout Structure:**
- **Header:**
  - Title: "Drone Fleet" with total active count
  - [+ Deploy New Drone] button (primary action)
  - Status overview widget (running/paused/stopped counts)

- **Main Content:**
  - **Active Drones List:**
    ```
    [Status] [Strategy Name] [Symbols] [Last Scan] [Setups Found] [Actions]
    🟢 ATR+CVD Classic | AAPL,TSLA,NVDA | 2m ago | 3 today | [⏸️][⚙️][🗑️]
    ⏸️ Momentum Reversal | Growth ETFs | 1h ago | 0 today | [▶️][⚙️][🗑️]
    ```
    
  - **Deployment Form (Modal):**
    - Strategy selection (dropdown from StrategyLibrary)
    - Symbol configuration (watchlist integration)
    - Scan frequency (15m, 1h, 4h, daily)
    - Confidence thresholds (minimum % to notify)
    - Notification preferences (immediate, batch, digest)

- **Performance Overview:**
  - Aggregate metrics: "Total setups today: 15"
  - Success rate tracking per drone
  - Resource usage monitoring

**Features:**
- Real-time status updates for each drone
- Bulk operations (pause all, resume selected)
- Performance analytics per strategy
- Integration with notification settings
- Export drone configurations

**Component Reuse:**
- Build similar to `StrategyLibrary` with list/table view
- Reuse `StrategyFormModal` for deployment
- Integrate `NewBacktestModal` patterns for configuration
- Use existing `MetricsCards` for performance display

---

### 5. Updates to Existing Screens

#### Dashboard Enhancements
- **Hero Section Addition:**
  - New card: "Enter FSD Mode" → Direct link to Notification Feed
  - Placement: Next to existing "Start New Backtest" card
  - Visual: Car/driving icon with notification badge

- **Status Widget:**
  - Drone fleet summary (e.g., "5 Active Drones, 3 Notifications")
  - Quick access to Fleet Manager
  - Recent notification preview (last 2-3 alerts)

#### Strategy Library & Report Screen
- **"Deploy as Drone" Integration:**
  - Button added to successful strategies in StrategyLibrary
  - Available on ReportScreen for strategies that meet performance criteria
  - Quick deployment with pre-filled parameters based on backtest results

#### Settings Screens Extension
- **NotificationSettingsScreen Updates:**
  - Drone-specific preferences section
  - FSD voice settings (reading speed, auto-play)
  - Confidence threshold defaults
  - Notification batching options (immediate vs digest)

- **New FSD Settings Section:**
  - Voice command sensitivity
  - Gesture preferences
  - Safety mode toggles
  - Integration with car systems (future)

#### Navigation & Global Updates
- **Header Enhancements:**
  - Global voice toggle (microphone icon)
  - Notification badge with count
  - Quick access to FSD mode

- **Modal System:**
  - All modals support swipe-to-close
  - Voice navigation integration
  - Consistent gesture patterns

---

### 6. Technical Implementation Requirements

#### Voice Integration
- **Web Speech API Implementation:**
  - SpeechSynthesis for text-to-speech
  - SpeechRecognition for voice commands
  - Fallback for unsupported browsers
  - Voice command mapping and processing

#### Gesture System
- **React Swipeable Integration:**
  - Left/right swipe detection
  - Touch threshold configuration
  - Gesture feedback (haptic where supported)
  - Accessibility considerations

#### Real-Time Updates
- **WebSocket/Firebase Integration:**
  - Live notification delivery
  - Connection state management
  - Offline queue for missed notifications
  - Background sync capabilities

#### Performance Optimization
- **Large Dataset Handling:**
  - Virtual scrolling for notification feeds
  - Lazy loading of chart components
  - Memory management for real-time updates
  - Progressive image loading

---

### 7. Component Hierarchy & Architecture

```
NotificationFeedScreen
├── NotificationHeader
├── ControlPanel (Left)
│   ├── FilterSection
│   ├── VoiceCommandSection
│   └── ActionButtons
└── NotificationPanel (Right)
    ├── NotificationCard (Swipeable)
    │   ├── MiniChart (StageAnalysisChart)
    │   ├── NotificationSummary
    │   └── SwipeActions
    └── InfiniteScroll

DroneReviewModal (Extends Modal)
├── ReviewHeader
├── SummarySection
├── ChartPreview (ReportScreen components)
├── ContextDetails
└── VoiceInterface

FleetManagerScreen
├── FleetHeader
├── DroneList
│   └── DroneListItem
├── DeploymentModal (StrategyFormModal)
└── PerformanceOverview (MetricsCards)
```

---

### 8. Development Phases & Priority

#### Phase 1: Foundation (Week 1-2)
- Create NotificationFeedScreen basic layout
- Implement voice toggle and basic speech synthesis
- Add hero card to Dashboard
- Create mock notification data structure

#### Phase 2: Core Functionality (Week 2-3)
- Build DroneReviewModal with swipe gestures
- Implement notification filtering and search
- Add voice command processing
- Create FleetManagerScreen basic version

#### Phase 3: Integration (Week 3-4)
- Connect to backend notification system
- Implement real-time updates
- Add gesture system across all components
- Integrate with existing strategy system

#### Phase 4: Polish & Optimization (Week 4-5)
- Performance optimization for large datasets
- Voice system refinement
- FSD-specific UX testing
- Accessibility improvements

---

### 🔄 UI Flow Summary V2

```
A[Dashboard] --> B[Enter FSD Mode] --> C[Notification Feed]
A --> D[Strategy Library] --> E[Deploy as Drone] --> F[Fleet Manager]
C --> G[Notification Card] --> H[Swipe Left: Chat] OR I[Swipe Right: Observe]
I --> J[Execute Trade] OR K[Dismiss] OR L[Save for Later]
H --> M[Voice Q&A] --> I[Observation Mode]
F --> N[Manage Drones] --> O[Deploy New] --> P[Back to Feed]
```

---

### 9. Success Metrics & Testing

#### User Experience Metrics
- Time from notification to action (target: <10 seconds)
- Voice command success rate (target: >90%)
- FSD interaction completion rate
- User preference: notification vs manual creation ratio

#### Technical Performance
- Notification delivery latency (<2 seconds)
- Chart rendering performance (<1 second)
- Voice processing accuracy
- Battery/resource impact during FSD use

#### Safety & Usability
- Driving distraction assessment
- Voice system effectiveness during road noise
- Gesture accuracy while driving
- Emergency interaction patterns

---

This V2 implementation plan evolves the existing backtesting MVP into a proactive, agentic system optimized for FSD use while maintaining all existing manual capabilities for desktop strategy creation and analysis.
