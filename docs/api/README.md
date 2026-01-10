# MYGlamBeauty API Documentation

## Overview

The MYGlamBeauty API is a RESTful API that provides access to all backend functionality for the beauty salon management system. Built with Express.js and TypeScript, it offers secure, scalable, and well-documented endpoints for all operations.

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://api.myglambeauty.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per minute
- **Upload endpoints**: 2 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Error Handling

The API returns standard HTTP status codes and error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error"
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "ADMIN|SUPER_ADMIN"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "ADMIN|SUPER_ADMIN"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer <token>
```

**Response:**
```json
{
  "token": "new-jwt-token"
}
```

### Bookings

#### Get All Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`PENDING`, `CONFIRMED`, `CANCELLED`)
- `startDate` (optional): Filter by start date (ISO string)
- `endDate` (optional): Filter by end date (ISO string)
- `limit` (optional): Number of results to return
- `offset` (optional): Number of results to skip

**Response:**
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string",
    "phone": "string",
    "scheduledFor": "2024-01-15T10:00:00Z",
    "service": "string",
    "status": "PENDING|CONFIRMED|CANCELLED",
    "notes": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "phone": "string",
  "scheduledFor": "2024-01-15T10:00:00Z",
  "service": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "scheduledFor": "2024-01-15T10:00:00Z",
  "service": "string",
  "status": "PENDING",
  "notes": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Get Booking by ID
```http
GET /api/bookings/{id}
Authorization: Bearer <token>
```

#### Update Booking
```http
PUT /api/bookings/{id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Updated notes"
}
```

#### Delete Booking
```http
DELETE /api/bookings/{id}
Authorization: Bearer <token>
```

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `featured` (optional): Filter by featured status
- `inStock` (optional): Filter by stock status
- `limit` (optional): Number of results to return
- `offset` (optional): Number of results to skip

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "priceCents": 2999,
    "currency": "usd",
    "category": "string",
    "isActive": true,
    "stock": 10,
    "sku": "string",
    "mainImageUrl": "string",
    "galleryImages": [
      {
        "id": "string",
        "url": "string",
        "alt": "string",
        "sortOrder": 0
      }
    ],
    "tags": ["string"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "priceCents": 2999,
  "category": "string",
  "isActive": true,
  "stock": 10,
  "sku": "string",
  "mainImageUrl": "string",
  "tags": ["string"]
}
```

#### Get Product by ID
```http
GET /api/products/{id}
```

#### Update Product
```http
PUT /api/products/{id}
Authorization: Bearer <token>
```

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer <token>
```

### Customers

#### Get All Customers
```http
GET /api/customers
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "newsletterOptIn": true,
    "marketingTags": ["string"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Customer
```http
POST /api/customers
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "newsletterOptIn": true,
  "marketingTags": ["string"]
}
```

#### Get Customer by ID
```http
GET /api/customers/{id}
Authorization: Bearer <token>
```

#### Update Customer
```http
PUT /api/customers/{id}
Authorization: Bearer <token>
```

#### Delete Customer
```http
DELETE /api/customers/{id}
Authorization: Bearer <token>
```

### Orders

#### Get All Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "orderNumber": 1234,
    "status": "PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
    "totalCents": 2999,
    "currency": "usd",
    "customer": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    },
    "items": [
      {
        "id": "string",
        "product": {
          "id": "string",
          "name": "string",
          "slug": "string"
        },
        "quantity": 1,
        "priceCents": 2999
      }
    ],
    "shippingAddress": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": 1
    }
  ],
  "customerEmail": "string",
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

### Analytics

#### Get Comprehensive Metrics
```http
GET /api/analytics/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "revenue": {
    "total": 100000,
    "monthly": 25000,
    "weekly": 5000,
    "daily": 1000,
    "growth": {
      "monthly": 15.5,
      "weekly": 8.2
    }
  },
  "bookings": {
    "total": 500,
    "monthly": 100,
    "weekly": 25,
    "conversionRate": 85.5
  },
  "customers": {
    "total": 1000,
    "newThisMonth": 50,
    "retentionRate": 92.5
  },
  "products": {
    "total": 50,
    "topSelling": [
      {
        "id": "string",
        "name": "string",
        "sales": 100
      }
    ]
  }
}
```

#### Get Real-time Metrics
```http
GET /api/analytics/realtime
Authorization: Bearer <token>
```

**Response:**
```json
{
  "activeUsers": 25,
  "pendingBookings": 5,
  "recentOrders": 3,
  "serverLoad": 45.2,
  "responseTime": 150
}
```

### Notifications

#### Send Booking Confirmation
```http
POST /api/notifications/booking-confirmation
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookingId": "string",
  "customerEmail": "string"
}
```

#### Send Payment Confirmation
```http
POST /api/notifications/payment-confirmation
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "string",
  "customerEmail": "string",
  "amount": 2999
}
```

### Health Checks

#### Basic Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Detailed Health Check
```http
GET /health/detailed
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 86400,
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 5
    },
    "cache": {
      "status": "healthy",
      "responseTime": 2
    },
    "stripe": {
      "status": "healthy",
      "responseTime": 100
    }
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @myglambeauty/api-client
```

```typescript
import { MyGlamBeautyAPI } from '@myglambeauty/api-client';

const api = new MyGlamBeautyAPI({
  baseURL: 'https://api.myglambeauty.com',
  token: 'your-jwt-token'
});

// Get all products
const products = await api.products.getAll();

// Create a booking
const booking = await api.bookings.create({
  email: 'customer@example.com',
  name: 'Jane Doe',
  phone: '+1234567890',
  scheduledFor: '2024-01-15T10:00:00Z',
  service: 'Hair Styling'
});
```

### Python
```bash
pip install myglambeauty-python
```

```python
from myglambeauty import MyGlamBeautyAPI

api = MyGlamBeautyAPI(
    base_url='https://api.myglambeauty.com',
    token='your-jwt-token'
)

# Get all products
products = api.products.get_all()

# Create a booking
booking = api.bookings.create({
    'email': 'customer@example.com',
    'name': 'Jane Doe',
    'phone': '+1234567890',
    'scheduled_for': '2024-01-15T10:00:00Z',
    'service': 'Hair Styling'
})
```

## Webhooks

The API supports webhooks for real-time notifications:

### Configure Webhooks

```http
POST /api/webhooks/configure
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks",
  "events": [
    "booking.created",
    "booking.updated",
    "order.created",
    "payment.completed"
  ],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

#### Booking Created
```json
{
  "event": "booking.created",
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "service": "string",
    "scheduledFor": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Order Created
```json
{
  "event": "order.created",
  "data": {
    "id": "string",
    "orderNumber": 1234,
    "totalCents": 2999,
    "customerEmail": "string"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 1 minute |
| General | 100 requests | 15 minutes |
| Upload | 2 requests | 1 minute |
| Analytics | 50 requests | 15 minutes |

## Support

- **Documentation**: [https://docs.myglambeauty.com/api](https://docs.myglambeauty.com/api)
- **Status Page**: [https://status.myglambeauty.com](https://status.myglambeauty.com)
- **Support Email**: api-support@myglambeauty.com
- **GitHub Issues**: [https://github.com/myglambeauty/api/issues](https://github.com/myglambeauty/api/issues)

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Authentication endpoints
- Booking management
- Product catalog
- Order processing
- Analytics dashboard
- Notification system

### v1.1.0 (2024-02-01)
- Added advanced analytics
- Improved rate limiting
- Webhook support
- Performance optimizations

### v1.2.0 (2024-03-01)
- Added customer management
- Enhanced search capabilities
- Bulk operations
- Improved error handling
