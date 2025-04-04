import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getExpenses, addExpense, updateExpense, deleteExpense } from './api';
import { TextField, Button, Grid, Typography, Paper, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);



  const { authState } = useAuth();
  const token = authState.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      getExpenses(token).then((response) => {
        console.log("Expenses API Response:", response.data);
        setExpenses(response.data);
      }).catch(error => {
        console.error("Failed to fetch expenses:", error);
      });
    }
  }, [token, navigate]);

  const handleAddOrEditExpense = async (e) => {
    e.preventDefault();
    const expenseData = { category, amount, date };
  
    try {
      if (editingId) {
        // If editing an existing expense, just update the amount with the new value
        const updatedExpenseData = {
          ...expenseData,
          amount: parseFloat(amount), // Replace the amount, don't add to it
        };
  
        // Call the API to update the backend with the new data
        await updateExpense(token, editingId, updatedExpenseData);
  
        // Update the local state with the new data
        setExpenses(expenses.map(exp =>
          exp.id === editingId ? { ...exp, ...updatedExpenseData } : exp
        ));
  
        // Reset the form and state
        setCategory('');
        setAmount('');
        setDate('');
        setEditingId(null); // Reset the editing state
      } else {
        // Handle adding a new expense as usual
        const existingExpense = expenses.find(exp => exp.category === category);
  
        if (existingExpense) {
          // If the category already exists, update the amount (add the new one)
          const updatedExpenseData = {
            ...existingExpense,
            amount: existingExpense.amount + parseFloat(amount),
            date: date,
          };
  
          // Update the backend with the new data
          await updateExpense(token, existingExpense.id, updatedExpenseData);
  
          // Update the local state
          setExpenses(expenses.map(exp =>
            exp.id === existingExpense.id ? { ...exp, ...updatedExpenseData } : exp
          ));
        } else {
          // Add a new expense if the category doesn't exist
          const response = await addExpense(token, expenseData);
          setExpenses([...expenses, response.data]);
        }
  
        // Reset the form fields
        setCategory('');
        setAmount('');
        setDate('');
      }
    } catch (error) {
      alert('Failed to process expense');
    }
  };
  
  
  const handleEditClick = (expense) => {
    setEditingId(expense.id);
    setCategory(expense.category);
    setAmount(expense.amount);
    setDate(expense.date);
  };
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(token, id);
        setExpenses(expenses.filter(exp => exp.id !== id));
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
        {editingId ? 'Edit Expense' : 'Add a New Expense'}
        </Typography>
        <form onSubmit={handleAddOrEditExpense}>
          <Grid container spacing={2}>
            {/* Category Field - Expanded */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel shrink>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  displayEmpty
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '56px', // Matching TextField height
                    },
                  }}
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  <MenuItem value="Food & Dining">Food & Dining</MenuItem>
                  <MenuItem value="Housing">Housing</MenuItem>
                  <MenuItem value="Transportation">Transportation</MenuItem>
                  <MenuItem value="Health & Wellness">Health & Wellness</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Savings & Investments">Savings & Investments</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Amount Field */}
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

            {/* Date Field */}
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
              {editingId ? 'Update Expense' : 'Add Expense'}
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
          {expenses.map((expense) => (
            <ListItem key={expense.id} secondaryAction={
              <>
                <IconButton onClick={() => handleEditClick(expense)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(expense.id)} color="secondary">
                  <Delete />
                </IconButton>
              </>
            }>
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
