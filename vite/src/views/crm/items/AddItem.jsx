import { TextField, Button, Stack, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
// import { setAddSource, setLoading, setError, setUpdateSource } from '../../../store/slices/sourceSlice.js';
import { setLoading, setError, setAddUser, setUpdateUser, clearError } from '../../../store/slices/user.Slice.js';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '../../../ui-component/extended/Form/FormControl.jsx';
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

const AddItem = ({ CloseEvent, setSnackOpen, setSnackMessage, setSnackSeverity, editModaVar }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [billingOptions, setBillingOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  useEffect(() => {
    dispatch(clearError());
  }, [editModaVar]);

  useEffect(() => {
    if (editModaVar) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/user/singleuserdata/${editModaVar}`, { withCredentials: true });
          const data = res.data?.data;
          console.log('this is data...', data);
          setUserForm({
            name: data.name,
            username: data.username,
            email: data.email,
            password: ''
          });
        } catch (err) {
          console.error('Error fetching user:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchUser();
    }
  }, [editModaVar]);

  const sourceDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (editModaVar) {
        const res = await axios.put(`http://localhost:8000/api/v1/user/updateuser/${editModaVar}`, userForm, { withCredentials: true });
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateUser(resData));
          setSnackMessage('user updated successfully!');
        } else {
          setSnackMessage('Invalid edit response data');
          setSnackSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/user/createuser', userForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setAddUser(resData));
          setSnackMessage('user added successfully!');
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

      const errorMessage = editModaVar ? 'Failed to update user' : 'Failed to add user';
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

  const buttonLabel = loading ? (editModaVar ? 'Updating...' : 'Submitting...') : editModaVar ? 'Update user' : 'Add user';

  return (
    <>
      <MainCard sx={{ ...style }} title={editModaVar ? 'Edit User' : 'Add User'} className="modal-pop-cls">
        <Stack direction="row" justifyContent="flex-end" position={'absolute'} right={8} top={8}>
          <IconButton onClick={CloseEvent}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <form onSubmit={sourceDataSubmit} style={{ Padding: '0' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Stack spacing={2} direction="row">
              <TextField
                type="text"
                name="name"
                id="outlined-basic"
                label="Description"
                variant="outlined"
                autoComplete="new-name"
                size="small"
                onChange={handleChanged}
                value={userForm.name}
                sx={{
                  flex: 1,
                  ...inputStyle
                }}
                error={!!error?.name}
                helperText={error?.name}
              />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField
                multiline
                rows={4}
                type="text"
                label="Long Description"
                name="total_rate"
                fullWidth
                onChange={handleChanged}
                value={userForm.total_rate}
                error={!!error?.total_rate}
                helperText={error?.total_rate}
              />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField
                type="number"
                name="total_rate"
                id="outlined-basic"
                label="Rate - USD (Base Currency)"
                variant="outlined"
                autoComplete="new-name_lead"
                size="small"
                onChange={handleChanged}
                value={userForm.total_rate}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.total_rate}
                helperText={error?.total_rate}
                required
              />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField
                type="number"
                name="total_rate"
                id="outlined-basic"
                label="Rate - EUR"
                variant="outlined"
                autoComplete="new-name_lead"
                size="small"
                onChange={handleChanged}
                value={userForm.total_rate}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.total_rate}
                helperText={error?.total_rate}
                required
              />
            </Stack>
            <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
              <FormControl
                fullWidth
                sx={{
                  width: '49%',
                  ...inputStyle // ✅ spread your custom style
                }}
              >
                <InputLabel id="demo-simple-select-label">Billing Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Billing Type"
                  name="billing_type"
                  onChange={handleChanged}
                  value={userForm.billing_type || ''}
                  error={!!error?.billing_type}
                  helperText={error?.billing_type}
                >
                  {billingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  width: '49%',
                  ...inputStyle // ✅ spread your custom style
                }}
              >
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                  name="status"
                  onChange={handleChanged}
                  value={userForm.status || ''}
                  error={!!error?.status}
                  helperText={error?.status}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button type="submit" variant="contained" className="addData-button" style={{ marginTop: '0.8rem' }}>
                {buttonLabel}
              </Button>
            </Stack>
          </Stack>
        </form>
      </MainCard>
    </>
  );
};

export default AddItem;
