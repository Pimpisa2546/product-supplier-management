# Product & Supplier Management System

A simple, fast, and secure full-stack web application designed for managing inventory, master data, and suppliers.

---

## Live Demo

- **Frontend (Vercel):** [Visit Web App](https://product-supplier-management-three.vercel.app)
- **Backend (Render):** [Render API Service](https://product-supplier-management.onrender.com)

---

## Key Features

### Product Management
* Real-time Search: Filter and search products dynamically by name.
* Quick Details Preview: Inspect full product information, categories, hazard levels, and stock details in a popup modal without leaving the page.
* Master Data Tracking: Comprehensive cataloging for pricing, inventory levels, categories, hazard classifications, and stock velocities.

### Supplier Management
* Two-Step Form: Clean wizard interface separating company details from contact person information.
* Real-time Search: Search and filter suppliers dynamically by name.
* Quick Preview: View detailed contact information in a popup modal without changing pages.

### Security & Access Control
* JWT Authentication: Secure user login session with JSON Web Tokens.
* Role-Based Access: Protects pages and endpoints based on user roles.

---

## Tech Stack

* **Frontend:** React (TypeScript), Vite, Ant Design
* **Backend:** Go (Golang), Gin Framework, GORM
* **Database:** SQLite
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## Local Setup Guide

### 1. Run the Backend
cd backend
go run main.go

### 2. Run the Frontend
cd frontend
npm install
npm run dev
