import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Expenses from './Expenses';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage';
import Chatbot from './Chatbot';

const Navbar = () => {
  const { authState, logout } = useAuth();
  const isAuthenticated = !!authState.token;
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1E40AF' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Finance Tracker</Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          ) : (
            <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/expenses">Expenses</Button>
            <Button color="inherit" component={Link} to="/chatbot">Chat</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Box sx={{ backgroundColor: '#1E40AF', minHeight: '100vh', color: 'white', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
