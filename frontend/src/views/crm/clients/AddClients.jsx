// project imports
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, Grid, Stack, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CountrySelect from '../../../ui-component/auto-complete/CountrySelect';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {setAddCLient, setUpdateClient} from '../../../store/slices/clientSlice.js'
import { setClient, setLoading, setError } from '../../../store/slices/clientSlice.js';


// ==============================|| SAMPLE PAGE ||============================== //

// const inputStyle = {
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//     backgroundColor: '#F3F6F9',
//     '& fieldset': { borderColor: '#E0E3E7' },
//     '&:hover fieldset': { borderColor: '#B2BAC2' },
//     '&.Mui-focused fieldset': {
//       borderColor: '#1976d2',
//       boxShadow: '0 0 0 2px rgba(25,118,210,0.25)'
//     }
//   },
//   '& .MuiInputLabel-root': {
//     color: '#6f7e8c'
//   },
//   '& .MuiInputLabel-root.Mui-focused': {
//     color: '#1976d2'
//   }
// };


const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'transparent', // ✅ transparent background
    '& fieldset': {
      borderColor: '#E0E3E7', // default border
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2', // hover border
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EDE7F6', // ✅ focus border
      boxShadow: 'none', // ✅ no shadow
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6f7e8c', // label default
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#5e35b1', // ✅ label color on focus
  },
};


export default function AddClients() {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {error, loading, clients} = useSelector((state)=> state.client);

  const [clientForm, setClientForm] = useState({
    companyname: '',
    vatnumber: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    source: '',
    assigned: '',
  })

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const handleChanged = (e) => {
    const {name, value} = e.target;
    setClientForm({
      ...clientForm,
      [name]: value
    })
  } 

  useEffect(() => {
    if (isEditMode) {
        const fetchClient = async () => {
          try {
              const res = await axios.get(`http://localhost:8000/api/v1/client/singleclientdata/${id}`);
              console.log("single data row is", res.data?.data);
              const data = res.data?.data
              setClientForm({
                  companyname: data.companyname,
                  vatnumber: data.companyname,
                  phone: data.phone,
                  email: data.email,
                  website: data.website,
                  address: data.address,
                  city: data.city,
                  state: data.state,
                  zipcode: data.zipcode,
                  country: data.country,
                  source: data.source,
                  assigned: data.assigned,
              })
            } catch {
                console.error('Error fetching client:', err);
            } finally {
              console.log("set hai sub");
            }
    }
    fetchClient();
    }
  }, [id]);


  useEffect(()=>{
    console.log("setclientssss mil gaya..",clients);
    console.log("error mil gaya..",error);
  },[clients])

  const clientDataSubmit = async(e) => {
    e.preventDefault();
    dispatch(setLoading(true))
    try {
      if (isEditMode) {
          const res = await axios.put(`http://localhost:8000/api/v1/client/updateclient/${id}`, clientForm)
          const resData = res.data?.data;
          if(resData.id) {
            dispatch(setUpdateClient(res.data?.data));
            setMessage('Client updated successfully!');
          } 
          else {
            setMessage('Invalid edit response data');
            setSeverity('error');
          }
          
          
      } else {
          const res = await axios.post('http://localhost:8000/api/v1/client/createclient', clientForm)
          console.log("after res....",res);
          const resData = res.data?.data;
          
            if(resData.id) {
              dispatch(setAddCLient(resData));      
              setMessage('Client added successfully!');
            } 
            else {
             setMessage('Invalid response data');
             setSeverity('error');
            }
          }
          setSeverity('success');
          setOpen(true);
          setTimeout(() => navigate('/crm/clients/list'), 1500);
      
    } catch (err) {

          // extract backend response
          const backendErrorsArray = err.response?.data?.errors || [];
          const formattedErrors = backendErrorsArray.reduce((acc, curr)=>{
            acc[curr.path] = curr.message;
            return acc;
          }, {});
          console.log("formattedErrors:", formattedErrors);

          const errorMessage = isEditMode? "Failed to update client" : "Failed to add client"
          dispatch(setError( formattedErrors ));
          setMessage( errorMessage || 'Something went wrong');
          setSeverity('error');
          setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // const buttonLabel = isEditMode ? 'Update Client' : loading ? 'Submitting....' : 'Add Client';
  const buttonLabel = loading
  ? (isEditMode ? 'Updating...' : 'Submitting...')
  : (isEditMode ? 'Update Client' : 'Add Client');



  return (
    <MainCard title={isEditMode? "Edit Company": "Add Company"}>
      <form onSubmit={clientDataSubmit}>
        <Grid container spacing={2}>
          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="companyname"
                id="outlined-basic"
                label="Company Name"
                autoComplete="new-companyname"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.companyname}
                error={!!error?.companyname}
                helperText={error?.companyname}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="vatnumber"
                id="outlined-basic"
                label="Vat Number"
                autoComplete="off"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.vatnumber}
                error={!!error?.vatnumber}
                helperText={error?.vatnumber}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="phone"
                id="outlined-basic"
                label="Phone"
                autoComplete="new-phone"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.phone}
                error={!!error?.phone}
                helperText={error?.phone}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="email"
                name="email"
                id="outlined-basic"
                label="Email"
                autoComplete="new-email"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.email}
                error={!!error?.email}
                helperText={error?.email}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="website"
                id="outlined-basic"
                label="Website"
                autoComplete="off"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.website}
                error={!!error?.website}
                helperText={error?.website}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                name="address"
                multiline
                rows={3}
                id="outlined-basic"
                label="Address"
                autoComplete="new-address"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.address}
                error={!!error?.address}
                helperText={error?.address}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="city"
                id="outlined-basic"
                label="City"
                autoComplete="new-city"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.city}
                error={!!error?.city}
                helperText={error?.city}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="state"
                id="outlined-basic"
                label="State"
                autoComplete="off"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.state}
                error={!!error?.state}
                helperText={error?.state}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="zipcode"
                id="outlined-basic"
                label="Zip Code"
                autoComplete="new-zipcode"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.zipcode}
                error={!!error?.zipcode}
                helperText={error?.zipcode}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <CountrySelect name="country" value={ clientForm.country } onChange={handleChanged}/>
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <FormControl fullWidth  
                sx={{ 
                  width: '49%',
                  ...inputStyle  // ✅ spread your custom style
                }}>
              <InputLabel id="demo-simple-select-label">source</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Source"
                name="source"
                onChange={handleChanged}
                value={clientForm.source}
                error={!!error?.source}
                helperText={error?.source}
              >
                <MenuItem value="google">google</MenuItem>
                <MenuItem value="facebook">facebook</MenuItem>
                <MenuItem value="instagram">instagram</MenuItem>
              </Select>
            </FormControl>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="assigned"
                id="outlined-basic"
                label="Assigned"
                autoComplete="off"
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '100%', width: '100%',
                  ...inputStyle  // ✅ spread your custom style
                }}
                onChange={handleChanged}
                value={clientForm.assigned}
                error={!!error?.assigned}
                helperText={error?.assigned}
              />
            </Grid>
          </Stack>

          <Grid item xs={12} style={{ textAlign: 'center', margin: '14px 0 0 0' }}>
            <Button type="submit" variant="contained" className="addData-button">
            {buttonLabel}
            </Button>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', margin: '14px 0 0 0' }}>
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
              <MuiAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
                {message}
              </MuiAlert>
            </Snackbar>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
