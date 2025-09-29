# Carbon Calculator Chrome Extension

> **Status:** Alpha v0.1.0 - Initial development version

Instantly measure the environmental impact of any website you visit. Carbon Calculator analyzes page weight and calculates CO2 emissions in real-time, helping you understand the carbon cost of your web browsing.

## ⚠️ Development Status

This is an early alpha version. Expect:
- Bugs and rough edges
- Limited error handling
- API rate limits on PageSpeed Insights
- Changes to features and UI

Not recommended for production use yet.

## Features

- Real-time carbon footprint analysis for any website
- CO2 emissions per visit displayed in grams
- Annual environmental impact calculation for frequently visited sites
- Green hosting verification using renewable energy data
- Clean, modern interface with visual progress indicators
- Secure backend API to protect API keys

## Tech Stack

**Extension:**
- Vanilla JavaScript
- Vite for bundling
- Chrome Extension Manifest V3

**Backend:**
- Node.js with Express
- Deployed on Railway
- Environment-based configuration


## APIs & Libraries

### APIs Used
- **Google PageSpeed Insights API** - [Get API Key](https://developers.google.com/speed/docs/insights/v5/get-started)
  - Provides website performance metrics and total byte transfer data
  - Free tier: 25,000 requests/day with API key
  
- **Green Web Foundation API** - [Documentation](https://developers.thegreenwebfoundation.org/api/greencheck/v3/)
  - Checks if websites use green hosting
  - Public API, no key required

### Libraries
- **@tgwf/co2** - [GitHub](https://github.com/thegreenwebfoundation/co2.js)
  - Carbon emissions calculation using the OneByte model
  - Converts data transfer to CO2 estimates

### Assets
- Rotating Earth GIF - [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rotating_earth_animated_transparent.gif)
  - Public domain, NASA Goddard Space Flight Center

## License
MIT

## Setup

### Prerequisites
- Node.js v18+
- Google PageSpeed Insights API key
- Chrome browser

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PAGESPEED_API_KEY=your_key_here" > .env

# Run locally
node server.js