# Canteen Management System – Microservices

A full-stack canteen management system built using Java Spring Boot microservices, React, MySQL and RabbitMQ. The system allows users to register, log in, view available food items, place orders and track their orders. An admin dashboard provides order-status management and complete menu management.

## Features

### User Features

* User registration and login
* View available food items
* Place food orders
* View personal order history
* Track order status
* Receive order notifications

### Admin Features

* View all customer orders
* Update order status
* Add new food items
* Edit existing food items
* Delete food items
* Enable or disable food availability
* Refresh orders and menu data

### Microservices Features

* Independent Spring Boot services
* REST API communication between services
* MySQL database persistence
* RabbitMQ event-driven communication
* Service-level validation and exception handling
* Separation of user, menu, order and notification responsibilities

## System Architecture

```text
                    React + Vite Frontend
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
    User Service        Menu Service       Order Service
      :8081                :8082              :8083
          |                  |                  |
        MySQL              MySQL              MySQL
                                               |
                                               v
                                          RabbitMQ
                                               |
                                               v
                                    Notification Service
                                           :8084
                                               |
                                             MySQL
```

## Microservices

### 1. User Service

Port: `8081`

Responsibilities:

* User registration
* User authentication
* User information retrieval

Main endpoints:

```text
POST /api/users/register
POST /api/users/login
GET  /api/users
GET  /api/users/{id}
```

### 2. Menu Service

Port: `8082`

Responsibilities:

* Create food items
* Retrieve food items
* Update food items
* Delete food items
* Manage food availability

Main endpoints:

```text
POST   /api/menu/items
GET    /api/menu/items
GET    /api/menu/items/{id}
PUT    /api/menu/items/{id}
DELETE /api/menu/items/{id}
```

### 3. Order Service

Port: `8083`

Responsibilities:

* Create orders
* Validate users and food items
* Calculate order totals
* Retrieve orders
* Retrieve orders for a specific user
* Update order status
* Publish order events through RabbitMQ

Main endpoints:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
GET  /api/orders/user/{userId}
PUT  /api/orders/{id}/status
```

### 4. Notification Service

Port: `8084`

Responsibilities:

* Listen for order events from RabbitMQ
* Process order-created events
* Process order-status-updated events
* Store and expose notifications

## Event-Driven Communication

RabbitMQ is used to decouple the Order Service and Notification Service.

The Order Service publishes events such as:

```text
order.created
order.status.updated
```

The Notification Service consumes these events and generates notifications for users.

This prevents the Order Service from being directly dependent on the notification-processing logic.

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* Axios
* HTML
* CSS

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Jakarta Validation
* Maven

### Database

* MySQL

### Messaging

* RabbitMQ

### Development Tools

* IntelliJ IDEA
* Visual Studio Code
* Postman
* Git
* GitHub

## Project Structure

```text
canteen-microservices/
│
├── user-service/
│   └── src/
│
├── menu-service/
│   └── src/
│
├── order-service/
│   └── src/
│
├── notification-service/
│   └── src/
│
├── canteen-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## How to Run

### Prerequisites

Install:

* Java 21
* Maven
* Node.js
* npm
* MySQL
* RabbitMQ

### Start Backend Services

Run each Spring Boot service separately:

```text
User Service        → http://localhost:8081
Menu Service        → http://localhost:8082
Order Service       → http://localhost:8083
Notification Service → http://localhost:8084
```

### Start Frontend

Navigate to the frontend:

```bash
cd canteen-frontend
npm install
npm run dev
```

The frontend runs using Vite.

## Order Workflow

```text
User logs in
     |
     v
View menu
     |
     v
Select food + quantity
     |
     v
Order Service
     |
     +----> Verify User Service
     |
     +----> Verify Menu Service
     |
     v
Save Order in MySQL
     |
     v
Publish RabbitMQ Event
     |
     v
Notification Service
     |
     v
Store Notification
```

## Order Status

Orders can move through the following states:

```text
PLACED
   ↓
PREPARING
   ↓
READY
   ↓
COMPLETED
```

An order can also be:

```text
CANCELLED
```

## Validation and Error Handling

The system includes validation for:

* Required user information
* Valid email addresses
* Required food information
* Valid food prices
* Valid order quantities
* Existing users
* Available food items

Example error response:

```json
{
  "status": 404,
  "error": "USER_NOT_FOUND",
  "message": "User with ID 96 was not found"
}
```

## Future Enhancements

* JWT-based authentication and authorization
* Role-based access control
* Docker Compose deployment
* API Gateway
* Service discovery
* Payment integration
* Improved notification persistence
* Cloud deployment
* Automated testing and CI/CD

## Author

Abishree S N

B.E. Computer Science and Engineering

Anna University – MIT Campus
