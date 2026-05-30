import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'

// Pages
import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import AIChat        from './pages/AIChat'
import AllBooks      from './pages/AllBooks'
import NewReleases   from './pages/NewReleases'
import FreeBooks     from './pages/FreeBooks'
import BookStore     from './pages/BookStore'
import BookAnalyzer  from './pages/BookAnalyzer'
import AskItOut      from './pages/AskItOut'
import AboutUs       from './pages/AboutUs'
import ContactUs     from './pages/ContactUs'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route
  path="/login"
  element={
    <div style={{ color: 'white', padding: '50px', fontSize: '30px' }}>
      LOGIN PAGE TEST
    </div>
  }
/>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index              element={<Dashboard />} />
        <Route path="chat"        element={<AIChat />} />
        <Route path="books"       element={<AllBooks />} />
        <Route path="new-releases" element={<NewReleases />} />
        <Route path="free-books"  element={<FreeBooks />} />
        <Route path="store"       element={<BookStore />} />
        <Route path="analyzer"    element={<BookAnalyzer />} />
        <Route path="ask-it-out"  element={<AskItOut />} />
        <Route path="about"       element={<AboutUs />} />
        <Route path="contact"     element={<ContactUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13,27,64,0.95)',
              color: '#f1f5f9',
              border: '1px solid rgba(59,130,246,0.3)',
              backdropFilter: 'blur(12px)'
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}