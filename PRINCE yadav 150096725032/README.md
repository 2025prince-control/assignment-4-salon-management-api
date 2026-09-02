# 💇‍♀️ Salon Management REST API

> **Assignment 4:** Salon Management REST API  
> **Author / Student:** Prince Yadav (Roll / ID: `150096725032`)  
> **Repository:** [https://github.com/2025prince-control/assignment-4-salon-management-api](https://github.com/2025prince-control/assignment-4-salon-management-api)  
> **Deployment Link / Live API:** [https://assignment-4-salon-management-api.onrender.com](https://assignment-4-salon-management-api.onrender.com)

---

## 📌 Project Overview

The **Salon Management REST API** is a secure, scalable backend service designed to manage salon operations, beauty and styling services, user accounts, and authenticated administrative workflows.

Built with **Node.js**, **Express.js (v5)**, and **Supabase (PostgreSQL)**, it implements industry-standard practices including:
- **Stateless Authentication:** User Registration and Login powered by `bcryptjs` password hashing (salt rounds: 10) and `jsonwebtoken (JWT)` generation.
- **Route Protection:** Custom `authMiddleware` enforcing `Bearer <token>` validation on all mutating operations.
- **Request Logging:** Custom middleware recording ISO timestamp, HTTP method, and endpoint path for every incoming request.
- **Relational Data Modeling:** Full CRUD workflows for Salons and Services with relational foreign-key mapping (`services.salonid` ➔ `salons.id`).
- **Advanced Querying:** Filtering salons by city (case-insensitive with `ilike`), leaderboard ranking (`/salons/top`), and service availability tracking (`/services/available`).

---

## 🚀 Live Links

| Resource | URL |
|---|---|
| **GitHub Repository** | [https://github.com/2025prince-control/assignment-4-salon-management-api](https://github.com/2025prince-control/assignment-4-salon-management-api) |
| **Live API Deployment** | [https://assignment-4-salon-management-api.onrender.com](https://assignment-4-salon-management-api.onrender.com) |
| **API Health Check** | `GET https://assignment-4-salon-management-api.onrender.com/` |

---

## 🛠️ Tech Stack & Dependencies

| Technology | Role / Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime environment |
| **Express.js (v5.2.1)** | Minimalist and performant web framework |
| **Supabase (@supabase/supabase-js v2.112.3)** | Hosted PostgreSQL database client and ORM layer |
| **jsonwebtoken (v9.0.3)** | Generates and verifies signed JWT tokens for protected endpoints |
| **bcryptjs (v3.0.3)** | Cryptographic hashing of user passwords |
| **dotenv (v17.4.2)** | Secure management of environment variables |
| **nodemon (v3.1.14)** | Development server hot-reloading |

---

## 📂 Project Structure

```text
PRINCE yadav 150096725032/
├── config/
│   └── db.js                 # Supabase client configuration & initialization
├── middleware/
│   ├── authMiddleware.js     # JWT verification middleware for protected routes
│   └── logger.js             # Custom request logger (timestamp, method, path)
├── routes/
│   ├── authRoutes.js         # User registration & login endpoints
│   ├── salonRoutes.js        # Salon CRUD, ranking & city filter endpoints
│   └── serviceRoutes.js      # Services CRUD, availability & salon filter endpoints
├── package.json              # Project scripts and dependency declarations
├── package-lock.json         # Dependency tree lockfile
├── server.js                 # Main server entrypoint, database ping & route registration
└── README.md                 # Project documentation
```

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

### 1. `users` Table
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` / `bigint` | Primary Key, Auto-generated | Unique identifier for the user |
| `username` | `text` / `varchar` | NOT NULL | User's chosen display name |
| `email` | `text` / `varchar` | NOT NULL, UNIQUE | User's unique email address |
| `password` | `text` | NOT NULL | Hashed password (via `bcryptjs`) |
| `created_at`| `timestamp` | DEFAULT now() | Account creation timestamp |

### 2. `salons` Table
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` / `bigint` | Primary Key, Auto-generated | Unique identifier for the salon |
| `name` | `text` | NOT NULL | Business name of the salon |
| `city` | `text` | NOT NULL | City location |
| `address` | `text` | NOT NULL | Physical street address |
| `rating` | `numeric` / `float` | NOT NULL | Rating score (e.g., 4.8) |
| `created_at`| `timestamp` | DEFAULT now() | Creation timestamp |

### 3. `services` Table
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` / `bigint` | Primary Key, Auto-generated | Unique identifier for the service |
| `salonid` | `uuid` / `bigint` | Foreign Key (`salons.id`) | Reference to parent salon |
| `servicename`| `text` | NOT NULL | Service title (e.g., "Haircut") |
| `price` | `numeric` / `float` | NOT NULL | Cost of the service |
| `duration` | `text` | NOT NULL | Duration (e.g., "45 mins") |
| `isavailable`| `boolean` | NOT NULL, DEFAULT true | Service availability status |
| `created_at`| `timestamp` | DEFAULT now() | Creation timestamp |

---

## 📋 API Endpoints Reference

### 1. Health & Verification Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Welcome message & API health verification |
| `GET` | `/protected` | Protected | Test endpoint to verify JWT authorization |

### 2. Authentication Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user with username, email & password |
| `POST` | `/login` | Public | Authenticate user & return signed 1-hour JWT token |

### 3. Salon Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/salons` | Public | Fetch all salons |
| `GET` | `/salons/top` | Public | Fetch top 5 salons ordered by rating (highest first) |
| `GET` | `/salons/city/:city` | Public | Search salons by city (case-insensitive) |
| `GET` | `/salons/:id` | Public | Fetch a specific salon by ID |
| `POST` | `/salons` | Protected | Create a new salon |
| `PUT` | `/salons/:id` | Protected | Update salon details |
| `DELETE`| `/salons/:id` | Protected | Delete a salon by ID |

### 4. Service Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/services/available` | Public | Fetch all services where `isavailable` is true |
| `GET` | `/salons/:id/services` | Public | Fetch all services provided by a specific salon |
| `POST` | `/salons/:id/services` | Protected | Create a new service under a specific salon |
| `PUT` | `/services/:id` | Protected | Update an existing service |
| `DELETE`| `/services/:id` | Protected | Delete a service by ID |

---

## 📡 Comprehensive API Documentation & Examples

### 1. Register User
- **URL:** `POST /register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "username": "prince_yadav",
  "email": "prince@example.com",
  "password": "SecurePassword123"
}
```
- **Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "1",
    "username": "prince_yadav",
    "email": "prince@example.com"
  }
}
```
- **cURL Command:**
```bash
curl -X POST https://assignment-4-salon-management-api.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prince_yadav",
    "email": "prince@example.com",
    "password": "SecurePassword123"
  }'
```

---

### 2. Login User
- **URL:** `POST /login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "prince@example.com",
  "password": "SecurePassword123"
}
```
- **Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **cURL Command:**
```bash
curl -X POST https://assignment-4-salon-management-api.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prince@example.com",
    "password": "SecurePassword123"
  }'
