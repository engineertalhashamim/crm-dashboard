import { TextField, Button, Stack, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setAddStatus, setLoading, setError, setUpdateStatus } from '../../../store/slices/statusSlice.js';

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

const AddStatus = ({ CloseEvent, setSnackOpen, setSnackMessage, setSnackSeverity, editModaVar }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.status);
  const [statusForm, setStatusForm] = useState({
    statusname: '',
    color: '#673ab7'
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setStatusForm({
      ...statusForm,
      [name]: value
    });
  };

  useEffect(() => {
    if (editModaVar) {
      const fetchContract = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/status/singlestatusdata/${editModaVar}`);
          const data = res.data?.data;
          setStatusForm(data);
        } catch (err) {
          console.error('Error fetching contract:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchContract();
    }
  }, [id]);

  const statusDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (editModaVar) {
        const res = await axios.put(`http://localhost:8000/api/v1/status/updatestatus/${editModaVar}`, statusForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateStatus(res.data?.data));
          setSnackMessage('status updated successfully!');
        } else {
          setSnackMessage('Invalid edit response data');
          setSnackSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/status/createstatus', statusForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setAddStatus(resData));
          setSnackMessage('Status added successfully!');
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

      const errorMessage = editModaVar ? 'Failed to update status' : 'Failed to add status';
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

  const buttonLabel = loading ? (editModaVar ? 'Updating...' : 'Submitting...') : editModaVar ? 'Update status' : 'Add status';

  return (
    <>
      <MainCard sx={{ ...style }} title={editModaVar ? 'Edit Status' : 'Add Status'} className="modal-pop-cls">
        <Stack direction="row" justifyContent="flex-end" position={'absolute'} right={8} top={8}>
          <IconButton onClick={CloseEvent}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <form onSubmit={statusDataSubmit} style={{ Padding: '0' }}>
          <Stack spacing={2} sx={{ px: 2 }}>
            <TextField
              type="text"
              name="statusname"
              id="outlined-basic"
              label="status Name"
              variant="outlined"
              autoComplete="new-statusname"
              size="small"
              onChange={handleChanged}
              value={statusForm.statusname}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.statusname}
              helperText={error?.statusname}
            />
            <div className="color-picker-cls">
              <TextField
                type="color"
                name="color"
                id="outlined-basic"
                label="Color"
                variant="outlined"
                autoComplete="new-color"
                size="small"
                multiline
                minRows={1}
                maxRows={6}
                onChange={handleChanged}
                value={statusForm.color}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.color}
                helperText={error?.color}
              />

              <input
                type="color"
                name="color"
                value={statusForm.color}
                onChange={(e) => setStatusForm({ ...statusForm, color: e.target.value })}
              />
            </div>
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

export default AddStatus;
