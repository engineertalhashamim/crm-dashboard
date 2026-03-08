// project imports
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Grid, Stack, Button, Autocomplete } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setAddLead, setLoading, setError } from '../../../store/slices/leadSlice.js';
import { SourceAutoComplete, StatusAutoComplete, UserAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
import Chip from '@mui/material/Chip';
import CountrySelect from '../../../ui-component/auto-complete/CountrySelect.jsx';

// ==============================|| SAMPLE PAGE ||============================== //

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

const AddLead = () => {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, loading, leadsArr } = useSelector((state) => state.lead);

  const [leadForm, setLeadForm] = useState({
    status_id: '',
    source_id: '',
    assigned_user_id: '',
    tags: [],
    name_lead: '',
    position: '',
    email: '',
    website: '',
    phone1: '',
    phone2: '',
    leadValue: '',
    company: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    defaultLanguage: '',
    statusId: null,
    sourceId: null,
    assignedUserId: null
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);
  console.log('test Edit lead id', id);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setLeadForm({
      ...leadForm,
      [name]: value
    });
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        console.log('ok555');
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/lead/singleleaddata/${id}`);
          const data = res.data?.data;
          console.log('Lead edit data is...', data);

          setLeadForm(data);
        } catch (err) {
          console.error('Error fetching lead:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchLead();
    }
  }, [id]);

  useEffect(() => {}, []);

  const leadDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/lead/updatelead/${id}`, leadForm);
        const resData = res.data?.data;
        if (resData.id) {
          // dispatch(setUpdateContract(res.data?.data));
          setMessage('lead updated successfully!');
        } else {
          setMessage('Invalid edit response data');
          setSeverity('error');
        }
      } else {
        console.log('test1111 scu data..');
        console.log('test old scu data..', leadForm);

        const res = await axios.post('http://localhost:8000/api/v1/lead/createlead', leadForm);
        const resData = res.data?.data;
        console.log('leadform data get is ..', resData);
        if (resData.id) {
          dispatch(setAddLead(resData));
          setMessage('Lead added successfully!');
        } else {
          setMessage('Invalid response data');
          setSeverity('error');
        }
      }
      setSeverity('success');
      setOpen(true);
      setTimeout(() => navigate('/crm/lead'), 1500);
    } catch (err) {
      console.log('test error lead..', err);

      // extract backend response
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      const errorMessage = isEditMode ? 'Failed to update lead' : 'Failed to add lead';
      dispatch(setError(formattedErrors));
      setMessage(errorMessage || 'Something went wrong');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Lead' : 'Add Lead';

  return (
    <MainCard title={isEditMode ? 'Edit Leads' : 'Add Leads'}>
      <form onSubmit={leadDataSubmit}>
        <Grid container spacing={2}>
          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <StatusAutoComplete
                onSelect={(id) => {
                  setLeadForm((prev) => ({ ...prev, status_id: id }));
                  console.log('id isss', id);
                }}
                required={true}
                valueObject={leadForm?.statusId}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <SourceAutoComplete
                onSelect={(id) => {
                  setLeadForm((prev) => ({ ...prev, source_id: id }));
                  console.log('id isss', id);
                }}
                required={true}
                valueObject={leadForm?.sourceId}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <UserAutoComplete
                onSelect={(id) => {
                  setLeadForm((prev) => ({ ...prev, assigned_user_id: id }));
                  console.log('id isss', id);
                }}
                required={true}
                valueObject={leadForm?.assignedUserId}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={leadForm.tags}
                onChange={(event, newValue) => {
                  setLeadForm((prev) => ({
                    ...prev,
                    tags: newValue
                  }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />)
                }
                renderInput={(params) => <TextField {...params} label="Tags" placeholder="Type and press Enter" />}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="name_lead"
                id="outlined-basic"
                label="Name"
                variant="outlined"
                autoComplete="new-name_lead"
                size="small"
                onChange={handleChanged}
                value={leadForm.name_lead}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.name_lead}
                helperText={error?.name_lead}
                required
              />
            </Grid>
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
                value={leadForm.position}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.position}
                helperText={error?.position}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="email"
                name="email"
                id="outlined-basic"
                label="Email"
                variant="outlined"
                autoComplete="new-email"
                size="small"
                onChange={handleChanged}
                value={leadForm.email}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.email}
                helperText={error?.email}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="website"
                id="outlined-basic"
                label="Website"
                variant="outlined"
                autoComplete="new-website"
                size="small"
                onChange={handleChanged}
                value={leadForm.website}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.website}
                helperText={error?.website}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="phone1"
                id="outlined-basic"
                label="Phone#1"
                variant="outlined"
                autoComplete="new-phone1"
                size="small"
                onChange={handleChanged}
                value={leadForm.phone1}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.phone1}
                helperText={error?.phone1}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="phone2"
                id="outlined-basic"
                label="Phone#2"
                variant="outlined"
                autoComplete="new-phone2"
                size="small"
                onChange={handleChanged}
                value={leadForm.phone2}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.phone2}
                helperText={error?.phone2}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="leadValue"
                id="outlined-basic"
                label="Lead Value"
                variant="outlined"
                autoComplete="new-leadValue"
                size="small"
                onChange={handleChanged}
                value={leadForm.leadValue}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.leadValue}
                helperText={error?.leadValue}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="company"
                id="outlined-basic"
                label="Company"
                variant="outlined"
                autoComplete="new-company"
                size="small"
                onChange={handleChanged}
                value={leadForm.company}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.company}
                helperText={error?.company}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="description"
                id="outlined-basic"
                label="Description"
                variant="outlined"
                autoComplete="new-description"
                size="small"
                onChange={handleChanged}
                value={leadForm.description}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.description}
                helperText={error?.description}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="address"
                id="outlined-basic"
                label="Address"
                variant="outlined"
                autoComplete="new-address"
                size="small"
                onChange={handleChanged}
                value={leadForm.address}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
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
                variant="outlined"
                autoComplete="new-city"
                size="small"
                onChange={handleChanged}
                value={leadForm.city}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.city}
                helperText={error?.city}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="state"
                id="outlined-basic"
                label="State"
                variant="outlined"
                autoComplete="new-state"
                size="small"
                onChange={handleChanged}
                value={leadForm.state}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.state}
                helperText={error?.state}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <CountrySelect name="country" value={leadForm.country} onChange={handleChanged} />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="zipCode"
                id="outlined-basic"
                label="zipCode"
                variant="outlined"
                autoComplete="new-zipCode"
                size="small"
                onChange={handleChanged}
                value={leadForm.zipCode}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.zipCode}
                helperText={error?.zipCode}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="defaultLanguage"
                id="outlined-basic"
                label="Default Language"
                variant="outlined"
                autoComplete="new-defaultLanguage"
                size="small"
                onChange={handleChanged}
                value={leadForm.defaultLanguage}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.defaultLanguage}
                helperText={error?.defaultLanguage}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              {/* <CountrySelect name="country" value={leadForm.country} onChange={handleChanged} /> */}
            </Grid>
          </Stack>

          <Grid item xs={12}>
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
};

export default AddLead;
