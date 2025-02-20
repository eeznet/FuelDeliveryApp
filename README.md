# Fuel Delivery Web Application

A full-stack web application for managing fuel deliveries.

## Features

- User Authentication (Admin, Owner, Client, Driver)
- Order Management
- Real-time Delivery Tracking
- Invoice Generation
- User Management

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Databases: MongoDB, PostgreSQL
- Deployment: Render

## Live URLs

- Frontend: https://fueldeliveryapp-1.onrender.com
- Backend: https://fuel-delivery-backend.onrender.com

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth Routes
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### User Routes
- GET /api/user/profile
- PUT /api/user/profile

### Invoice Routes
- POST /api/invoice
- GET /api/invoice/client
