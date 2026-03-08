import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const NoDataFound = ({ message = "No Data Found", onAddClick }) => {
  return (
      <Stack alignItems="center" spacing={1.5} py={5}>
        <SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adjusting filters or add a new item.
        </Typography>
        {onAddClick && (
          <Button
            // className="addData-button"
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ mt: 1, background: '#EDE7F6', color: '#673AB7' }}
            onClick={onAddClick}
          >
            Add New
          </Button>
        )}
      </Stack>
  );
};

export default NoDataFound;
