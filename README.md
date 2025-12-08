# 🚗 Vehicle Rental System – Backend API  
A complete backend system for managing vehicle rentals, bookings, customers, and admin operations.  
Built with **Node.js, TypeScript, Express, PostgreSQL**, and fully secured using **JWT authentication**.

---

## 🌐 Live API URL  


---

# ⭐ Project Features

## 🔐 Authentication & Authorization
- User Registration & Login (JWT-based)
- Role-based Access Control:
  - **Admin** → full system access  
  - **Customer** → limited access (own profile, own bookings)

---

## 🚘 Vehicle Management (Admin Only)
- Create Vehicle  
- Get All Vehicles  
- Get Vehicle by ID  
- Update Vehicle  
- Delete Vehicle  
- Automatic availability updates based on booking status

---

## 👤 User Management
- Admin → Get all users  
- Admin → Update any user  
- User → Update own profile  
- Admin → Delete user (only if no active bookings)

---

## 📅 Booking Management
- Customer/Admin → Create booking  
- Auto price calculation:
  ```
  total_price = daily_rent_price × number_of_days
  ```
- Customer → Cancel own booking  
- Admin → Mark booking as returned  
- Vehicle availability auto-update  
- Role-based booking retrieval:
  - Admin → all bookings  
  - Customer → only own bookings  

---

## 🔄 Auto Return System (Cron Job)
A scheduled background job that:

- Automatically checks for expired bookings  
- Marks them as `"returned"`  
- Sets the vehicle status back to `"available"`  

Runs every **1 minute** using `node-cron`.

---

# 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Scheduler | node-cron |
| Hosting | Vercel |

---

# 📁 Project Structure

```
src/
 ├─ app.ts
 ├─ server.ts
 ├─ database/
 │    └─ db.ts
 ├─ middlewares/
 │    └─ auth.middleware.ts
 ├─ modules/
 │    ├─ auth/
 │    ├─ users/
 │    ├─ vehicles/
 │    ├─ bookings/
 │    └─ autoReturn/
 └─ utils/
      └─ response.ts
```

---

# ⚙️ Setup & Installation Guide

## 1️⃣ Clone the repository
```
git clone https://github.com/wahedpro/Level2-Assignment-02.git
cd vehicle-rental-system
```

## 2️⃣ Install dependencies
```
npm install
```

## 3️⃣ Configure Environment Variables  
Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

## 4️⃣ Run the project (development)
```
npm run dev
```

## 5️⃣ Build & run production build
```
npm run build
npm start
```

---

# 🧪 API Endpoints Overview

## 🔐 Auth
- `POST /api/v1/auth/signup`  
- `POST /api/v1/auth/signin`  

## 🚘 Vehicles
- `POST /api/v1/vehicles`  
- `GET /api/v1/vehicles`  
- `GET /api/v1/vehicles/:id`  
- `PUT /api/v1/vehicles/:id`  
- `DELETE /api/v1/vehicles/:id`  

## 👤 Users
- `GET /api/v1/users`  
- `PUT /api/v1/users/:id`  
- `DELETE /api/v1/users/:id`  

## 📅 Bookings
- `POST /api/v1/bookings`  
- `GET /api/v1/bookings`  
- `PUT /api/v1/bookings/:id`  