# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server with hot reload
- **Build**: `npm run build` - Compiles TypeScript and builds production bundle with Vite
- **Lint**: `npm run lint` - Runs ESLint on all TypeScript/TSX files
- **Preview**: `npm run preview` - Serves production build locally for testing

## Project Architecture

This is a React + TypeScript weather application built with Vite and styled with TailwindCSS.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite with TypeScript compilation
- **Styling**: TailwindCSS v4 with Vite integration
- **API**: OpenWeatherMap API for weather data
- **Environment**: Uses dotenv for environment variables

### Component Structure
- `App.tsx` - Root component that renders SearchBox
- `SearchBox.tsx` - Main component handling weather search and geolocation:
  - Manages user input for city searches
  - Handles geolocation API for current position
  - Fetches weather data from OpenWeatherMap API
  - Supports both current weather and 5-day forecast
- `WeatherCard.tsx` - Displays weather data (temperature, humidity, wind, precipitation)

### Type Definitions (`types.ts`)
- `Forecast` - Parameters for API requests (coordinates, city, forecast flag)
- `ForecastData` - OpenWeatherMap API response structure
- `WeatherDataProps` - Props for WeatherCard component

### API Integration
- Uses OpenWeatherMap API with environment variable `VITE_OPENWEATHER_API`
- Supports both coordinate-based and city-based weather queries
- Handles both current weather and 5-day forecast endpoints
- Russian language localization for weather descriptions

### Configuration Notes
- ESLint configured with TypeScript, React hooks, and React refresh rules
- TailwindCSS integrated via Vite plugin
- TypeScript strict mode with separate app and node configurations
- Environment variables prefixed with `VITE_` for client-side access

## User Preferences

### English Feedback Rule
- The user is a Russian full-stack web developer who wants to learn English and pass the TOEFL exam. They frequently use AI and want every prompt they write in English to be checked for grammar, punctuation, syntax, and naturalness. If the prompt can be improved, they expect a more native-like version to be suggested. If everything is correct and sounds natural, no changes should be suggested. After each prompt, they expect feedback and corrections
- If the user types 'wae' in a separate prompt, it is an abbreviation for 'what about my English' and means they need feedback on their English. 