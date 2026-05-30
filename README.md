# Multi-Role Store Rating & Analytics System (PERN Stack)     

A secure, full-stack web application designed for a multi-tier store rating platform. Built using the **PERN stack** (PostgreSQL, Express.js, React, Node.js), this system features comprehensive Role-Based Access Control (RBAC) separated into three distinct corporate portals: System Administrators, Store Owners and Normal Users.
   
# Demo
<img width="1256" height="710" alt="Screenshot from 2026-05-21 23-11-49" src="https://github.com/user-attachments/assets/d5e30fd1-2588-42c4-a3dc-5e0351e15f2a" />

<img width="1256" height="710" alt="Screenshot from 2026-05-21 23-12-40" src="https://github.com/user-attachments/assets/60094583-8b57-4606-8f1e-aa22570391ae" />
                  


## System Architecture

The application enforces strict data validation loops at both frontend and backend layers, securing resource endpoints via JSON Web Tokens (JWT) and custom middleware routing guards.

[ React Frontend ]  ---> ( JWT Auth / Role Guards ) ---> [ Express API Server ] ---> [ PostgreSQL Database ]

## Key Functional Features 
 1. System Administrator Features 
* Analytics Dashboard: Visualizes system-wide mathematical metric totals (Total Users, Registered Stores, Submitted Feedback Logs) processed in parallel.

* User Provisioning: Create administrative accounts, business store owners or normal customers using deterministic password validation constraints.

* Dynamic Data Inventory: View, filter and column-sort deep directories of system users and stores using structured server-side SQL query compilation.

 2. Store Owner Features
* Performance Metrics: Real-time stream monitoring of the store's mathematically aggregated global average rating.

* Customer Feedback Log: Clean operational table mapping consumer analytics (reviewer name, email, physical address, star value and exact modification timestamps).

* Account Governance: Secure independent account password update functionality matching enterprise length and character parameters.

 3. Normal User Features
* Marketplace Directory: Browse all registered business establishments showing real-time community scores alongside the user's historical star allocations.

* Fuzzy Search Engine: Filter local directory arrays simultaneously via Store Name strings or physical location addresses.

* Atomic Rating Engine (SQL Upsert): Submit or update star reviews (1-5 scales) running on an atomic database ON CONFLICT DO UPDATE pipeline.

## Technology Stack Used
* Frontend: React.js (Vite Engine), React Router DOM (v6), Axios (Interceptors Hook) 
* Backend: Node.js, Express.js, JWT (jsonwebtoken), bcryptjs
* Database: PostgreSQL (Relational Pooling Engine)

## Directory Scaffolding
### Project Directory Structure

```text
store-rating-app/
├── backend/
│   ├── config/            # Database Connection Pool Configuration
│   ├── middleware/        # Authorization & Data Validation Enclaves
│   ├── routes/            # Isolated Express API Routes
│   ├── server.js          # Core Server Entrypoint
│   └── .env               # Server Environment Context Configurations
└── frontend/
    ├── src/
    │   ├── components/    # Reusable Protective Route Elements
    │   ├── context/       # Global Authentication Hook Engine
    │   ├── pages/         # Segmented Role Views (Admin, Owner, User)
    │   ├── api.js         # Base Axios Interceptor Bridge Config
    │   └── main.jsx       # Global Wrapper Mounting Core
    
```

## Installation & Local Environment Setup
### Prerequisites 
* Node.js (v18+)
* PostgreSQL (v14+) running locally

1. Database Initialization
   Create a fresh PostgreSQL database instance on your machine.
2. Backend Server Configuration
   * Navigate into the backend directory.
   * Install dependencies.
   * Create a .env file based on .env.example and supply your database credentials.
   * Launch the local development server.
3. Frontend Client Configuration
   * Navigate into the frontend directory.
   * Install dependencies.
   * Launch the Vite build runtime engine.
   
## System Constraints Enforced
* Name Bounds: Input strings musts contain between 20 and 60 alphanumeric characters.

* Address Bounds: Text areas strictly cut off data vectors exceeding 400 characters max.

* Password Complexity: Values are limited to 8-16 characters and must contain at least one uppercase letter and one special character string ([^a-zA-Z0-9]).

