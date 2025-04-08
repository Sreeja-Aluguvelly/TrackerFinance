import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, password };
    try {
      await register(userData);
      navigate('/login');  // Redirect to login page after successful registration
    } 
    catch (error) {
        alert(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Register</Typography>
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
          Register
        </Button>
      </form>
      <Typography variant="body2" sx={{ textAlign: 'center', color: '#FF5733' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ textDecoration: 'none', color: '#1E40AF' }}>
          Login here
        </Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
