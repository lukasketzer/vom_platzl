# Vom Platzl - Browser Extension

A Chrome extension that helps users discover local stores while searching on Google. When shopping intent is detected in search queries, the extension overlays local store suggestions to encourage local purchasing over online shopping.

## About

This extension is part of the **Vom Platzl** project (Hackatum 2025) - an initiative to support local businesses and create awareness about nearby shopping alternatives. Instead of building another app, we integrate directly into users' everyday browsing experience on Google Search.

## Features

- **Smart Detection**: Automatically identifies shopping-related Google searches
- **Location-Based**: Shows nearby local stores based on user location
- **Non-Intrusive UI**: Seamlessly integrates with Google's search interface
- **Store Information**: Displays store details including address, opening hours, and contact info
- **Fast & Lightweight**: Built with performance in mind

## Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Next-gen web extension framework
- **UI Library**: React 19 with TypeScript
- **Styling**: CSS Modules
- **Build Tool**: Vite (via WXT)
- **Target**: Chromium-based browsers (Chrome, Edge, etc.) and Firefox

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Mode

```bash
# Chrome/Edge
npm run dev

# Firefox
npm run dev:firefox
```

This will:
1. Start WXT in development mode
2. Watch for file changes
3. Auto-reload the extension

### Building for Production

```bash
# Chrome/Edge
npm run build

# Firefox
npm run build:firefox
```

### Creating Distribution Package

```bash
# Chrome/Edge
npm run zip

# Firefox
npm run zip:firefox
```

## Project Structure

```
extension_react/
├── entrypoints/
│   ├── background.ts      # Background service worker
│   ├── content.tsx        # Main content script
│   └── styling.css        # Global styles
├── components/
│   ├── StickyHeader.tsx   # Header component
│   ├── StoreCard.tsx      # Individual store display
│   └── HeroSection/       # Main overlay section
├── utils/
│   ├── config.ts          # Configuration
│   ├── helpers.ts         # Utility functions
│   ├── location.ts        # Geolocation handling
│   └── styles.ts          # Style utilities
└── public/
    └── icon/              # Extension icons
```

## Permissions

The extension requires:
- `storage`: To save user preferences
- `activeTab`: To interact with Google search pages
- `scripting`: To inject the UI overlay
- Host permissions for Google.com, API endpoints, and geolocation services


