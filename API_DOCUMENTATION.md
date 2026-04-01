# Aarya Bathware - External Chatbot API Documentation

Welcome to the Aarya Bathware API. This documentation is intended for third-party developers building AI chatbots or integrations that need to access our product and category data.

## 🔑 Authentication

All requests to the API must include a security header for authentication. Requests without this header or with an incorrect value will receive a `401 Unauthorized` response.

*   **Header Name:** `x-api-key`
*   **API Key:** `AB-v3n0m-XpL0r3-9k21-B4th`

> **Note:** This is the default key. For security, it can be overridden in production using the `CHATBOT_API_KEY` environment variable.

---

## 📡 Endpoints

### 1. List Products (Advanced)
`GET /api/products`

Fetches a list of products with support for filtering, search, and pagination.

**Query Parameters:**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `q` | `string` | Search term. Matches against product name (English and Sinhala). |
| `category_id` | `string` | Filter by a specific category ID. |
| `is_featured` | `boolean` | `true` to get only home-page featured items, `false` for others. |
| `limit` | `number` | Number of items to return (Default: 50). |
| `offset` | `number` | Number of items to skip for pagination (Default: 0). |

**Sample Response:**
```json
{
  "success": true,
  "pagination": { "total": 120, "limit": 5, "offset": 0, "count": 5 },
  "data": [
    {
      "id": "prod_123",
      "name": "Luxury Black Faucet",
      "name_sinhala": "සුඛෝපභෝගී කළු කරාමය",
      "price": 8500.00,
      "discount_price": 7500.00,
      "quantity": 15,
      "category_id": "cat_456",
      "image_url": "https://...",
      "is_featured": true
    }
  ]
}
```

---

### 2. Get Single Product
`GET /api/products/[productId]`

Fetches full details for a specific product, including descriptions and additional images.

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Luxury Black Faucet",
    "description": "Premium matte finish...",
    "additional_images": ["https://img1.jpg", "https://img2.jpg"],
    ...
  }
}
```

---

### 3. List Categories
`GET /api/categories`

Fetches all available product categories. Use the `id` from this response to filter products by category.

**Sample Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    { "id": "cat_456", "name": "Bathroom Fittings" },
    { "id": "cat_789", "name": "Kitchen Sinks" }
  ]
}
```

---

## 🛠️ Usage Example (Node.js/Fetch)

```javascript
const response = await fetch('https://your-domain.lk/api/products?q=faucet', {
  headers: {
    'x-api-key': 'AB-v3n0m-XpL0r3-9k21-B4th'
  }
});
const data = await response.json();
console.log(data);
```

## 🆘 Support
For technical issues or changes to the API key, please contact the site administrator.
