# Growcery – Multi‑Vendor Produce Marketplace (Laravel + React)

## Overview 
**Growcery** is a multi-vendor e-commerce platform for fresh produce, built with a Laravel back-end and a React front-end (via Inertia.js). It connects customers with local produce vendors, similar to marketplaces like Shopee or Lazada, but tailored for agricultural goods. The system uses **role-based authentication** with distinct portals for **Admin**, **Vendor**, and **Customer** users. Customers can browse products, manage a cart, and view orders, while vendors have dashboards to manage products and orders, and admins oversee the entire platform. The interface is mobile-first and styled with Tailwind CSS for a clean, responsive user experience.

## Technology Stack 
- **Laravel** – PHP web framework (v12.x)
- **React** – JavaScript UI library (v18)
- **Inertia.js** – Monolithic SPA approach
- **MySQL** – Database (via XAMPP)
- **Tailwind CSS** – For responsive UI
- **Vite** – For asset bundling and dev server

## Installation – Local Setup with XAMPP

### Prerequisites 
- XAMPP with PHP 8.2+ and MySQL
- Composer
- Node.js and npm (v16+ recommended)
- Git (optional)

### Setup Steps

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/whiskey00/growcery.git
   cd growcery
   ```

2. **Start XAMPP Services** (MySQL and optionally Apache)

3. **Install PHP Dependencies**  
   ```bash
   composer install
   ```

4. **Environment Setup**  
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Edit `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=growcery
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Create the Database**  
   Use phpMyAdmin or MySQL CLI to create a `growcery` database.

6. **Run Migrations**  
   ```bash
   php artisan migrate
   ```

7. **Install Front-end Dependencies**  
   ```bash
   npm install
   ```

8. **Run Dev Servers**  
   ```bash
   npm run dev    # Frontend/Vite dev server
   php artisan serve  # Laravel backend
   ```

Visit the app at [http://localhost:8000](http://localhost:8000)

## Common Issues

- `.env` not set or key missing → Run `php artisan key:generate`
- DB connection error → Check MySQL is running and `.env` is correct
- Port 8000 in use → Use `php artisan serve --port=8001`
- Apache issues → Ensure mod_rewrite is enabled and public/ is the doc root
- Front-end not updating → Ensure `npm run dev` is running

## Notes

- This is a monolithic Laravel + React SPA using Inertia.
- Use `npm run build` for production builds.
- Apache setup: place the project in `htdocs`, point doc root to `/public`.

---

Enjoy developing Growcery locally!