# Vom Platzl - Backend

Backend API service for the Vom Platzl Chrome extension.

## Overview

This FastAPI-based backend processes search queries and returns nearby local stores using:
- Google Places API for location data

## Prerequisites

- Python 3.8+
- Google Cloud API key (for Places API)

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
Create a `.env` file in the backend directory with:
```
GOOGLE_API_KEY=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key (depreciated)
```

## Running the Server

### Local Development
```bash
cd src
python -m uvicorn api:app --reload
```

The API will be available at `http://localhost:8000`

### Using Docker
```bash
docker-compose up
# or 
docker-compose up --build # to build the local image first (dev)
```

## API Endpoints

### GET `/get_places`

Returns local stores based on search query and location.

**Parameters:**
- `query` (required): Search query (e.g., "winter jacket")
- `lat` (optional): Latitude (defaults to Munich city center)
- `lon` (optional): Longitude (defaults to Munich city center)

**Example:**
```
GET /get_places?query=winter%20jacket&lat=48.1459&lon=11.5750
```

## Project Structure

```
backend/
├── src/
│   ├── api.py              # Main FastAPI application
│   ├── classifier.py       # Query classification logic
│   ├── config.py          # Configuration management
│   ├── services/
│   │   └── google_places.py  # Google Places API integration
│   ├── utils/
│   │   └── geo.py         # Geolocation utilities
│   └── enums/
│       └── StoreTypes.py  # Store type definitions
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```
