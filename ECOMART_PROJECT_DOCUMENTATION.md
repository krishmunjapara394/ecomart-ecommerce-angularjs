# 🛋️ EcoMart — Complete Project Documentation

> **EcoMart** is a full-stack furniture e-commerce web application built with **Angular 17** (client) and **Node.js / Express / MongoDB** (server). It features a customer-facing storefront with cart, checkout, order tracking, and a fully-featured admin dashboard with analytics, user management, order control, and product management.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Product Catalog](#4-product-catalog)
5. [Customer-Facing Features](#5-customer-facing-features)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [User Account & Profile](#7-user-account--profile)
8. [Shopping Cart](#8-shopping-cart)
9. [Checkout & Orders](#9-checkout--orders)
10. [Contact Us](#10-contact-us)
11. [Admin Panel — Overview](#11-admin-panel--overview)
12. [Admin Panel — Products Management](#12-admin-panel--products-management)
13. [Admin Panel — Orders Management](#13-admin-panel--orders-management)
14. [Admin Panel — Accounts Management](#14-admin-panel--accounts-management)
15. [Admin Panel — Contacts Management](#15-admin-panel--contacts-management)
16. [Admin Panel — Analytics & Charts](#16-admin-panel--analytics--charts)
17. [REST API Reference](#17-rest-api-reference)
18. [Database Models](#18-database-models)
19. [Security](#19-security)
20. [Running the Project](#20-running-the-project)

---

## 1. Project Overview

EcoMart is a **furniture e-commerce platform** that allows customers to browse, search, and purchase high-quality furniture. The platform supports two distinct user roles:

| Role    | Description                                                        |
|---------|--------------------------------------------------------------------|
| `user`  | Regular customer — can browse, add to cart, place/track orders    |
| `admin` | Store administrator — full control over products, orders, users   |

### Business Domain
- **Niche:** Home & Office Furniture
- **Categories:** Bedroom · Sofa · Office · Outdoor · Kitchen · Dining · Living Room · Lighting
- **Brands:** APEX · Call of SOFA · Puff B&G · Fornighte · UrbanNest · WoodCraft

---

## 2. Tech Stack

### Client (Frontend)

| Technology         | Version  | Purpose                              |
|--------------------|----------|--------------------------------------|
| Angular            | 17.x     | SPA Framework                        |
| TypeScript         | 5.4.x    | Language                             |
| TailwindCSS        | 3.4.x    | Utility-first CSS styling            |
| Angular Material   | 17.3.x   | UI Component Library (dialogs, etc.) |
| Angular CDK        | 17.3.x   | Component Dev Kit                    |
| Chart.js           | 4.4.x    | Analytics charts in admin panel      |
| ng2-charts         | 6.0.x    | Angular wrapper for Chart.js         |
| SplideJS           | 4.1.x    | Product image carousel/slider        |
| SweetAlert2        | 11.x     | Beautiful alert/confirm modals       |
| RxJS               | 7.8.x    | Reactive programming / HTTP calls    |

### Server (Backend)

| Technology     | Version | Purpose                              |
|----------------|---------|--------------------------------------|
| Node.js        | 22.x    | JavaScript runtime                   |
| Express        | 4.19.x  | HTTP framework                       |
| MongoDB        | —       | NoSQL Database                       |
| Mongoose       | 8.3.x   | MongoDB ODM                          |
| JSON Web Token | 9.0.x   | Authentication (JWT)                 |
| bcrypt         | 5.1.x   | Password hashing                     |
| Multer         | 1.4.x   | File/image upload (memory storage)   |
| Nodemailer     | 6.9.x   | Email sending (password reset/reply) |
| Mailtrap       | 3.3.x   | Email testing service                |
| CORS           | 2.8.x   | Cross-origin resource sharing        |
| dotenv         | 16.x    | Environment variable management      |
| validator      | 13.x    | Input validation                     |
| nodemon        | 3.1.x   | Auto-restart during development      |

### Dev / Testing

| Tool          | Purpose                         |
|---------------|---------------------------------|
| Mocha         | Backend test runner             |
| Chai          | Backend assertion library       |
| Faker.js      | Seed data generation            |
| Karma/Jasmine | Angular unit test framework     |

---

## 3. Project Structure

```
ecomart-ecommerce-angularjs/
├── client/                         # Angular 17 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # 31 reusable components
│   │   │   ├── layouts/            # 12 page layouts (routed views)
│   │   │   ├── services/           # 12 Angular services
│   │   │   ├── interceptors/       # HTTP interceptors (auth token)
│   │   │   ├── interfaces/         # TypeScript interfaces
│   │   │   ├── Utils/              # Client-side utility helpers
│   │   │   ├── app.routes.ts       # All client routes & guards
│   │   │   └── app.config.ts       # App-level configuration
│   │   ├── assets/                 # Static assets
│   │   └── styles.css             # Global styles
│   └── package.json
│
└── server/                         # Node.js/Express backend
    ├── app.mjs                     # Main Express app entry point
    ├── seed.mjs                    # Database seed script
    ├── models/                     # 5 Mongoose models
    │   ├── User.mjs
    │   ├── Product.mjs
    │   ├── Order.mjs
    │   ├── Contact.mjs
    │   └── FeaturedProducts.mjs
    ├── controllers/                # 7 controllers (business logic)
    │   ├── authController.mjs
    │   ├── userController.mjs
    │   ├── profileController.mjs
    │   ├── productController.mjs
    │   ├── ordersController.mjs
    │   ├── contactController.mjs
    │   └── featuredProductsController.mjs
    ├── routes/                     # 6 route files
    ├── config/                     # DB config
    ├── services/                   # Business services
    ├── utils/                      # Helpers (appError, catchAsync, email)
    ├── tests/                      # Mocha/Chai tests
    └── uploads/                    # File upload directory
```

---

## 4. Product Catalog

### Categories & Products

EcoMart carries **60+ products** across **8 categories**:

| Category     | Example Products                                                                |
|--------------|---------------------------------------------------------------------------------|
| **Bedroom**  | Royal King Bed Frame, Modern Platform Bed, Scandinavian Dresser, Rustic Wardrobe, LED Vanity Mirror Desk, Memory Foam Mattress, Linen Storage Ottoman Bed, Canopy Bedroom Set |
| **Sofa**     | L-Shaped Sectional Sofa, Chesterfield Leather Sofa, Cloud Comfort Recliner, Tufted Velvet Sofa, Convertible Sleeper Sofa, Italian Leather Loveseat, Bohemian Floor Sofa |
| **Office**   | Executive Ergonomic Chair, Standing Desk Electric, Corner Computer Desk, Conference Table 8-Seat, Acoustic Office Pod, Walnut Writing Desk, Monitor Arm Dual Stand |
| **Outdoor**  | Teak Garden Dining Set, Hanging Egg Chair, Fire Pit Table Set, Pergola Shade Structure, Garden Swing Bench, Outdoor Daybed Canopy, Adirondack Chair Cedar |
| **Kitchen**  | Marble Kitchen Island, Industrial Bar Stools Set, Bamboo Spice Rack, Kitchen Pantry Cabinet, Copper Pot Rack |
| **Dining**   | Farmhouse Dining Table, Velvet Dining Chairs Set, Glass Round Dining Table, Mid-Century Sideboard, Wine Rack Cabinet |
| **Living Room** | TV Entertainment Center, Modular Bookshelf System, Accent Armchair Wingback, Marble Coffee Table Round, Ottoman Storage Bench |
| **Lighting** | Modern Arc Floor Lamp, Crystal Chandelier Modern, Industrial Pendant Lights, Smart LED Table Lamp, Rattan Woven Lamp Shade |

### Brands

| Brand         | Style Focus                        |
|---------------|------------------------------------|
| **APEX**      | Premium, versatile range           |
| **Call of SOFA** | Luxury seating & upholstery    |
| **Puff B&G**  | Functional home accessories        |
| **Fornighte** | Modern & contemporary              |
| **UrbanNest** | Urban / contemporary kitchen & living |
| **WoodCraft** | Natural wood & artisan pieces      |

### Product Data Model Fields

| Field      | Type       | Description                                     |
|------------|------------|-------------------------------------------------|
| `name`     | String     | Unique, 3–100 characters                        |
| `price`    | Number     | Non-negative, in USD                            |
| `desc`     | String     | Product description                             |
| `stock`    | Integer    | Non-negative inventory count                    |
| `images`   | [String]   | Array of image URLs or base64 strings (up to 5)|
| `brand`    | String     | One of 6 supported brands                       |
| `category` | String     | One of 8 categories                             |
| `size`     | [String]   | Allowed: S, M, L, XL, XXL                      |
| `colors`   | [String]   | Hex color codes (at least one required)         |

---

## 5. Customer-Facing Features

### 🏠 Home Page (`/home`)
- Hero section with featured/promotional banner
- Featured product showcase (from FeaturedProducts collection)
- Product highlights with a Splide carousel
- Quick navigation to product catalog

### 🛍️ Product Catalog (`/catalog`)
- Browse all products with pagination support
- Filter by category, brand, size, color
- Product cards with image, name, price, and quick "Add to Cart"
- Loading spinner during API fetch

### 🔍 Product Detail (`/product-overview/:id`)
- Full product description, multiple images in carousel (SplideJS)
- Available sizes & color swatches
- Stock display
- "Add to Cart" functionality
- Product brand and category info

### ℹ️ About Us (`/about-us`)
- Company description and mission page

### 📬 Contact Us (`/contact-us`)
- Public contact form (no login required)
- Fields: Name, Email, Category (delivery/support/orders/careers/partnership/feedback/other), Message
- Submissions stored in MongoDB, visible to admin

---

## 6. Authentication & Authorization

### Authentication Flow
- **JWT-based** stateless authentication
- Token returned on login/signup, stored client-side (localStorage)
- Every protected request sends `Authorization: Bearer <token>` header
- HTTP Interceptor on Angular client automatically attaches the token

### Endpoints
| Action            | Method | URL                                  |
|-------------------|--------|--------------------------------------|
| Sign Up           | POST   | `/api/users/signup`                  |
| Login             | POST   | `/api/users/login`                   |
| Logout            | POST   | `/api/users/logout`                  |
| Forgot Password   | POST   | `/api/users/forgotPassword`          |
| Reset Password    | PATCH  | `/api/users/resetPassword/:token`    |
| Update Password   | PATCH  | `/api/users/updatePassword`          |

### Password Reset Flow
1. User submits their email at `/forget-password`
2. Server generates a `crypto.randomBytes(32)` reset token (valid 10 minutes)
3. Hashed token stored in DB, raw token sent via email (Nodemailer/Mailtrap)
4. User follows the link to `/reset-password` with the token
5. New password saved, new JWT issued

### Route Guards (Angular)
| Guard                 | Purpose                                         |
|-----------------------|-------------------------------------------------|
| `IsLoggedService`     | Blocks route if user is NOT logged in           |
| `IsNotLoggedService`  | Blocks route if user IS already logged in       |
| `IsAdminService`      | Blocks route if user role is not `admin`        |
| `IsUserService`       | Blocks route if user role is not `user`         |
| `CardIsNotEmptyService` | Blocks checkout route if cart is empty        |

---

## 7. User Account & Profile

Accessible under `/profile` (requires login, `user` role).

### Profile Sub-Routes

| Path                    | Component                      | Feature                                      |
|-------------------------|--------------------------------|----------------------------------------------|
| `/profile/information`  | ProfileInformationComponent    | View full profile details                    |
| `/profile/edit`         | EditProfileComponent           | Edit name, email, phone, gender              |
| `/profile/address`      | ManageAddressComponent         | Add/edit/delete shipping addresses           |
| `/profile/password`     | ChangePasswordComponent        | Change account password (requires current pw)|
| `/profile/wishlist`     | WishlistComponent              | View saved/wishlisted items                  |

### Profile Data
| Field        | Description                                 |
|--------------|---------------------------------------------|
| `fullName`   | User's full name                            |
| `email`      | Unique email address                        |
| `username`   | Unique username                             |
| `phone`      | Phone number                                |
| `gender`     | Male / Female                               |
| `image`      | Profile photo (base64 stored in DB, max 5MB)|
| `address[]`  | Multiple delivery addresses (street1, street2, city, state, country, zip) |

### Profile Image Upload
- User can upload a profile photo from `/profile` settings
- Image stored as base64 string in MongoDB (max 5 MB via Multer)
- Default avatar shown if no image uploaded

---

## 8. Shopping Cart

- Cart is stored **server-side** on the user document as an array of `Product` ObjectIds
- Multiple quantities handled by repeating the product ID in the array
- Cart is cleared after a successful order

### Cart Operations

| Action           | Endpoint                          | Description                                   |
|------------------|-----------------------------------|-----------------------------------------------|
| View Cart        | `GET /api/users/cart`             | Returns unique products with quantity         |
| Add to Cart      | `POST /api/users/cart`            | `{ productId, quantity }` — adds N copies     |
| Remove One       | `POST /api/users/cart/delete`     | `{ productId }` — removes one occurrence      |
| Remove All       | `POST /api/users/cart/delete`     | `{ productId, type: "removeAll" }` — removes all|
| Cart Size        | `GET /api/users/cart/size`        | Returns number of unique items in cart        |

### Cart UI (`/cart`)
- Lists all cart items with quantity, image, name, price
- Increment / Decrement / Remove entire item controls
- Total price calculation
- Redirect to Checkout if non-empty

---

## 9. Checkout & Orders

### Checkout Flow (`/check-out`)
> Protected by `IsLoggedService + IsUserService + CardIsNotEmptyService`

1. User arrives at checkout with items in cart
2. Selects a shipping address from saved addresses (or adds new)
3. Reviews order summary and total
4. Confirms order → API call to `POST /api/orders`
5. Stock is **decremented atomically** using `bulkWrite` for each product
6. Order created in DB, user's cart cleared, order added to user's `orders` array

### Order Data Model

| Field        | Type          | Description                                       |
|--------------|---------------|---------------------------------------------------|
| `date`       | Date          | Order placement date (auto)                       |
| `user`       | ObjectId(User)| Reference to ordering user                       |
| `address`    | Object        | `{ street, city, zip }` — delivery address        |
| `products`   | [ObjectId]    | Array of Product IDs (repeated for quantity)      |
| `totalPrice` | Number        | Total cost in USD                                 |
| `status`     | String        | `pending` → `accepted` / `rejected`               |

### Order History (`/order-history`)
- Lists user's past orders with status badge (pending / accepted / rejected)
- Paginated results

### Order Detail (`/orders/:id`)
- Full breakdown of a single order
- Product names, quantities, prices, delivery address
- Order status

---

## 10. Contact Us

### Customer Side
- Form at `/contact-us` (public, no auth required)
- Categories: delivery · support · orders · careers · partnership · feedback · other
- Stored in MongoDB with `status: "new"` by default

### Admin Side
- Admin can view all contact submissions
- Can update status: `new` → `read` → `replied` → `archived`
- Admin can **reply directly** from the dashboard — triggers an email to the customer via Nodemailer
- Admin can delete contact entries

---

## 11. Admin Panel — Overview

The Admin Dashboard is accessible at `/admin-dashboard` and is **protected** by both `IsLoggedService` and `IsAdminService` guards.

### Sidebar Navigation

| Section              | Path                                   | Purpose                                       |
|----------------------|----------------------------------------|-----------------------------------------------|
| Overview             | `/admin-dashboard/overview`            | Summary stats + charts                        |
| Accounts             | `/admin-dashboard/accounts-overview`   | View, edit, delete users                      |
| Orders               | `/admin-dashboard/orders-overview`     | View & manage all orders                      |
| Products             | `/admin-dashboard/products-overview`   | View, add, edit, delete products              |
| Contacts             | `/admin-dashboard/contacts-overview`   | View & reply to contact messages              |
| Profile              | `/admin-dashboard/profile`             | Admin's own profile                           |
| Settings             | `/admin-dashboard/settings`            | Admin settings                                |

---

## 12. Admin Panel — Products Management

### Features
- **View all products** in a paginated, searchable table
- **Add new product** via `ProductFormComponent` dialog
  - Fields: name, price, description, stock, category, brand, sizes, colors
- **Edit existing product** via `ProductEditFormComponent` dialog
  - All fields editable including URL-based images
- **Upload product images** (up to 5 images, max 5MB each)
  - Stored as base64 in MongoDB
- **Delete product** with confirmation dialog
- **View product counts by brand** — pie/bar chart breakdown
- **Decrease stock** manually via API

### Product Form Validation
- Name: required, unique, 3–100 chars
- Price: required, ≥ 0
- Stock: required, integer ≥ 0
- Brand: required (6 options)
- Category: required (8 options)
- Size: required, valid enum (S/M/L/XL/XXL)
- Colors: at least 1 hex color code

---

## 13. Admin Panel — Orders Management

### Features
- **View all customer orders** (paginated, sorted most recent)
- See order **user details**: name, email, phone
- See ordered **products**: name, quantity, price
- **Update order status**:
  - Mark as `accepted`
  - Mark as `rejected`
- **Delete** an order
- **Order Status Report**: aggregated count of accepted/rejected/pending orders (chart visualization)

### Filtering
- Orders scoped by `req.user.role` — admin sees ALL orders, users see only their own

---

## 14. Admin Panel — Accounts Management

### Features
- **View all users** (excluding passwords)
- **Edit user profile** by username — update any non-sensitive fields
- **Upload user profile image** by username
- **Delete user account** by username
- **User registration chart** — line/bar chart showing new user signups per date

### Components Used
- `AccountsOverviewComponent` — main table view
- `UserFormComponent` — create/edit user dialog
- `UserDeletionConfirmationComponent` — delete confirmation dialog
- `AdminProfileComponent` — admin's own profile view/edit

---

## 15. Admin Panel — Contacts Management

### Features
- **View all contact form submissions** (sorted newest first)
- See full message details: name, email, category, message, status
- **Update status**: new → read → replied → archived
- **Reply to customer** from within the panel
  - Saves reply text in DB (`adminReply` + `repliedAt` fields)
  - Sends automated email reply to the customer via Nodemailer
  - Email subject: `Re: Your {category} inquiry — EcoMart Support`
- **Delete** contact message

---

## 16. Admin Panel — Analytics & Charts

All charts are powered by **Chart.js** via `ng2-charts`:

| Chart                    | Type        | Data                                               |
|--------------------------|-------------|----------------------------------------------------|
| User Growth              | Line / Bar  | New registrations per date (`/api/users/charts`)   |
| Order Status Report      | Doughnut    | Count of pending / accepted / rejected orders      |
| Products by Brand        | Bar / Pie   | Number of products per brand                       |
| Total Revenue            | Derived     | Sum of `totalPrice` across accepted orders         |
| Total Counts             | Stat Cards  | Total users / Total orders / Total products        |

---

## 17. REST API Reference

### Auth Routes — `/api/users`

| Method | Endpoint                             | Auth    | Description               |
|--------|--------------------------------------|---------|---------------------------|
| POST   | `/api/users/signup`                  | None    | Register new user         |
| POST   | `/api/users/login`                   | None    | Login (username or email) |
| POST   | `/api/users/logout`                  | None    | Logout (client-side)      |
| POST   | `/api/users/forgotPassword`          | None    | Send password reset email |
| PATCH  | `/api/users/resetPassword/:token`    | None    | Reset password with token |
| PATCH  | `/api/users/updatePassword`          | JWT     | Update logged-in password |

### User / Profile Routes — `/api/users` + `/api/profile`

| Method | Endpoint                             | Auth    | Description                      |
|--------|--------------------------------------|---------|----------------------------------|
| GET    | `/api/users/view`                    | JWT     | Get current user profile         |
| PATCH  | `/api/users/edit`                    | JWT     | Update current user profile      |
| PATCH  | `/api/users/password`                | JWT     | Update current user password     |
| GET    | `/api/users/all`                     | JWT+Admin | Get all user profiles          |
| PATCH  | `/api/users/updateImage`             | JWT     | Upload own profile image         |
| PATCH  | `/api/users/admin/edit`              | JWT+Admin | Admin update any user profile  |
| PATCH  | `/api/users/admin/updateImage`       | JWT+Admin | Admin update any user's image  |
| DELETE | `/api/users/admin/delete`            | JWT+Admin | Admin delete a user            |
| GET    | `/api/users/charts`                  | JWT     | User registration chart data     |
| GET    | `/api/users/cart`                    | JWT     | Get user's cart items            |
| POST   | `/api/users/cart`                    | JWT     | Add product to cart              |
| POST   | `/api/users/cart/delete`             | JWT     | Remove product from cart         |
| GET    | `/api/users/cart/size`               | JWT     | Get cart size (unique items)     |

### Product Routes — `/api/products`

| Method | Endpoint                                    | Auth      | Description                      |
|--------|---------------------------------------------|-----------|----------------------------------|
| GET    | `/api/products`                             | None      | Get all products (paginated)     |
| POST   | `/api/products`                             | JWT       | Create new product               |
| GET    | `/api/products/:id`                         | None      | Get product by ID                |
| PUT    | `/api/products/:id`                         | JWT       | Update product                   |
| DELETE | `/api/products/:id`                         | JWT       | Delete product                   |
| POST   | `/api/products/decrease-stock`              | None      | Decrease product stock           |
| GET    | `/api/products/product-counts-by-brand`     | None      | Get product count per brand      |
| PATCH  | `/api/products/updateImage`                 | JWT       | Upload product images (max 5)    |

### Order Routes — `/api/orders`

> All order routes require JWT (`protect` middleware applied globally)

| Method | Endpoint                        | Auth       | Description                        |
|--------|---------------------------------|------------|------------------------------------|
| GET    | `/api/orders`                   | JWT        | Get orders (all for admin, own for user) |
| POST   | `/api/orders`                   | JWT        | Place a new order                  |
| GET    | `/api/orders/:id`               | JWT        | Get single order (admin or owner)  |
| DELETE | `/api/orders/:id`               | JWT        | Delete order (admin or owner)      |
| PATCH  | `/api/orders/:id/accepted`      | JWT+Admin  | Mark order as accepted             |
| PATCH  | `/api/orders/:id/rejected`      | JWT+Admin  | Mark order as rejected             |
| GET    | `/api/orders/status-report`     | JWT        | Order status aggregation report    |

### Featured Products Routes — `/api/featuredproducts`

| Method | Endpoint                | Auth | Description                   |
|--------|-------------------------|------|-------------------------------|
| GET    | `/api/featuredproducts` | None | Get featured product list      |

### Contact Routes — `/api/contacts`

| Method | Endpoint                              | Auth      | Description                        |
|--------|---------------------------------------|-----------|------------------------------------|
| POST   | `/api/contacts`                       | None      | Submit contact form                |
| GET    | `/api/contacts`                       | JWT+Admin | Get all contact messages           |
| GET    | `/api/contacts/:id`                   | JWT+Admin | Get single contact message         |
| PATCH  | `/api/contacts/:id/status`            | JWT+Admin | Update contact status              |
| POST   | `/api/contacts/:id/reply`             | JWT+Admin | Reply to contact (sends email)     |
| DELETE | `/api/contacts/:id`                   | JWT+Admin | Delete contact message             |

---

## 18. Database Models

### User Model
```
User {
  fullName:             String (required)
  email:                String (required, unique, validated)
  username:             String (required, unique)
  password:             String (required, min 8, bcrypt hashed)
  passwordConfirm:      String (required, must match)
  phone:                String (required)
  gender:               Enum: ['male', 'female']
  role:                 Enum: ['user', 'admin'] (default: user)
  image:                String (base64 or URL, has default avatar)
  address:              [AddressSchema]
  orders:               [ObjectId → Order]
  carts:                [ObjectId → Product]
  createdAt:            Date (auto)
  passwordChangedAt:    Date
  passwordResetToken:   String (hashed)
  passwordResetExpires: Date
}

AddressSchema {
  street1: String (required)
  street2: String
  city:    String (required)
  state:   String (required)
  country: String (required)
  zip:     String (required)
}
```

### Product Model
```
Product {
  name:     String (required, unique, 3–100 chars)
  price:    Number (required, ≥ 0)
  desc:     String (default: 'No description provided')
  stock:    Integer (required, ≥ 0)
  images:   [String] (URLs or base64)
  brand:    String (required)
  category: String (required)
  size:     [String] (required, enum: S/M/L/XL/XXL)
  colors:   [String] (min 1, hex color codes)
}
```

### Order Model
```
Order {
  date:       Date (default: now)
  user:       ObjectId → User (required)
  address:    { street: String, city: String, zip: String }
  products:   [ObjectId → Product] (repeated for qty)
  totalPrice: Number (required)
  status:     Enum: ['pending', 'accepted', 'rejected'] (default: pending)
}
```

### Contact Model
```
Contact {
  name:         String (required, min 2)
  email:        String (required)
  category:     Enum: delivery/support/orders/careers/partnership/feedback/other
  message:      String (required, min 10)
  status:       Enum: ['new', 'read', 'replied', 'archived'] (default: new)
  adminReply:   String
  repliedAt:    Date
  createdAt:    Date (auto)
}
```

### FeaturedProducts Model
```
FeaturedProducts {
  // Stores references or data for homepage featured items
}
```

---

## 19. Security

| Security Measure            | Implementation                                              |
|-----------------------------|------------------------------------------------------------|
| **Password Hashing**        | `bcrypt` with salt rounds of 12                            |
| **JWT Authentication**      | `jsonwebtoken` — signed with `JWT_SECRET`, configurable expiry |
| **Role-Based Access**       | `restrictTo(...roles)` middleware for admin-only routes     |
| **Token Validation**        | Token decoded & user re-fetched from DB on every request    |
| **Password Change Detection**| `changePasswordAfter` method invalidates old tokens        |
| **Password Reset Tokens**    | Crypto `sha256` hash, stored hashed, expires in 10 minutes |
| **Input Validation**        | Mongoose schema validators + `validator` library            |
| **File Size Limits**        | Multer limits uploads to 5 MB per file                      |
| **CORS**                    | Enabled via `cors` middleware                               |
| **Error Handling**          | Global Express error handler + `catchAsync` wrapper         |
| **Route Guards (Angular)**  | `canActivate` guards on all protected client routes         |

---

## 20. Running the Project

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- pnpm (server) + npm (client)

### Server Setup
```bash
cd server

# Copy and fill environment variables
cp .env.example .env
# Required: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, EMAIL_*, PORT

# Install dependencies
pnpm install

# Seed the database (optional — populates 60+ products, 11 users, sample orders)
npm run seed

# Start in development mode (with nodemon auto-restart)
npm run dev

# Start in production mode
npm start

# Run tests
npm test
```

### Client Setup
```bash
cd client

# Install dependencies
npm install

# Start development server (http://localhost:4200)
npm start

# Build for production
npm run build
```

### Environment Variables (`.env`)
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/ecomart
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=your_mailtrap_user
EMAIL_PASSWORD=your_mailtrap_password
```

### Default Seed Accounts
| Username  | Password      | Role  |
|-----------|---------------|-------|
| `admin`   | `Admin@1234`  | Admin |
| `krish`   | `12345678`    | User  |
| `johnsmith` | `User@1234` | User  |
| `sarahj`  | `User@1234`   | User  |
| *(+ 7 more regular users)* | | |

---

## 📋 Angular Components Reference

### Layout Pages (`/layouts`)
| Component                   | Route                  | Description                         |
|-----------------------------|------------------------|-------------------------------------|
| `HomeComponent`             | `/` or `/home`         | Landing page                        |
| `CatalogComponent`          | `/catalog`             | Product listing page                |
| `ProductOverviewComponent`  | `/product-overview/:id`| Single product detail page          |
| `LoginComponent`            | `/login`               | Login page                          |
| `SignupComponent`           | `/signup`              | Registration page                   |
| `ForgotPasswordComponent`   | `/forget-password`     | Password reset request              |
| `ResetPasswordComponent`    | `/reset-password`      | New password form                   |
| `ProfileComponent`          | `/profile`             | Profile shell with nested routes    |
| `CheckOutComponent`         | `/check-out`           | Order checkout page                 |
| `ContactUsComponent`        | `/contact-us`          | Public contact form                 |
| `AboutUsComponent`          | `/about-us`            | About the company                   |
| `AccountComponent`          | `/account`             | Account management shell            |

### Shared Components (`/components`)
| Component                      | Purpose                                     |
|--------------------------------|---------------------------------------------|
| `NavbarComponent`              | Top navigation bar with cart icon & auth    |
| `FooterComponent`              | Site footer                                 |
| `SidebarComponent`             | Admin dashboard sidebar nav                 |
| `ProductCardComponent`         | Reusable product card for catalog           |
| `ProductDialogComponent`       | Product quick-view dialog                   |
| `ProductFormComponent`         | Admin: Add new product form                 |
| `ProductEditFormComponent`     | Admin: Edit existing product form           |
| `CartComponent`                | Cart page view                              |
| `OrderHistoryComponent`        | User's order list                           |
| `OrderDetailComponent`         | Single order breakdown                      |
| `ProfileInformationComponent`  | User profile info view                      |
| `EditProfileComponent`         | User profile edit form                      |
| `ManageAddressComponent`       | Address book management                     |
| `ChangePasswordComponent`      | Password change form                        |
| `WishlistComponent`            | Saved items wishlist                        |
| `AdminDashboardComponent`      | Admin dashboard shell / layout              |
| `OverviewComponent`            | Admin dashboard summary stats               |
| `AccountsOverviewComponent`    | Admin user management table                 |
| `OrdersOverviewComponent`      | Admin orders management table               |
| `ProductsOverviewComponent`    | Admin products management table             |
| `ContactsOverviewComponent`    | Admin contact messages viewer               |
| `AdminProfileComponent`        | Admin own profile view/edit                 |
| `AdminSettingsComponent`       | Admin settings panel                        |
| `UserFormComponent`            | Admin: Create/Edit user form                |
| `UserDeletionConfirmationComponent` | Admin: Delete user confirmation dialog |
| `AddressComponent`             | Address form sub-component                  |
| `DeliveryComponent`            | Checkout delivery section                   |
| `PaymentComponent`             | Checkout payment section                    |
| `ReviewComponent`              | Checkout review section                     |
| `LoadingSpinnerComponent`      | Global loading indicator                    |

### Angular Services (`/services`)
| Service                    | Purpose                                          |
|----------------------------|--------------------------------------------------|
| `ProductService`           | HTTP calls for all product CRUD operations       |
| `OrderService`             | HTTP calls for order creation, retrieval         |
| `UserService`              | HTTP calls for profile, cart, admin user ops     |
| `ProfileService`           | HTTP calls for profile read/update               |
| `ContactService`           | HTTP calls for contact form submissions          |
| `CountService`             | Track/share cart count across components         |
| `LocalStorageService`      | Helper to manage JWT + user data in localStorage |
| `IsLoggedService`          | Route guard — checks login state                 |
| `IsNotLoggedService`       | Route guard — blocks to logged-out users         |
| `IsAdminService`           | Route guard — checks admin role                  |
| `IsUserService`            | Route guard — checks user role                   |
| `CardIsNotEmptyService`    | Route guard — blocks empty-cart checkout         |

---

*Documentation generated by Antigravity — AI coding assistant.*
*Last updated: March 2026*
