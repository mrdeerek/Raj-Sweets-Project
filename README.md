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
3. Create a `.env` file (if not present) with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sweetshop
   JWT_SECRET=SECRET_KEY
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Run tests:
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

**AI Tools Used**: Google DeepMind Antigravity (powered by Gemini models).

**Usage Details**:
- **Backend Architecture**: Used AI to generate the initial structure and unit tests for the backend API, strictly following TDD principles.
- **Debugging**: Utilized AI to identify mocks issues in `auth.test.ts` where `findOne` was returning false positives.
- **Frontend Design**: Leveraged AI to generate a complete "Amazon-like" CSS design system, including color palettes, card components, and responsive layouts.
- **Refactoring**: Used AI to refactor the React application to use `react-router-dom` and `Context API` for better state management.
- **Search Logic**: AI assisted in writing the MongoDB regex queries for the search functionality.

**Reflection**:
AI significantly accelerated the boilerplate setup and frontend styling, allowing more time to focus on business logic and testing correctness. The co-authorship model ensured that every AI-generated block was reviewed and verified (e.g., fixing the failing tests).

## Screenshots
*(Insert screenshots of Dashboard, Login, and Admin Panel here)*
