import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss';

// Layout
import MainLayout from './components/Layout/MainLayout';
import AuthGuard from './components/AuthGuard/AuthGuard';

// Features
import Login from './features/Login/Login';
import Users from './features/Users/Users';
// Import other feature components as needed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<Users />} />
            {/* Add other protected routes as needed */}
            <Route path="*" element={<div>Page not found</div>} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} aria-label="Toast notifications" />
    </BrowserRouter>
  );
}

export default App;
