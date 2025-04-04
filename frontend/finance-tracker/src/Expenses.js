import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getExpenses, addExpense } from './api';
import { TextField, Button, Grid, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const { authState } = useAuth();
  const token = authState.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // If no token is found, redirect to login
      navigate('/login');
    } else {
      getExpenses(token).then((response) => setExpenses(response.data));
    }
  }, [token, navigate]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const expenseData = { category, amount, date };
    try {
      await addExpense(token, expenseData);
      setExpenses([...expenses, expenseData]);
      setCategory('');
      setAmount('');
      setDate('');
    } catch (error) {
      alert('Failed to add expense');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Add a New Expense
        </Typography>
        <form onSubmit={handleAddExpense}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date"
                variant="outlined"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Your Expenses
        </Typography>
        <List>
          {expenses.map((expense, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${expense.category}: $${expense.amount}`}
                secondary={`Date: ${expense.date}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Expenses;
