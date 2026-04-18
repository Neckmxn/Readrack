import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIChat from './pages/AIChat';
import AllBooks from './pages/AllBooks';
import NewReleases from './pages/NewReleases';
import FreeBooks from './pages/FreeBooks';
import BookStore from './pages/BookStore';
import BookTools from './pages/BookTools';
import AskItOut from './pages/AskItOut';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  return currentUser && isAdmin ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <PrivateRoute>
              <AIChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-books"
          element={
            <PrivateRoute>
              <AllBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-releases"
          element={
            <PrivateRoute>
              <NewReleases />
            </PrivateRoute>
          }
        />
        <Route
          path="/free-books"
          element={
            <PrivateRoute>
              <FreeBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/book-store"
          element={
            <PrivateRoute>
              <BookStore />
            </PrivateRoute>
          }
        />
        <Route
          path="/book-tools"
          element={
            <PrivateRoute>
              <BookTools />
            </PrivateRoute>
          }
        />
        <Route
          path="/ask-it-out"
          element={
            <PrivateRoute>
              <AskItOut />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;