```

---

### 3. Verify Protected Route
- **URL:** `GET /protected`
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "message": "You have access to the protected route",
  "user": {
    "id": "1",
    "email": "prince@example.com",
    "iat": 1740000000,
    "exp": 1740003600
  }
}
```
- **cURL Command:**
```bash
curl -X GET https://assignment-4-salon-management-api.onrender.com/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Create Salon (Protected)
- **URL:** `POST /salons`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "name": "Luxe Glow Salon & Spa",
  "city": "Mumbai",
  "address": "Shop 12, High Street Mall, Bandra West",
  "rating": 4.9
}
```
- **Response (201 Created):**
```json
{
  "message": "Salon created successfully",
  "salon": {
    "id": "10",
    "name": "Luxe Glow Salon & Spa",
    "city": "Mumbai",
    "address": "Shop 12, High Street Mall, Bandra West",
    "rating": 4.9
  }
}
```
- **cURL Command:**
```bash
curl -X POST https://assignment-4-salon-management-api.onrender.com/salons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Luxe Glow Salon & Spa",
    "city": "Mumbai",
    "address": "Shop 12, High Street Mall, Bandra West",
    "rating": 4.9
  }'
```

---

### 5. Get All Salons
- **URL:** `GET /salons`
- **Response (200 OK):**
```json
[
  {
    "id": "10",
    "name": "Luxe Glow Salon & Spa",
    "city": "Mumbai",
    "address": "Shop 12, High Street Mall, Bandra West",
    "rating": 4.9
  }
]
```
- **cURL Command:**
```bash
curl -X GET https://assignment-4-salon-management-api.onrender.com/salons
```

---

### 6. Get Top Rated Salons
- **URL:** `GET /salons/top`
- **Response (200 OK):** Returns top 5 salons ordered by rating descending.
- **cURL Command:**
```bash
curl -X GET https://assignment-4-salon-management-api.onrender.com/salons/top
```

---

### 7. Search Salons by City
- **URL:** `GET /salons/city/:city`
- **Example:** `GET /salons/city/mumbai`
- **Response (200 OK):** List of all salons matching the city (case-insensitive).
- **cURL Command:**
```bash
curl -X GET https://assignment-4-salon-management-api.onrender.com/salons/city/mumbai
```

---

### 8. Get Salon by ID
- **URL:** `GET /salons/:id`
- **Response (200 OK):**
```json
{
  "id": "10",
  "name": "Luxe Glow Salon & Spa",
  "city": "Mumbai",
  "address": "Shop 12, High Street Mall, Bandra West",
  "rating": 4.9
}
```

---

