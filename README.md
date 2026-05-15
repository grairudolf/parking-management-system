# Parking Management System
### OOP with Java — Group 14 | FET.CE

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Team Structure](#team-structure)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Setup Guide](#setup-guide)
6. [Running the Project](#running-the-project)
7. [How the Project is Connected](#how-the-project-is-connected)
8. [Git Workflow](#git-workflow)
9. [Naming Conventions](#naming-conventions)
10. [Responsibility Map](#responsibility-map)

---

## Project Overview

A full-stack Parking Management System that handles customer account creation, parking spot reservation, payment processing, receipt generation, entry and exit verification, and parking lot analytics.

**Tech Stack**

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Java + Spring Boot |
| Database | PostgreSQL |
| API | REST (JSON over HTTP) |

---

## Team Structure

| Role | Members | Task |
|---|---|---|
| Design | 1 | Google Stitch UI mockups |
| Models | 2 | Java class files from class diagram |
| Backend Logic | 3 | Controllers, Services, Repositories |
| Frontend | 2 | React pages and API connection |
| Database | 2 | PostgreSQL tables and testing |

---

## Folder Structure

```
parking-management-system/
|
+-- backend/
|   +-- src/main/java/com/parkingmanagement/
|   |   +-- models/             # Java classes (Customer, Reservation, etc.)
|   |   +-- controllers/        # API endpoints
|   |   +-- services/           # Business logic per use case
|   |   +-- repositories/       # Database operations
|   |
|   +-- src/main/resources/
|   |   +-- application.properties
|   |   +-- schema.sql
|   |
|   +-- pom.xml
|
+-- frontend/
|   +-- src/
|   |   +-- pages/              # One file per page
|   |   +-- components/         # Reusable UI pieces
|   |   +-- services/           # API call functions
|   +-- package.json
|   +-- tailwind.config.js
|
+-- database/
|   +-- schema.sql
|
+-- design/
|   +-- mockups/
|
+-- docs/
|   +-- technical_structure.pdf
|
+-- .gitignore
+-- README.md
```

---

## Prerequisites

### Everyone
- [Git](https://git-scm.com/downloads)
- A GitHub account

### Backend Team
- [VS Code](https://code.visualstudio.com/)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) 

### Frontend Team
- [Node.js LTS](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)

### Database Team
- [PostgreSQL](https://www.postgresql.org/download/)
- pgAdmin 4 (comes with PostgreSQL installer)

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/grairudolf/parking-management-system.git
cd parking-management-system
```

### 2. Backend Setup

Open the `backend/` folder in VS Code. VS Code will detect the Maven project and prompt you to install recommended extensions if you have not already. Once Java extentions are installed, Maven will automatically download dependecies form `pom.xml`.

Then open `src/main/resources/application.properties` and fill in your local database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/parking_management
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

Do not push this file with your real credentials.

### 3. Database Setup

Open pgAdmin, create a database called `parking_management`, then run the contents of `database/schema.sql` in the Query Tool.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Running the Project

Run both servers at the same time in two separate terminals.

**Terminal 1 — Backend**
```bash
cd backend
./mvnw spring-boot:run
```
Runs at: `http://localhost:8080`

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
Runs at: `http://localhost:3000`

---

## How the Project is Connected

```
React (port 3000)
    |
    | HTTP Request with JSON body
    |
Spring Boot (port 8080)
    |
    | SQL via JPA
    |
PostgreSQL (port 5432)
```

Example flow for Reserve Spot:
1. React sends POST to `http://localhost:8080/api/reservation/create`
2. Controller receives the request and calls the Service
3. Service checks availability and creates the reservation
4. Repository saves it to PostgreSQL
5. Controller returns `{ "success": true, "reservationID": "R123" }`
6. React displays the confirmation

---

## Git Workflow

Do not push directly to `main`.

```bash
# Step 1: Pull latest changes before starting
git pull origin main

# Step 2: Create your own branch
git checkout -b grairudolf/what-you-are-doing

# Step 3: Make changes then commit
git add .
git commit -m "Add Customer model class with attributes and getters"

# Step 4: Push your branch
git push origin grairudolf/what-you-are-doing

# Step 5: Open a Pull Request on GitHub and ask a teammate to review
```

**Branch naming format:** `grairudolf/feature-description`

Examples:
```
max/customer-model
pythagore/payment-service
emily/login-page
```

---

## Naming Conventions

**Java**
```java
// Classes: PascalCase
public class ParkingSpot { }

// Methods and variables: camelCase
private String spotNumber;
public String getSpotNumber() { }
```

**React**
```
// Component files: PascalCase
ReservationPage.jsx
LoginForm.jsx
```

**Database**
```sql
-- Tables and columns: snake_case
CREATE TABLE parking_spots (
    spot_id VARCHAR(50),
    is_available BOOLEAN
);
```

---

## Responsibility Map

| Name | Role | Files |
|---|---|---|
| [Name] | Design | design/mockups/ |
| [Name] | Models | Customer.java, Account.java, Vehicle.java |
| [Name] | Models | ParkingLot.java, ParkingSpot.java, Reservation.java, Payment.java, Receipt.java, Entry.java, Exit.java |
| [Name] | Backend Logic | AccountController, AccountService |
| [Name] | Backend Logic | ReservationController, ReservationService, PaymentController, PaymentService |
| [Name] | Backend Logic | ReceiptController, ExitController, EntryController, their Services |
| [Name] | Frontend | Login, Register, Reservation, Payment pages |
| [Name] | Frontend | Receipt, Entry/Exit, Analytics pages |
| [Name] | Database | schema.sql, database setup |
| [Name] | Database | Database testing and validation |

---

## Quick Checklist Before You Push

- [ ] Code compiles with no errors
- [ ] You are on your own branch, not main
- [ ] You have pulled the latest changes before starting
- [ ] No passwords or credentials in your code
- [ ] Commit message clearly describes what you did

---

If you are stuck for more than 30 minutes on the same problem, message the group.
