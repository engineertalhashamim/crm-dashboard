import { TextField, Button, Stack, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAddSource, setLoading, setError, setUpdateSource } from '../../../store/slices/sourceSlice.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  textAlign: 'center'
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: '#E0E3E7'
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EDE7F6',
      boxShadow: 'none'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6f7e8c'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#5e35b1'
  }
};

const ListSources = ({ CloseEvent, setSnackOpen, setSnackMessage, setSnackSeverity, editModaVar }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.source);
  const [sourceForm, setSourceForm] = useState({
    sourcename: '',
  });

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setSourceForm({
      ...sourceForm,
      [name]: value
    });
  };

  useEffect(() => {
    if (editModaVar) {
      const fetchSource = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/source/singlesourcedata/${editModaVar}`);
          const data = res.data?.data;
          setSourceForm(data);
        } catch (err) {
          console.error('Error fetching source:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchSource();
    }
  }, [editModaVar]);

  const sourceDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (editModaVar) {
        const res = await axios.put(`http://localhost:8000/api/v1/source/updatesource/${editModaVar}`, sourceForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateSource(resData));
          setSnackMessage('source updated successfully!');
        } else {
          setSnackMessage('Invalid edit response data');
          setSnackSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/source/createsource', sourceForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setAddSource(resData));
          setSnackMessage('Source added successfully!');
        } else {
          setSnackMessage('Invalid response data');
          setSnackSeverity('error');
        }
      }

      setSnackSeverity('success');
      setSnackOpen(true);
      CloseEvent();
    } catch (err) {
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      // console.log('formattedErrors:', formattedErrors);
      // console.log('backendErrorsArray is:', backendErrorsArray);

      const errorMessage = editModaVar ? 'Failed to update source' : 'Failed to add source';
      dispatch(setError(formattedErrors));
      setSnackMessage(errorMessage || 'Something went wrong');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // useEffect(() => {
  //   console.log('get status data is..', statusArr);
  // }, [statusArr]);

  const buttonLabel = loading ? (editModaVar ? 'Updating...' : 'Submitting...') : editModaVar ? 'Update source' : 'Add source';

  return (
    <>
      <MainCard sx={{ ...style }} title={editModaVar ? 'Edit Source' : 'Add Source'} className="modal-pop-cls">
        <Stack direction="row" justifyContent="flex-end" position={'absolute'} right={8} top={8}>
          <IconButton onClick={CloseEvent}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <form onSubmit={sourceDataSubmit} style={{ Padding: '0' }}>
          <Stack spacing={2} sx={{ px: 2 }}>
            <TextField
              type="text"
              name="sourcename"
              id="outlined-basic"
              label="Source"
              variant="outlined"
              autoComplete="new-sourcename"
              size="small"
              onChange={handleChanged}
              value={sourceForm.sourcename}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.sourcename}
              helperText={error?.sourcename}
            />
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button type="submit" variant="contained" className="addData-button">
                {buttonLabel}
              </Button>
            </Stack>
          </Stack>
        </form>
      </MainCard>
    </>
  );
};

export default ListSources;
