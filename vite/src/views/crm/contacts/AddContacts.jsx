// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
// import TextField from '@mui/material/TextField';
// import FormControl from '@mui/material/FormControl';
// import { Autocomplete, Grid, Stack, Button } from '@mui/material';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import CountrySelect from '../../../ui-component/auto-complete/CountrySelect';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';


// // ==============================|| SAMPLE PAGE ||============================== //

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

// export default function AddContacts() {
//   const [message, setMessage] = React.useState('');
//   const [severity, setSeverity] = React.useState('success');
//   const [open, setOpen] = useState(false);

//   const [clientForm, setClientForm] = useState({
//     firstname: '',
//     lastname: '',
//     position: '',
//     email: '',
//     direction: '',
//     phone: '',
//     password: '',
//   })

//   const handleChanged = (e) => {
//     const {name, value} = e.target;
//     setClientForm({
//       ...clientForm,
//       [name]: value
//     })
//   }

//   const clientDataSubmit = async(e) => {
//     e.preventDefault();
//     try {
//       console.log("client form ", clientForm);
//       const res = await axios.post('http://localhost:8000/api/v1/contact/createcontact', clientForm)
//       console.log("hello submit success ", res);
//       setMessage('Client added successfully!');
//       setSeverity('success');
//       setOpen(true);

//     } catch (error) {
//       console.log("hello submit error ", error);
//       console.log('Error in client submission', error.response?.data?.message || error);
//       const errorMessage =
//       error.response?.data?.message || 'Something went wrong while adding client.';
//       setMessage(errorMessage);
//       setSeverity('success');
//       setOpen(true);
//     }
//   };

//   return (
//     <MainCard title="Add Contact">
//       <form onSubmit={clientDataSubmit}>
//         <Grid container spacing={2}>
//           <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="text"
//                 name="firstname"
//                 id="outlined-basic"
//                 label="First Name"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.firstname}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="text"
//                 name="lastname"
//                 id="outlined-basic"
//                 label="Last Name"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.lastname}
//                 required
//               />
//             </Grid>
//           </Stack>

//           <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="text"
//                 name="position"
//                 id="outlined-basic"
//                 label="Position"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%', width: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.position}
//               />
//             </Grid>
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="email"
//                 name="email"
//                 id="outlined-basic"
//                 label="Email"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.email}
//               />
//             </Grid>
//           </Stack>
                  
//           <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
             
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="text"
//                 name="phone"
//                 id="outlined-basic"
//                 label="Phone"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%', width: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.phone}
//               />
//             </Grid>
//              <FormControl fullWidth sx={{ width: '49%' }}>
//                 <InputLabel id="demo-simple-select-label">Direction</InputLabel>
//                     <Select
//                         labelId="direction-label"
//                         id="direction"
//                         label="direction"
//                         name="direction"
//                         onChange={handleChanged}
//                         value={clientForm.direction}
//                     >
//                         <MenuItem value="inbound">Inbound</MenuItem>
//                         <MenuItem value="outbound">Outbound</MenuItem>
//                         <MenuItem value="partner">Partner</MenuItem>
//                         <MenuItem value="internal">Internal</MenuItem>
//                     </Select>
//                 </FormControl>
//           </Stack>

//           <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
//             <Grid item xs={12} sx={{ width: '49%' }}>
//               <TextField
//                 type="password"
//                 name="password"
//                 id="outlined-basic"
//                 label="password"
//                 autoComplete="off"
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: '100%', width: '100%' }}
//                 onChange={handleChanged}
//                 value={clientForm.password}
//               />
//             </Grid>
//             <Grid item xs={12}>
//                 <Button type="submit" variant="contained" className="addData-button">
//                   Submit
//                 </Button>
//             </Grid>
//           </Stack>

      
//           <Grid item xs={12} style={{ textAlign: 'center', margin: '14px 0 0 0' }}>
//             <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//               <MuiAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
//                 {message}
//               </MuiAlert>
//             </Snackbar>
//           </Grid>
//         </Grid>
//       </form>
//     </MainCard>
//   );
// }








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
// import CountrySelect from '../../../ui-component/auto-complete/CountrySelect';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setAddContact, setUpdateContact, setContact, setLoading, setError } from '../../../store/slices/contactSlice.js'



// ==============================|| SAMPLE PAGE ||============================== //

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


