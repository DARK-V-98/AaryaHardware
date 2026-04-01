# Aarya Bathware - E-commerce Platform

This is the official web platform for Aarya Bathware, featuring a product catalog, user authentication, shopping cart, and administrative dashboard.

## 🚀 Getting Started

To get started with the development environment, run:
```bash
npm run dev
```

## 🔌 External Chatbot API

We provide a secure API for third-party AI chatbots to fetch product and category data.

### Authentication
All requests must include the following HTTP header:
- `x-api-key`: Your secret API key.

**Default API Key:** `aarya-bathware-chatbot-key-2025`

> ⚠️ **Security Tip:** To change this key, set the `CHATBOT_API_KEY` environment variable in your Firebase App Hosting or deployment settings.

### Endpoints

#### 1. List Products
`GET /api/products`

**Query Parameters:**
- `q`: Search term (matches name or Sinhala name).
- `category_id`: Filter by specific category ID.
- `is_featured`: `true` or `false`.
- `limit`: Number of results (default 50).
- `offset`: For pagination.

#### 2. Get Single Product
`GET /api/products/[productId]`

#### 3. List Categories
`GET /api/categories`

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **UI:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide React
