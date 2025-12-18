import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setError, setLoading, setLoggedInUser, clearError } from '../../../store/slices/user.Slice.js';

import { useDispatch, useSelector } from 'react-redux';
// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(null);

  const dispatch = useDispatch();
  const { error, loading, usersArr } = useSelector((state) => state.user);

  const [sourceForm, setSourceForm] = useState({
    username: '',
    password: ''
  });

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setSourceForm({
      ...sourceForm,
      [name]: value
    });
  };
  const editModaVar = false;
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    dispatch(clearError());
  }, [clearError]);

  const userDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (editModaVar) {
        // const res = await axios.put(`http://localhost:8000/api/v1/source/updatesource/${editModaVar}`, sourceForm);
        // const resData = res.data?.data;
        // if (resData.id) {
        //   dispatch(setUpdateSource(resData));
        //   setMessage('source updated successfully!');
        // } else {
        //   setMessage('Invalid edit response data');
        //   setSeverity('error');
        // }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/user/loginuser', sourceForm, {
          withCredentials: true // important for sessions
        });
        const resData = res.data?.data;
        if (resData.id) {
          navigate('/');
          setMessage('Login successfully!');
          dispatch(
            setLoggedInUser({
              id: resData.id,
              username: resData.username
            })
          );
        } else {
          setMessage('Invalid response data');
          setSeverity('error');
        }
      }

      setSeverity('success');
      setOpen(true);
    } catch (err) {
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      console.log('formattedErrors.is :', formattedErrors);
      console.log('backendErrorsArray is:', backendErrorsArray);

      const errorMessage = editModaVar ? 'Failed to update login' : 'Failed to login';
      dispatch(setError(formattedErrors));
      setMessage(errorMessage || 'Something went wrong');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <form onSubmit={userDataSubmit}>
        <CustomFormControl fullWidth error={!!error?.username}>
          <InputLabel>Email Address / Username</InputLabel>

          <OutlinedInput type="text" value={sourceForm.username} name="username" onChange={handleChanged} />

          {error?.username && (
            <Typography variant="caption" color="red">
              {error.username}
            </Typography>
          )}
        </CustomFormControl>

        <CustomFormControl fullWidth error={!!error?.password}>
          <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={sourceForm.password}
            name="password"
            onChange={handleChanged}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {error?.password && (
            <Typography variant="caption" color="red">
              {error?.password}
            </Typography>
          )}
        </CustomFormControl>

        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
              label="Keep me logged in"
            />
          </Grid>
          <Grid>
            <Typography variant="subtitle1" component={Link} to="#!" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
              Forgot Password?
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center', margin: '14px 0 0 0' }}>
          <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
            <MuiAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
              {message}
            </MuiAlert>
          </Snackbar>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <AnimateButton>
            <Button color="secondary" fullWidth size="large" type="submit" variant="contained">
              Sign In
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
}