### 9. Update Salon (Protected)
- **URL:** `PUT /salons/:id`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "name": "Luxe Glow Premium Spa",
  "city": "Mumbai",
  "address": "Shop 12-14, High Street Mall, Bandra West",
  "rating": 5.0
}
```
- **Response (200 OK):**
```json
{
  "message": "Salon updated successfully",
  "salon": {
    "id": "10",
    "name": "Luxe Glow Premium Spa",
    "city": "Mumbai",
    "address": "Shop 12-14, High Street Mall, Bandra West",
    "rating": 5.0
  }
}
```

---

### 10. Delete Salon (Protected)
- **URL:** `DELETE /salons/:id`
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "message": "Salon deleted successfully"
}
```

---

### 11. Add Service to Salon (Protected)
- **URL:** `POST /salons/:id/services`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "serviceName": "Hydra Facial Therapy",
  "price": 1499,
  "duration": "60 mins",
  "isAvailable": true
}
```
- **Response (201 Created):**
```json
{
  "message": "Service created successfully",
  "service": {
    "id": "1",
    "salonId": "10",
    "serviceName": "Hydra Facial Therapy",
    "price": 1499,
    "duration": "60 mins",
    "isAvailable": true
  }
}
```
- **cURL Command:**
```bash
curl -X POST https://assignment-4-salon-management-api.onrender.com/salons/10/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "serviceName": "Hydra Facial Therapy",
    "price": 1499,
    "duration": "60 mins",
    "isAvailable": true
  }'
```

---

### 12. Get Services by Salon ID
- **URL:** `GET /salons/:id/services`
- **Response (200 OK):**
```json
[
  {
    "id": "1",
    "salonid": "10",
    "servicename": "Hydra Facial Therapy",
    "price": 1499,
    "duration": "60 mins",
    "isavailable": true
  }
]
```

---

### 13. Get All Available Services
- **URL:** `GET /services/available`
- **Response (200 OK):** List of all services across all salons where `isavailable: true`.

---

### 14. Update Service (Protected)
- **URL:** `PUT /services/:id`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Request Body:**
```json
{
  "serviceName": "Hydra Facial Therapy Deluxe",
  "price": 1799,
  "duration": "75 mins",
  "isAvailable": true
}
```
- **Response (200 OK):**
```json
{
  "message": "Service updated successfully",
  "service": {
    "id": "1",
    "salonId": "10",
    "serviceName": "Hydra Facial Therapy Deluxe",
    "price": 1799,
    "duration": "75 mins",
    "isAvailable": true
  }
}
```

---

### 15. Delete Service (Protected)
- **URL:** `DELETE /services/:id`
- **Headers:** `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Response (200 OK):**
```json
{
  "message": "Service deleted successfully"
}
```

---

## ⚙️ Local Setup & Installation Guide

### Prerequisites
- **Node.js**: v18 or higher installed on your system.
- **Git**: Installed and configured.
- **Supabase Account**: A Supabase project with `users`, `salons`, and `services` tables created.

### 1. Clone the Repository
```bash
git clone https://github.com/2025prince-control/assignment-4-salon-management-api.git
cd assignment-4-salon-management-api/"PRINCE yadav 150096725032"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root directory:
```bash
touch .env
```
Add the following variables to `.env`:
```env
PORT=3000
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Run the Application
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  node server.js
  ```

When successfully connected, the console will display:
```
[INFO] Supabase database connected successfully!
[INFO] Server running on port 3000
```

---

## 🧪 Postman Testing Workflow

1. **Register:** Send `POST /register` with user credentials.
2. **Login:** Send `POST /login` with registered credentials. Copy the returned `token`.
3. **Environment Setup:** Set a Postman environment variable `token` with the token value.
4. **Authorize Protected Requests:** In Postman, set the **Authorization** tab to `Bearer Token` and enter `{{token}}`.
5. **Execute CRUD Operations:**
   - Create a salon (`POST /salons`)
   - Add services to the salon (`POST /salons/:id/services`)
   - Query available services (`GET /services/available`)
   - Update or delete records using the generated IDs.

---

## 🛡️ Error Handling & Status Codes

| HTTP Code | Name | Description |
|---|---|---|
| `200` | OK | Request succeeded with response payload |
| `201` | Created | Resource (User, Salon, Service) successfully created |
| `400` | Bad Request | Missing required fields or validation failure |
| `401` | Unauthorized | Missing, invalid, or expired JWT Bearer token |
| `404` | Not Found | Requested Salon or Service does not exist |
| `500` | Internal Server Error | Unexpected database or server failure |

---

## 👨‍💻 Author & Submission Details

- **Student Name:** Prince Yadav
- **Student ID / Roll No:** `150096725032`
- **Course Assignment:** Assignment 4 - Salon Management API
- **Repository:** [https://github.com/2025prince-control/assignment-4-salon-management-api](https://github.com/2025prince-control/assignment-4-salon-management-api)
- **Deployment URL:** [https://assignment-4-salon-management-api.onrender.com](https://assignment-4-salon-management-api.onrender.com)
