import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/expenses');  // Redirect to expenses page after login
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginBottom: 2 }}
        >
          Login
        </Button>
      </form>
      <Typography variant="body2" sx={{ textAlign: 'center', color: '#FF5733' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ textDecoration: 'none', color: '#1E40AF' }}>
          Register here
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
