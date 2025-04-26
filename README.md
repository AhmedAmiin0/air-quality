# Air Quality API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## Overview

REST API for fetching air quality data from IQAir API. Developed as a coding challenge for Yassir.

### Requirements Implemented

✅ REST API with Node.js (NestJS)  
✅ IQAir API integration using nearest_city endpoint  
✅ CRON job monitoring Paris air quality every minute  
✅ MySQL database storage with timestamps  
✅ API documentation with Swagger  
✅ Unit and integration tests

## Installation

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/air-quality.git
cd air-quality
pnpm install
```

2. Configure environment variables in `.env`:
```env
# IQAir API Configuration
IQAIR_API_SECRET=your_iqair_api_secret
IQAIR_BASE_URL=http://api.airvisual.com/v2/
IQAIR_SERVICE_NAME=IQAIR

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=airquality
DB_TYPE=mysql
```

## Usage

### Start the application
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

### Run tests
```bash
pnpm test
```

## API Endpoints

### Get Air Quality by Coordinates
```
GET /api/air-quality?lat=48.856613&lon=2.352222
```

### Get Most Polluted Time in Paris
```
GET /api/air-quality/paris/most-polluted
```

## Documentation

Swagger API documentation: `http://localhost:3000/docs`

## Tech Stack

- NestJS / TypeScript / Express
- TypeORM / MySQL
- IQAir API integration
- @nestjs/schedule for CRON jobs
- Jest for testing
