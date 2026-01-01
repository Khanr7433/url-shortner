import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RedirectHandler from './pages/RedirectHandler';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';

import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/admin" element={
              <RequireAuth role="admin">
                <AdminDashboard />
              </RequireAuth>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/:shortCode" element={<RedirectHandler />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
