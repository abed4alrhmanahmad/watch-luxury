# ChronoLux — Luxury Watch E-Commerce

A full-stack e-commerce platform for luxury watches, built with **Django REST Framework** (backend) and **React + TypeScript** (frontend).

---

## Tech Stack

| Layer      | Technologies                                                                 |
|------------|------------------------------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, Axios     |
| Backend    | Django 5, Django REST Framework, Simple JWT, django-cors-headers             |
| Database   | MySQL (MariaDB via XAMPP)                                                    |
| Auth       | JWT (access + refresh tokens)                                                |

---

## Project Structure

```
watchLuxury1/
├── backend/          # Django project
│   ├── accounts/     # User authentication & profile
│   ├── store/        # Products & categories
│   ├── cart/         # Shopping cart
│   ├── orders/       # Order management
│   ├── contact/      # Contact form
│   ├── wishlist/     # Wishlist
│   ├── coupons/      # Discount coupons
│   ├── admin_api/    # Admin dashboard API
│   └── chronolux/    # Django settings & URLs
├── frontend/         # React application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── contexts/
│       ├── services/
│       ├── store/
│       └── types/
└── database/
    └── schema.sql    # Full database schema + seed data
```

---

## Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- XAMPP (or any MySQL/MariaDB server)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/abed4alrhmanahmad/watch-luxury.git
cd watch-luxury
```

---

### 2. Database Setup

1. Start **XAMPP** and make sure **Apache** and **MySQL** are running.
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`.
3. Create a new database named `chronolux_db`:
   ```sql
   CREATE DATABASE chronolux_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Import the full schema and seed data:
   - Click on `chronolux_db` → **Import** tab → choose `database/schema.sql` → click **Go**.

   Or via MySQL CLI:
   ```bash
   mysql -u root -p chronolux_db < database/schema.sql
   ```

The `schema.sql` file includes:
- All table definitions (via Django migrations output)
- Sample products, categories, and an admin user
- Admin credentials: `admin@chronolux.com` / set your own password via Django admin

---

### 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv ../.venv

# Windows
..\.venv\Scripts\activate

# macOS / Linux
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your local environment file
cp .env.example .env
# Edit .env with your database credentials (see Environment Variables section)

# Run migrations (only needed if NOT using schema.sql import)
python manage.py migrate

# (Optional) Create a superuser for Django admin
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/api/`.

Django admin panel: `http://127.0.0.1:8000/admin/`

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your local environment file
cp .env.example .env
# Edit .env if needed (default API URL points to localhost:8000)

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Environment Variables

### `backend/.env`

| Variable               | Default                              | Description                              |
|------------------------|--------------------------------------|------------------------------------------|
| `SECRET_KEY`           | *(required)*                         | Django secret key — generate a new one  |
| `DEBUG`                | `True`                               | Set to `False` in production             |
| `ALLOWED_HOSTS`        | `localhost,127.0.0.1`                | Comma-separated allowed hosts            |
| `DB_NAME`              | `chronolux_db`                       | MySQL database name                      |
| `DB_USER`              | `root`                               | MySQL username                           |
| `DB_PASSWORD`          | *(empty)*                            | MySQL password                           |
| `DB_HOST`              | `127.0.0.1`                          | MySQL host                               |
| `DB_PORT`              | `3306`                               | MySQL port                               |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...`          | Comma-separated allowed frontend origins |

Generate a new Django secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### `frontend/.env`

| Variable        | Default                       | Description              |
|-----------------|-------------------------------|--------------------------|
| `VITE_API_URL`  | `http://127.0.0.1:8000/api`  | Django backend API URL   |

---

## API Endpoints

| Method | Endpoint                          | Description                  |
|--------|-----------------------------------|------------------------------|
| POST   | `/api/auth/register/`             | Register a new user          |
| POST   | `/api/auth/login/`                | Login (returns JWT tokens)   |
| POST   | `/api/auth/token/refresh/`        | Refresh access token         |
| GET    | `/api/auth/profile/`              | Get current user profile     |
| GET    | `/api/products/`                  | List products (filterable)   |
| GET    | `/api/products/<id>/`             | Product detail               |
| GET    | `/api/products/categories/`       | List categories              |
| GET    | `/api/cart/`                      | View cart                    |
| POST   | `/api/cart/add/`                  | Add item to cart             |
| DELETE | `/api/cart/items/<id>/`           | Remove cart item             |
| POST   | `/api/orders/create/`             | Create order from cart       |
| GET    | `/api/orders/`                    | List user orders             |
| POST   | `/api/contact/`                   | Submit contact form          |
| GET    | `/api/wishlist/`                  | View wishlist                |
| POST   | `/api/wishlist/add/`              | Add to wishlist              |

---

## Default Admin Account

After importing `database/schema.sql`, an admin account is included:

- **Email:** `admin@chronolux.com`
- **Password:** Set via `python manage.py changepassword admin@chronolux.com`  
  *(the imported password hash is for demo only — reset it before use)*

---

## Running Both Servers

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && ../.venv/Scripts/activate && python manage.py runserver

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Build for Production

```bash
# Frontend
cd frontend && npm run build
# Output is in frontend/dist/

# Backend static files
cd backend && python manage.py collectstatic
```
