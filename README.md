# Growcery – Multi-Vendor Produce Marketplace

Growcery is a Laravel + Inertia.js powered e-commerce platform that connects customers with local produce vendors. Inspired by platforms like Shopee and Lazada, Growcery is tailored for fresh market goods and agricultural commerce.

## Live Preview
Coming soon...

## Features

### General
- Role-based authentication (admin, vendor, customer)
- Responsive user interface using Tailwind CSS
- Mobile-first layout and clean design
- Shared layout components for consistency

### Customer Capabilities
- Browse products by category
- Integrated search functionality
- Product detail and cart-ready buttons
- Checkout interface (to be implemented)
- Order history with status filtering
- Profile management and dashboard overview

### Vendor Capabilities (In Development)
- Vendor dashboard
- Product CRUD operations
- Order management

### Admin Capabilities
- User management interface
- Product and category administration
- System-wide order monitoring

## Folder Structure

```
resources/js/
├── Layouts/
│   ├── CustomerLayout.jsx
│   ├── AdminLayout.jsx
├── Pages/
│   ├── Auth/
│   ├── Customer/
│   ├── Admin/
│   ├── Landing.jsx
│   ├── Products/
│   └── Dashboard.jsx
```

## Technology Stack

- Laravel 10+
- Inertia.js (React)
- Tailwind CSS
- MySQL / SQLite
- Vite (for development)

## Getting Started

To run the project locally:

```bash
git clone https://github.com/whiskey00/growcery.git
cd growcery

# Backend setup
composer install
cp .env.example .env
php artisan key:generate

# Frontend setup
npm install
npm run dev

# Database setup
php artisan migrate
```

## Roadmap

- [x] Customer dashboard and navigation
- [x] Product browsing with search
- [x] Order list and details UI
- [x] Full cart and checkout process
- [x] Vendor management tools
- [x] Order lifecycle and payment integration

## Contribution

Contributions and feedback are welcome. Fork the repository, create a feature branch, and submit a pull request.

## License

This project is open-source and available under the MIT License.
