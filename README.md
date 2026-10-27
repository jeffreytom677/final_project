# 🍳 CulinaryCraft — Production MERN Stack Recipe Book

A modern, responsive, production-quality Recipe Book web application built with the **MERN Stack** (MongoDB Atlas, Express.js, React, Node.js).

---

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Environment Configuration & MongoDB Atlas Setup](#environment-configuration--mongodb-atlas-setup)
4. [Quick Start & Installation](#quick-start--installation)
5. [Backend API Reference](#backend-api-reference)
6. [Frontend Features & Architecture](#frontend-features--architecture)
7. [Running End-to-End](#running-end-to-end)

---

## 🌟 Project Overview
- **Backend**: Node.js & Express REST API with Mongoose ORM, structured route/controller architecture, input validation on both Mongoose and route levels, centralized error handling, and auto-seeding.
- **Frontend**: React (Vite), React Router v6, Axios, Lucide Icons, clean modern CSS design system with custom theme variables, responsive layout (mobile: 1 col, tablet: 2 cols, desktop: 3 cols), toast feedback, and confirmation modals.
- **Database**: MongoDB Atlas cloud cluster support with committed `.env` placeholders, plus automatic in-memory fallback for immediate zero-config local testing.

---

## 📁 Project Structure

```text
finalproject/
├── .gitignore                     # Git ignore rules (node_modules ignored, .env preserved)
├── README.md                      # Project documentation and setup guide
│
├── backend/                       # Node.js + Express + Mongoose Backend
│   ├── .env                       # Backend environment variables (PORT, MONGO_URI)
│   ├── package.json               # Backend dependencies and scripts
│   ├── server.js                  # Express entry point & middleware pipeline
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection & auto-seed handler
│   ├── controllers/
│   │   └── recipeController.js    # CRUD controller (Create, GetAll, GetById, Update, Delete)
│   ├── middleware/
│   │   ├── errorHandler.js        # Centralized error handler & 404 handler
│   │   └── validator.js           # Route-level validation & ObjectId verification
│   ├── models/
│   │   └── Recipe.js              # Mongoose schema, validation rules, category enum
│   └── scripts/
│       ├── sampleRecipes.js       # 3 sample recipes (Breakfast, Dinner, Dessert)
│       └── seed.js                # Standalone database seed script (`npm run seed`)
│
└── frontend/                      # React 18 + Vite Frontend
    ├── .env                       # Frontend environment variables (VITE_API_URL)
    ├── package.json               # Frontend dependencies and scripts
    ├── index.html                 # HTML template with Google Fonts (Outfit & Plus Jakarta Sans)
    ├── vite.config.js             # Vite configuration
    └── src/
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Root router & layout
        ├── index.css              # Custom responsive CSS design system
        ├── components/
        │   ├── Navbar.jsx         # Sticky navigation header
        │   ├── RecipeCard.jsx     # Recipe card with category badge, cooking time, actions
        │   ├── RecipeForm.jsx     # Reusable form component for Add & Edit
        │   ├── CategoryBadge.jsx  # Color-coded badge for each category
        │   └── ConfirmModal.jsx   # Accessible confirmation modal for delete
        ├── context/
        │   └── ToastContext.jsx   # Toast notifications provider
        ├── pages/
        │   ├── HomePage.jsx       # Grid list, instant search, category filters, empty state
        │   ├── RecipeDetailPage.jsx # Full recipe details, ingredients, steps, actions
        │   ├── AddRecipePage.jsx  # Create recipe page
        │   ├── EditRecipePage.jsx # Edit recipe page (pre-filled via PUT)
        │   └── NotFoundPage.jsx   # 404 handler
        └── services/
            └── api.js             # Axios API service client
```

---

## 🔑 Environment Configuration & MongoDB Atlas Setup

### 1. Where to Paste Your MongoDB Atlas URI
Open the file [`backend/.env`](file:///d:/education/project/practice/finalproject/backend/.env):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipebook?retryWrites=true&w=majority
```

Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials.

#### Step-by-Step Atlas Instructions:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Deployment** -> **Database**, click **Connect**.
3. Choose **Drivers** (Node.js).
4. Copy the connection string provided by Atlas.
5. In `backend/.env`, set `MONGO_URI` to your copied connection string, ensuring your password is URL-encoded if it contains special characters.
6. Make sure your IP address is whitelisted in Atlas (**Network Access** -> **Add IP Address** -> `Allow Access from Anywhere` or your current IP).

> 💡 **Instant Local Fallback**: If the placeholder `<username>:<password>` is left as-is, the application will automatically initialize an in-memory MongoDB server so you can test and explore immediately without any external database setup!

### 2. Frontend Configuration
The frontend configuration is located in [`frontend/.env`](file:///d:/education/project/practice/finalproject/frontend/.env):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start & Installation

### Step 1: Install Dependencies
Open a terminal in the project root:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Seed Sample Recipes (Optional)
The backend automatically seeds 3 sample recipes upon initial connection if the database collection is empty.
You can also manually run the seed script anytime:

```bash
cd backend
npm run seed
```

### Step 3: Start the Backend Server
```bash
cd backend
npm run dev
# or npm start
```
The backend will run at **`http://localhost:5000`**.

### Step 4: Start the Frontend Application
In a separate terminal:
```bash
cd frontend
npm run dev
```
The frontend will run at **`http://localhost:5173`**.

---

## 📡 Backend API Reference

Base Endpoint: `http://localhost:5000/api/recipes`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/recipes` | Create a new recipe | `201 Created`, `400 Bad Request` |
| `GET` | `/api/recipes` | Get all recipes (newest first; supports `?search=` and `?category=`) | `200 OK`, `500 Server Error` |
| `GET` | `/api/recipes/:id` | Get single recipe by ID | `200 OK`, `400 Invalid ID`, `404 Not Found` |
| `PUT` | `/api/recipes/:id` | Update recipe by ID (`runValidators: true`) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE`| `/api/recipes/:id` | Delete recipe by ID | `200 OK`, `400 Invalid ID`, `404 Not Found` |
| `GET` | `/api/health` | Service health status check | `200 OK` |

### Sample JSON Request Body (POST / PUT)
```json
{
  "name": "Classic Lemon Butter Salmon",
  "category": "Dinner",
  "ingredients": "- 2 fresh salmon fillets\n- 2 tbsp unsalted butter\n- 2 cloves garlic, minced\n- 1 fresh lemon, sliced\n- Salt and freshly cracked black pepper",
  "steps": "1. Pat salmon dry and season generously with salt and pepper.\n2. Melt butter in a skillet over medium-high heat and sear salmon for 4 minutes.\n3. Flip, add garlic and lemon slices, and spoon butter over fish for another 3-4 minutes until cooked through.",
  "cookingTime": 20
}
```

### Sample Response Format:
```json
{
  "message": "Recipe created successfully",
  "data": {
    "_id": "67be8c187f549219800b41aa",
    "name": "Classic Lemon Butter Salmon",
    "category": "Dinner",
    "ingredients": "...",
    "steps": "...",
    "cookingTime": 20,
    "createdAt": "2026-10-27T13:20:00.000Z",
    "updatedAt": "2026-10-27T13:20:00.000Z"
  }
}
```

---

## 🎨 Frontend Features & Architecture
- **Interactive UI**: Search by title or ingredient in real-time, filter with category chips (`All`, `Breakfast`, `Lunch`, `Dinner`, `Snack`, `Dessert`).
- **Responsive Grid**: 1 column on mobile, 2 columns on tablet, 3 columns on desktop.
- **Client-Side Validation**: Inline error messages for missing fields, minimum length, and non-positive cooking time.
- **Feedback & Alerts**: Toast notification system for success, error, and deletion confirmations.
- **Single Component Reusability**: Add and Edit modes share a unified `RecipeForm` component.
- **Zero Page Reloads**: List automatically refreshes after adding, updating, or deleting recipes.

---

## 🧪 Verification & Testing
All CRUD operations, validation constraints, error handlers, and responsive layouts have been tested end-to-end.
