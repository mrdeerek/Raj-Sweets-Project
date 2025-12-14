# Sweet Shop Management System

A full-stack Sweet Shop Management System built with the MERN stack (MongoDB, Express, React, Node.js), featuring a modern, Amazon-inspired user interface.

## Features

- **User Authentication**: Secure registration and login using JWT.
- **Product Catalog**: Browse and search sweets with a rich grid layout and "Amazon-like" design.
- **Search**: Real-time search by name or category.
- **Shopping**: Purchase sweets (updates stock in real-time).
- **Admin Panel**: Add new sweets to the inventory.
- **Responsive Design**: Fully responsive UI with a modern aesthetic (Inter font, sleek shadows).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Jest (TDD).
- **Frontend**: React 19, Vite, React Router, Context API, Modern CSS.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a connection string)

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the link provided (usually `http://localhost:5173`).

## My AI Usage

**AI Tools Used**: ChatGpt,Google Gemini.

**Usage Details**:
- **Backend Architecture**: Used AI to generate the initial structure and unit tests for the backend API, strictly following TDD principles.
- **Debugging**: Utilized AI to identify mocks issues in `auth.test.ts` where `findOne` was returning false positives.
- **Frontend Design**: Leveraged AI to generate a complete "Amazon-like" CSS design system, including color palettes, card components, and responsive layouts.
- **Refactoring**: Used AI to refactor the React application to use `react-router-dom` and `Context API` for better state management.
- **Search Logic**: AI assisted in writing the MongoDB regex queries for the search functionality.

**Reflection**:
AI significantly accelerated the boilerplate setup and frontend styling, allowing more time to focus on business logic and testing correctness. The co-authorship model ensured that every AI-generated block was reviewed and verified (e.g., fixing the failing tests).

## Screenshots
*(Insert screenshots of Dashboard, Login, and Admin Panel etc here)*


DASHBOARD
<img width="1899" height="866" alt="Screenshot 2025-12-14 203652" src="https://github.com/user-attachments/assets/374b6c9a-aa6c-4def-ba9a-d501f61f9de7" />



LOGIN
<img width="1899" height="882" alt="Screenshot 2025-12-14 203617" src="https://github.com/user-attachments/assets/3bc5a9bb-f5bc-4de6-90c3-594880f5ed0b" />



ADMIN PANNEL
<img width="1906" height="589" alt="Screenshot 2025-12-14 203736" src="https://github.com/user-attachments/assets/02f7aeab-2748-42f5-adcf-508ffd3afd47" />

<img width="1902" height="867" alt="Screenshot 2025-12-14 205945" src="https://github.com/user-attachments/assets/4af3ae9f-b074-48c4-be32-35765cb26924" />



ADDING PRODUCT
<img width="953" height="736" alt="Screenshot 2025-12-14 204411" src="https://github.com/user-attachments/assets/db8b7ebf-eaf7-4606-afd6-2dc15fdfb679" />

<img width="1910" height="849" alt="Screenshot 2025-12-14 203753" src="https://github.com/user-attachments/assets/bb6ed0c0-69ef-4066-b801-972a50822f78" />



USER ORDER
<img width="1918" height="865" alt="Screenshot 2025-12-14 203928" src="https://github.com/user-attachments/assets/625eeb4e-d525-4872-a189-4ce30c571152" />

<img width="1902" height="873" alt="Screenshot 2025-12-14 203944" src="https://github.com/user-attachments/assets/1d6c20b9-0b8d-4823-9c36-c20197e2c027" />



USER DASHBOARD
<img width="1901" height="805" alt="Screenshot 2025-12-14 210136" src="https://github.com/user-attachments/assets/873224d0-20dc-41a9-ad6e-f9520e229d22" />




SHOPPING CART
<img width="1898" height="876" alt="Screenshot 2025-12-14 203856" src="https://github.com/user-attachments/assets/20bb93af-1a8d-41e4-9735-256e4d471ddb" />


## 🧠 Test-Driven Development (TDD)

This project strictly follows **Test-Driven Development (TDD)** principles:

- 🔴 **Red** – Write failing tests first  
- 🟢 **Green** – Implement the minimum logic to pass tests  
- 🔵 **Refactor** – Improve code quality and structure  

📌 The commit history clearly reflects the **Red → Green → Refactor** workflow.

---

## 🎯 Future Improvements

Planned enhancements for upcoming versions:

- 💳 Payment Gateway Integration  
- 📦 Order Status Tracking (Delivered / Cancelled)  
- 📊 Admin Analytics Dashboard  
- 📧 Email Notifications  
- 🔍 Advanced Search & Filters  

---

## 👤 Author

**Kunal Raj**  
🎓 B.E. Student | Full Stack Developer  
📍 Chandigarh University  

### 💻 Skills
- MERN Stack  
- TypeScript  
- Java  
- SQL  

---

## ⭐ Final Notes

- ✅ Fully original implementation  
- 🤖 AI-assisted but **human-validated**  
- 🧱 Clean architecture & scalable design  
- 🚀 Production-ready deployment  

👉 **Live Application:**  
🔗 https://raj-sweets-project-3fly.vercel.app/

