import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ProductDetails from "./pages/ProductDetails";
import UserPanel from "./pages/UserPanel";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";


import { CartProvider } from "./context/CartContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

import AxiosInterceptor from "./components/AxiosInterceptor";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AxiosInterceptor />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sweets/:id" element={<ProductDetails />} />
              <Route path="/account" element={
                <ProtectedRoute>
                  <UserPanel />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
