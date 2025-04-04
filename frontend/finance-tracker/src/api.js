// src/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Your backend API URL

export const registerUser = (userData) => axios.post(`${API_URL}/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/login`, userData);

export const getExpenses = (token) => axios.get(`${API_URL}/expenses`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const addExpense = async (token, expenseData) => {
  const response = await axios.post(`${API_URL}/expenses`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Newly added expense:", response.data); 
  return response.data;
};

// Edit an existing expense
export const updateExpense = async (token, expenseId, expenseData) => {
  const response = await axios.put(`${API_URL}/expenses/${expenseId}`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete an expense
export const deleteExpense = async (token, expenseId) => await axios.delete(`${API_URL}/expenses/${expenseId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
