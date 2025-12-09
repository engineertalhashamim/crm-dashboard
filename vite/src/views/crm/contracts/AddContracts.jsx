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
import { setAddContract, setContract, setLoading, setError } from '../../../store/slices/contractSlice.js';
// import { ParentCustomerAutocomplete } from '../../../ui-component/auto-complete/autoSearch';
import { MuiAutoComplete } from '../../../ui-component/auto-complete/autoSearch';

// ==============================|| SAMPLE PAGE ||============================== //

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'transparent', // ✅ transparent background
    '& fieldset': {
      borderColor: '#E0E3E7' // default border
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2' // hover border
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EDE7F6', // ✅ focus border
      boxShadow: 'none' // ✅ no shadow
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6f7e8c' // label default
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#5e35b1' // ✅ label color on focus
  }
};

const AddContracts = () => {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, loading, contracts } = useSelector((state) => state.contract);

  const [contractForm, setContractForm] = useState({
    parentCustomerId: '',
    subject: '',
    contractValue: '',
    contractType: '',
    startDate: '',
    endDate: '',
    description: '',
    parentCustomer: null
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setContractForm({
      ...contractForm,
      [name]: value
    });
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchContract = async () => {
        console.log('ok555');
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/contract/singleContractData/${id}`);
          const data = res.data?.data;
          console.log('contract edit data is...', data);

          setContractForm(data);
        } catch (err) {
          console.error('Error fetching contract:', err);

        } finally {
          console.log('All are perfect');
        }
      };
      fetchContract();
    }
  }, [id]);

  const contractDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/contract/updatecontract/${id}`, contractForm);
        const resData = res.data?.data;
        if (resData.id) {
          // dispatch(setUpdateContract(res.data?.data));
          setMessage('contract updated successfully!');
        } else {
          setMessage('Invalid edit response data');
          setSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/contract/createcontract', contractForm);
        const resData = res.data?.data;

        if (resData.id) {
          dispatch(setAddContract(resData));
          setMessage('Contract added successfully!');
        } else {
          setMessage('Invalid response data');
          setSeverity('error');
        }
      }
      setSeverity('success');
      setOpen(true);
      setTimeout(() => navigate('/crm/contracts/list'), 1500);
    } catch (err) {
      // extract backend response
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      console.log('formattedErrors:', formattedErrors);

      const errorMessage = isEditMode ? 'Failed to update contract' : 'Failed to add contract';
      dispatch(setError(formattedErrors));
      setMessage(errorMessage || 'Something went wrong');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Client' : 'Add Client';

  return (
    <MainCard title={isEditMode ? 'Edit Contract' : 'Add Contract'}>
      <form onSubmit={contractDataSubmit}>
        <Grid container spacing={2}>
          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              {/* valueId={contractForm.parentCustomerId || null} */}

              <MuiAutoComplete
                onSelect={(id) => {
                  setContractForm((prev) => ({ ...prev, parentCustomerId: id }));
                  console.log('id isss', id);
                }}
                required={true}
                valueObject={contractForm?.parentCustomer}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField
                type="text"
                name="subject"
                id="outlined-basic"
                label="Subject"
                variant="outlined"
                autoComplete="new-subject"
                size="small"
                onChange={handleChanged}
                value={contractForm.subject}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                error={!!error?.subject}
                helperText={error?.subject}
                required
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField
                type="number"
                name="contractValue"
                id="outlined-basic"
                label="Contract Value"
                variant="outlined"
                autoComplete="new-contractValue"
                size="small"
                onChange={handleChanged}
                value={contractForm.contractValue}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                error={!!error?.contractValue}
                helperText={error?.contractValue}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <FormControl
              fullWidth
              sx={{
                width: '100%',
                ...inputStyle // ✅ spread your custom style
              }}
            >
              <InputLabel id="contractType-label">Contract Type</InputLabel>
              <Select
                labelId="contractType-label"
                id="contractType"
                label="Contract Type"
                name="contractType"
                value={contractForm.contractType}
                onChange={handleChanged}
              >
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Supply">Supply</MenuItem>
                <MenuItem value="Service Agreement">Service Agreement</MenuItem>
                <MenuItem value="Consulting">Consulting</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>

              {error?.contractType && <FormHelperText>{error.contractType}</FormHelperText>}
            </FormControl>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="date"
                name="startDate"
                id="outlined-basic"
                label="Start Date"
                variant="outlined"
                autoComplete="new-startDate"
                size="small"
                onChange={handleChanged}
                value={contractForm.startDate}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                InputLabelProps={{ shrink: true }}
                error={!!error?.startDate}
                helperText={error?.startDate}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="date"
                name="endDate"
                id="outlined-basic"
                label="End Date"
                variant="outlined"
                autoComplete="new-endDate"
                size="small"
                onChange={handleChanged}
                value={contractForm.endDate}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                InputLabelProps={{ shrink: true }}
                error={!!error?.endDate}
                helperText={error?.endDate}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField
                type="text"
                name="description"
                id="outlined-basic"
                label="Description"
                variant="outlined"
                autoComplete="new-description"
                size="small"
                multiline
                minRows={3}
                maxRows={6}
                onChange={handleChanged}
                value={contractForm.description}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                error={!!error?.description}
                helperText={error?.description}
              />
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

export default AddContracts;
