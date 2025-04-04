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
export const addExpense = (token, expenseData) => axios.post(`${API_URL}/expenses`, expenseData, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
