# Aarya Bathware - E-commerce Platform

This is the official web platform for Aarya Bathware, featuring a product catalog, user authentication, shopping cart, and administrative dashboard.

## 🚀 Getting Started

To get started with the development environment, run:
```bash
npm run dev
```

## 📦 Deployment to GitHub

To deploy this update to your GitHub repository, follow these steps:

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    ```
2.  **Add your files**:
    ```bash
    git add .
    ```
3.  **Commit your changes**:
    ```bash
    git commit -m "Update: Added Chatbot API, rebranded to Aarya Bathware, and updated contact info"
    ```
4.  **Connect to GitHub**:
    Create a new repository on GitHub, then run:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## 🔌 Firebase App Hosting

This project is configured for **Firebase App Hosting**. Once your code is on GitHub:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **App Hosting**.
3. Click **Get Started** and connect your GitHub repository.
4. Firebase will automatically build and deploy your site every time you push to the `main` branch.

## 🔌 Chatbot Integration (API)

We provide a secure API for third-party AI chatbots to fetch product and category data. 

**API Documentation:** For full details on endpoints, authentication, and usage, please refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick Auth Info
- **Header:** `x-api-key`
- **Key:** `AB-v3n0m-XpL0r3-9k21-B4th`

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **UI:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide React
