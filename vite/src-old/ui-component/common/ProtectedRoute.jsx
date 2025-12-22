// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const { userData, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;
//   if (!userData) return <Navigate to="/login" replace />;

//   // role-based access
//   return userData ? children : <Navigate to="/login" />;
// };
// export default ProtectedRoute;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import LoopIcon from '@mui/icons-material/Loop';
import { Box, Stack, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ok12..');
      try {
        const res = await axios.get('http://localhost:8000/api/v1/user/checkauth', {
          withCredentials: true
        });
        console.log('ok13 res..', res);
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        console.log('ok14 err..');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <LoopIcon
            sx={{
              fontSize: 60,
              color: 'primary.main',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <Typography variant="h4">Loading...</Typography>
        </Stack>
      </Box>
    );
  return isAuthenticated ? children : <Navigate to="/login" />;
};
export default ProtectedRoute;
