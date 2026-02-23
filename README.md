# Order Management System

A full-stack food delivery application built with Go, React, and PostgreSQL.

## Architecture

### Backend
- **Framework**: Go (Gin)
- **Database**: PostgreSQL with GORM
- **Real-time Updates**: WebSockets (Gorilla)
- **Features**:
  - GET /menu: Retrieves all food items
  - POST /orders: Creates a new order and initiates status simulation
  - GET /orders/:id: Retrieves order details
  - WS /ws/order-status: Real-time order status updates

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Features**:
  - Menu Page: Browse items and add to cart
  - Cart Page: Manage quantities and provide delivery details
  - Tracking Dashboard: Real-time progress bar with status updates

## Status Simulation
Orders automatically transition through the following states over a 2-minute interval:
1. Order Received (Initial)
2. Preparing
3. Out for Delivery
4. Delivered

## Setup Instructions

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL

### Backend Setup
1. Navigate to `backend` directory
2. Create `.env` file or export variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
3. Run `go run main.go`

### Frontend Setup
1. Navigate to `frontend` directory
2. Run `npm install`
3. Run `npm run dev`

### Running Tests
- Backend: `go test ./tests/...`
- Frontend: `npm test`