export default function AddContacts() {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {error, loading, contacts} = useSelector((state)=> state.contact);

  const [contactForm, setContactForm] = useState({
    firstname: '',
    lastname: '',
    position: '',
    email: '',
    direction: '',
    phone: '',
    password: '',
  })

  const {id} = useParams();
  const isEditMode = Boolean(id);

  const handleChanged = (e) => {
    const {name, value} = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    })
  }

    useEffect(() => {
    if (isEditMode) {
        const fetchContact = async () => {
          console.log("ok555")
          try {
              const res = await axios.get(`http://localhost:8000/api/v1/contact/singlecontactdata/${id}`);
              const data = res.data?.data;
              console.log("contact edit data is...",data);
              console.log("ok6666")

              setContactForm({
                  firstname: data.firstname,
                  lastname: data.lastname,
                  position: data.position,
                  email: data.email,
                  direction: data.direction,
                  phone: data.phone,
                  password: data.password,
              })
            } catch(err) {
                console.error('Error fetching contact:', err);
                // dispatch(setError(err));
            } finally {
               console.log("set hai sub"); 
            }
    }
    fetchContact();
    }
  }, [id]);

  useEffect(()=>{
    console.log("setcontact redux value..",contacts);
    console.log("error redux value..",error);
  },[contacts])

  // const clientDataSubmit = async(e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("client form ", contactForm);
  //     const res = await axios.post('http://localhost:8000/api/v1/contact/createcontact', contactForm)
  //     console.log("hello submit success ", res);
  //     setMessage('Client added successfully!');
  //     setSeverity('success');
  //     setOpen(true);

  //   } catch (error) {
  //     console.log("hello submit error ", error);
  //     console.log('Error in client submission', error.response?.data?.message || error);
  //     const errorMessage =
  //     error.response?.data?.message || 'Something went wrong while adding client.';
  //     setMessage(errorMessage);
  //     setSeverity('success');
  //     setOpen(true);
  //   }
  // };


    const contactDataSubmit = async(e) => {
    e.preventDefault();
    dispatch(setLoading(true))
    try {
          console.log("ok777")

      if (isEditMode) {
          const res = await axios.put(`http://localhost:8000/api/v1/contact/updatecontact/${id}`, contactForm)
          const resData = res.data?.data; 
          if(resData.id) { 
            dispatch(setUpdateContact(res.data?.data)); 
            setMessage('contact updated successfully!'); 
          } 
          else {
            setMessage('Invalid edit response data');
            setSeverity('error');
          }
          
      } else {
          console.log("front test1")
          const res = await axios.post('http://localhost:8000/api/v1/contact/createcontact', contactForm)
          const resData = res.data?.data;
          console.log("front test2")
          
            if(resData.id) {
              dispatch(setAddContact(resData));      
              setMessage('Contact added successfully!');
            } 
            else {
             setMessage('Invalid response data');
             setSeverity('error');
            }
          }
          setSeverity('success');
          setOpen(true);
          setTimeout(() => navigate('/crm/contacts/list'), 1500);

      
    } catch (err) {

          // extract backend response
          const backendErrorsArray = err.response?.data?.errors || [];
          const formattedErrors = backendErrorsArray.reduce((acc, curr)=>{
            acc[curr.path] = curr.message;
            return acc;
          }, {});
          console.log("formattedErrors:", formattedErrors);

          const errorMessage = isEditMode? "Failed to update contact" : "Failed to add contact"
          dispatch(setError( formattedErrors ));
          setMessage( errorMessage || 'Something went wrong');
          setSeverity('error');
          setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading
  ? (isEditMode ? 'Updating...' : 'Submitting...')
  : (isEditMode ? 'Update Client' : 'Add Client');

  return (
    <MainCard title={isEditMode? "Edit Contact": "Add Contact"}>
      <form onSubmit={contactDataSubmit}>
        <Grid container spacing={2}>
          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="firstname"
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                size="small"
                onChange={handleChanged}
                value={contactForm.firstname}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.firstname}
                helperText={error?.firstname}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="lastname"
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                autoComplete="new-lastname"
                size="small"
                onChange={handleChanged}
                value={contactForm.lastname}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.lastname}
                helperText={error?.lastname}
                required
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="position"
                id="outlined-basic"
                label="Position"
                variant="outlined"
                autoComplete="new-position"
                size="small"
                onChange={handleChanged}
                value={contactForm.position}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.position}
                helperText={error?.position}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
               <TextField
                type="email"
                name="email"
                id="outlined-basic"
                label="email"
                variant="outlined"
                size="small"
                autoComplete="new-email"
                onChange={handleChanged}
                value={contactForm.email}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.email}
                helperText={error?.email}
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
                variant="outlined"
                size="small"
                autoComplete="new-phone"
                onChange={handleChanged}
                value={contactForm.phone}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.phone}
                helperText={error?.phone}
              />
            </Grid>
                <FormControl fullWidth sx={{ width: '49%' }} error={!!error?.direction}>
                      <InputLabel id="direction-label">Direction</InputLabel>
                      <Select
                        labelId="direction-label"
                        id="direction"
                        name="direction"
                        value={contactForm.direction}
                        onChange={handleChanged}
                      >
                        <MenuItem value="inbound">Inbound</MenuItem>
                        <MenuItem value="outbound">Outbound</MenuItem>
                        <MenuItem value="partner">Partner</MenuItem>
                        <MenuItem value="internal">Internal</MenuItem>
                      </Select>

                      {error?.direction && (
                        <FormHelperText>{error.direction}</FormHelperText>
                      )}
                </FormControl>

          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="password"
                name="password"
                id="outlined-basic"
                label="password"
                variant="outlined"
                autoComplete="new-password"
                size="small"
                onChange={handleChanged}
                value={contactForm.password}
                sx={{ 
                  minWidth: '100%', 
                  ...inputStyle  // ✅ spread your custom style
                }}
                error={!!error?.password}
                helperText={error?.password}
              />
            </Grid>
            <Grid item xs={12}>
                <Button type="submit" variant="contained" className="addData-button">
                   {buttonLabel}
                </Button>
            </Grid>
          </Stack>

      
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
