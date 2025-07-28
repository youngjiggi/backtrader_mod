# BackstreetBoys Frontend

A minimal and lean React frontend for the backtesting platform with dark/light theme support.

## Features

- 🌙 **Dark/Light Mode**: Toggle between themes with cyan/glacier blue accent system
- 📊 **Dashboard**: Scannable overview with collapsible sections
- 📈 **Metrics Cards**: Portfolio overview with glacier blue highlights  
- 🔄 **Progressive Disclosure**: Expandable sections for detailed views
- 📱 **Responsive Design**: Mobile-first approach with collapsible UI
- ⚡ **Fast Setup**: Multi-step modal for new backtests

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard page
│   ├── Header.tsx            # App header with search
│   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── MetricsCards.tsx      # Summary metrics grid
│   ├── CollapsibleSection.tsx # Expandable sections
│   ├── Modal.tsx             # Modal wrapper
│   └── NewBacktestModal.tsx  # Multi-step backtest form
├── contexts/
│   └── ThemeContext.tsx      # Theme state management
├── App.tsx                   # Root component
├── main.tsx                  # App entry point
└── index.css                 # Global styles with CSS variables
```

## Color System

### Dark Mode (Default)
- Background: Deep charcoal (#0a0a0b)
- Accent: Cyan (#00d4ff)  
- Highlight: Glacier blue (#87ceeb)

### Light Mode
- Background: Pure white (#ffffff)
- Accent: Cyan (#0099cc)
- Highlight: Glacier blue (#4682b4)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **CSS Custom Properties** for theming