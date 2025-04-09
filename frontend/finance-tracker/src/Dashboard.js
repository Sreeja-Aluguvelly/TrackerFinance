// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { getExpenses } from './api';
import { useAuth } from './AuthContext';
import { Paper, Grid, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const { authState } = useAuth();
  const token = authState.token;

  useEffect(() => {
    if (token) {
      getExpenses(token).then((response) => {
        setExpenses(response.data);
      }).catch(error => {
        console.error('Failed to fetch expenses:', error);
      });
    }
  }, [token]);

  const categories = [
    'Food & Dining', 'Housing', 'Transportation', 'Health & Wellness', 
    'Entertainment', 'Shopping', 'Education', 'Travel', 
    'Savings & Investments', 'Miscellaneous'
  ];

  // Pie chart data (spending by category)
  const categoryData = categories.map(category => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((total, exp) => total + exp.amount, 0);
  });

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        data: categoryData,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#f4511e',
          '#36b57e', '#ff9f40', '#4e73df', '#f9c8d7', '#fcbf49'
        ],
        hoverBackgroundColor: [
          '#ff4d6d', '#3398cc', '#ffbf1f', '#3cbdbf', '#f24600',
          '#2c9053', '#e68a28', '#3b62e6', '#f0a2d0', '#f9a837'
        ]
      }
    ]
  };

  // Line chart data (monthly trends)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlySpending = months.map((month, index) => {
    return expenses
      .filter(exp => new Date(exp.date).getMonth() === index)
      .reduce((total, exp) => total + exp.amount, 0);
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlySpending,
        fill: false,
        borderColor: '#36a2eb',
        tension: 0.1
      }
    ]
  };

  return (
    <Box sx={{ padding: '20px', width: '100%', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ height: '100%', width: '100%' }}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6} sx={{ height: '50%' }}>
          <Paper elevation={3} sx={{ padding: '20px', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <Pie data={pieChartData} />
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6} sx={{ height: '50%' }}>
          <Paper elevation={3} sx={{ padding: '20px', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Monthly Spending Trend
            </Typography>
            <Line data={lineChartData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
