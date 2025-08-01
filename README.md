Cash App API – A lightweight Node.js & Express backend for the Cash App. Handles user authentication (JWT), and real-time financial tracking. Uses MongoDB with Mongoose for data persistence. Designed for scalability and ease of integration with mobile or web clients.

## 🧾 Auth Endpoints

| Method | Endpoint             | Description                          | Auth Required |
|--------|----------------------|--------------------------------------|----------------|
| POST   | /api/auth/register   | Register a new user                  | ❌ No          |
| POST   | /api/auth/login      | Log in and receive JWT token         | ❌ No          |
| GET    | /api/auth/me         | Get the logged-in user's profile     | ✅ Yes         |

---

## 💸 Transaction Endpoints

| Method | Endpoint                         | Description                                     | Auth Required |
|--------|----------------------------------|-------------------------------------------------|----------------|
| GET    | /api/transactions                | Fetch all user transactions                     | ✅ Yes         |
| GET    | /api/transactions/:id            | Fetch a specific transaction by ID              | ✅ Yes         |
| POST   | /api/transactions/expense        | Create a new **expense** transaction            | ✅ Yes         |
| POST   | /api/transactions/income         | Create a new **income** transaction             | ✅ Yes         |
| PUT    | /api/transactions/:id            | Update a specific transaction                   | ✅ Yes         |
| DELETE | /api/transactions/:id            | Delete a specific transaction                   | ✅ Yes         |
| GET    | /api/transactions/sum            | Get total income, expenses, and balance summary | ✅ Yes         |
