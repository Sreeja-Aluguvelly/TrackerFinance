import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Box } from '@mui/material';
import { FaDollarSign, FaChartLine, FaRegMoneyBillAlt } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const HomePage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleTrackExpensesClick = () => {
    if (!authState.token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      navigate('/expenses'); // Redirect to expenses if logged in
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-500 to-indigo-500 p-5">
      <Box className="flex flex-col justify-center items-center text-center text-white mt-10">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Your Finance Tracker
        </Typography>
        <Typography variant="h5" paragraph>
          Keep track of your expenses, set goals, and manage your financial future.
        </Typography>

        <Grid container spacing={3} justifyContent="center" mt={5}>
          <Grid 
            item xs={12} sm={4} 
            className="flex flex-col items-center"
            onClick={handleTrackExpensesClick}
            style={{ cursor: 'pointer' }}
          >
            <FaDollarSign size={50} color="white" />
            <Typography 
              variant="h6" 
              mt={2} 
              sx={{ textDecoration: 'underline', '&:hover': { color: '#f5a623' } }}
            >
              Track Expenses
            </Typography>
            <Typography variant="body1" color="white" align="center">
              Monitor your spending and make better financial decisions.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} className="flex flex-col items-center">
            <FaChartLine size={50} color="white" />
            <Typography variant="h6" mt={2}>Analyze Trends</Typography>
            <Typography variant="body1" color="white" align="center">
              Visualize your financial habits to stay on track with goals.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} className="flex flex-col items-center">
            <FaRegMoneyBillAlt size={50} color="white" />
            <Typography variant="h6" mt={2}>Save More</Typography>
            <Typography variant="body1" color="white" align="center">
              Set savings goals and ensure you're on the right path to financial freedom.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
