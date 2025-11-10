# **Needs Connect**  
### *Connecting Non-Profit Organizations to Volunteers and Donors*

---

### **From the Team at CIS**

**Needs Connect** is a platform designed to bridge the gap between **non-profit organizations**, **volunteers**, and **donors**.  
This project was submitted to **RIT's 15th Annual Engineering Competition (Software Engineering Category).**

---

### **Team Members**
- **Daniel Kinny**
- **Amritish Banerjee**
- **Syed Mohammad Hasan**

---

## 🚀 Tech Stack

| Area | Tools Used |
|------|------------|
| Frontend Framework | **Next.js**, **React**, **TypeScript** |
| Styling | **TailwindCSS**, **Heroicons**, **shadcn/ui** (Toaster Components) |
| Backend / Database | **MariaDB**, custom SQL queries, Next.js API Routes |
| UI Enhancements | **MUI** (Charts and Data Visualization) |

---

## ⚙️ Dependencies
Ensure the following are installed:
- `mariadb`
- `npm`
- `node`

---

## 🧑‍💻 How to Run the Application

```bash
# Clone the repository
git clone https://github.com/danielKinny/ritcs.git

# Navigate to project directory
cd ritcs

# Install dependencies
npm i

# Run development server
npm run dev
```

Environment Files

    Create a .env file containing the following:

```bash
DATABASE_HOST=localhost
DATABASE_USER=<your chosen database user>
DATABASE_PASS=<your chosen database password>
DATABASE_NAME=ritcs
```

🗄️ Database Setup

    Install MariaDB via Homebrew or your preferred package manager.

    Start SQL server and login:

```bash

mysql -u {your-username} -p

```

Create the database:

``` bash
    CREATE DATABASE ritcs;

    Run schema creation queries (provided in dbschema.sql).

    Insert sample data (provided in sampledata.sql).

```

🔐 Test Accounts
Role	Username	Password
Regular User	miraya1234	1234
Admin	admin	admin0214


🧱 Project Development Notes

A key challenge during development was version control, primarily caused by:

    Lack of a centralized database

    Each team member maintaining local, unsynchronized database instances

Our solution:

    Divide-and-conquer feature ownership

    Frequent voice calls to align development progress and schema state

# 🏛️ System Architecture

## Strengths, Features, and Benefits

| Feature | Strength | Benefit |
|---------|---------|--------|
| Reusable React Components | Scalability and maintainability | Makes UI easier to manage and extend |
| Normalized SQL Database | Efficient storage and secure data integrity | Reduces redundancy and ensures data consistency |
| Clear API Layer | Organized and predictable backend logic | Simplifies frontend-backend interaction |
| Role-Based Access Control | Secure and dynamic functionality per user type | Ensures users access only what they are allowed |

---

## 🔗 API Endpoints Overview

| Route | Method | Description |
|-------|--------|------------|
| `/basket` | GET | Get all items in a user's basket |
| `/basket` | POST | Add item to basket |
| `/basket` | DELETE | Remove item from basket |
| `/checkout` | POST | Finalize donation and clear basket |
| `/community` | GET | Fetch all community posts |
| `/community` | POST | Admin creates post |
| `/community` | DELETE | Admin deletes post |
| `/cupboard` | GET | Fetch admin-managed needs |
| `/cupboard` | POST | Admin creates need |
| `/cupboard` | PUT | Admin edits need |
| `/cupboard` | DELETE | Admin deletes need |
| `/impact` | GET | Returns data for visualization (donation metrics) |
| `/login` | POST | Authenticate user credentials |
| `/needs` | GET | Fetch and sort needs by priority algorithm |
| `/needs` | PUT | Admin closes a need |

---

## 🎯 MVP Feature Implementation

- ✅ Login / Logout


Simple credential validation via /login API route.
✅ Role-Based Access

    Implemented using React Context + custom hooks

    High-order components (HOCs) guard protected pages

✅ Helper User Interface

    Dashboard with priority needs overview + category charts

    Searchable and filterable Needs Page

    Interactive Basket + Checkout system

✅ Needs Management for Admins

    Create / Edit / Remove needs from the Cupboard Page

    All changes persist and update the database

✅ Data Persistence

    Strong SQL-based backend with normalization

    Data stays consistent and up-to-date across the app

⭐ Feature Enhancements

    Community Forum allows organizations to call volunteers for non-monetary tasks

    Priority Scoring Algorithm ranks needs based on:

        Remaining funding required

        Time sensitivity

        Category priority

        Days since posted

🏁 Summary

Needs Connect provides a scalable and efficient platform for organizations to receive support — whether financial or volunteer-based — while ensuring a seamless experience for users and administrators.