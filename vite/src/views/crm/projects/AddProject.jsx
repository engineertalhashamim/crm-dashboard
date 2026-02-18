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
import { ClientAutoComplete, MultiUserAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
cc
import MenuItem from '@mui/material/MenuItem';
import RichText from '../../../ui-component/common/RichText.jsx';
import { setAddProject, setUpdateProject, setLoading, setError } from '../../../store/slices/projectSlice.js';

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

const AddProject = () => {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const [billingOptions, setBillingOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, loading, projectsArr } = useSelector((state) => state.project);

  const [ProjectForm, setProjectForm] = useState({
    project_name: '',
    customer_id: '',
    billing_type: '',
    status: '',
    total_rate: '',
    rate_per_hour: '',
    estimated_hours: '',
    // members: [],
    start_date: '',
    deadline: '',
    tags: [],
    description: '',
    customerId: null
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);
  console.log('test Edit lead id', id);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setProjectForm({
      ...ProjectForm,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchOptions1 = async () => {
      console.log('log test..', billingOptions);
    };
    fetchOptions1();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await axios.get('http://localhost:8000/api/v1/project/getprojectoptions');

      setBillingOptions(res.data?.billingTypeOptions);
      setStatusOptions(res.data?.statusOptions);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        console.log('proj test 1...');
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/project/singleprojectdata/${id}`);
          const data = res.data?.data;
          console.log('project edit data is........', res);

          setProjectForm(data);
        } catch (err) {
          console.error('Error fetching lead:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchProject();
    }
  }, [id]);

  const leadDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/project/updateproject/${id}`, ProjectForm);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateProject(resData));
          setMessage('project updated successfully!');
        } else {
          setMessage('Invalid edit response data');
          setSeverity('error');
        }
      } else {
        console.log('test1111 scu data..');
        console.log('test old scu data..', ProjectForm);

        const res = await axios.post('http://localhost:8000/api/v1/project/createproject', ProjectForm);
        const resData = res.data?.data;
        console.log('ProjectForm data get is ..', resData);
        if (resData.id) {
          dispatch(setAddProject(resData));
          setMessage('Lead added successfully!');
        } else {
          setMessage('Invalid response data');
          setSeverity('error');
        }
      }
      setSeverity('success');
      setOpen(true);
      setTimeout(() => navigate('/crm/projects/list'), 1500);
    } catch (err) {
      console.log('test error lead..', err);

      // extract backend response
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      const errorMessage = isEditMode ? 'Failed to update Project' : 'Failed to add Project';
      dispatch(setError(formattedErrors));
      setMessage(errorMessage || 'Something went wrong');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Project' : 'Add Project';

  return (
    <MainCard title={isEditMode ? 'Edit Project' : 'Add Project'}>
      <form onSubmit={leadDataSubmit}>
        <Grid container spacing={2}>
          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="text"
                name="project_name"
                id="outlined-basic"
                label="Project Name"
                variant="outlined"
                autoComplete="new-project_name"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.project_name}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.project_name}
                helperText={error?.project_name}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%', ...inputStyle }}>
              <ClientAutoComplete
                onSelect={(id) => {
                  setProjectForm((prev) => ({ ...prev, customer_id: id }));
                  console.log('id isss', id);
                }}
                required={true}
                valueObject={ProjectForm?.customerId}
              />

              {/* <MuiAutoComplete
                  onSelect={(id) => {
                  setContractForm((prev) => ({ ...prev, parentCustomerId: id }));
                  console.log('id isss', id);
                  }}
                  required={true}
                  valueObject={contractForm?.parentCustomer}
              /> */}
            </Grid>
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
                value={ProjectForm.billing_type || ''}
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
                value={ProjectForm.status || ''}
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

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="number"
                name="total_rate"
                id="outlined-basic"
                label="Total Rate"
                variant="outlined"
                autoComplete="new-name_lead"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.total_rate}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.total_rate}
                helperText={error?.total_rate}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="number"
                name="rate_per_hour"
                id="outlined-basic"
                label="Rate Per Hour"
                variant="outlined"
                autoComplete="new-rate_per_hour"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.rate_per_hour}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.rate_per_hour}
                helperText={error?.rate_per_hour}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField
                type="number"
                name="estimated_hours"
                id="outlined-basic"
                label="Estimated Hours"
                variant="outlined"
                autoComplete="new-estimated_hours"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.estimated_hours}
                sx={{
                  minWidth: '100%',
                  ...inputStyle
                }}
                error={!!error?.estimated_hours}
                helperText={error?.estimated_hours}
                required
              />
            </Grid>
            {/* <Grid item xs={12} sx={{ width: '49%', ...inputStyle }}>
              <MultiUserAutoComplete
                onSelect={(ids) => {
                  // setProjectForm((prev) => ({ ...prev, assigned_user_id: id }));
                  console.log('id isss', ids);
                }}
                required={true}
                valueObject={[]}
              />
            </Grid> */}
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="date"
                name="start_date"
                id="outlined-basic"
                label="Start Date"
                variant="outlined"
                autoComplete="new-start_date"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.start_date}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                InputLabelProps={{ shrink: true }}
                error={!!error?.start_date}
                helperText={error?.start_date}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '49%' }}>
              <TextField
                type="date"
                name="deadline"
                id="outlined-basic"
                label="End Date"
                variant="outlined"
                autoComplete="new-deadline"
                size="small"
                onChange={handleChanged}
                value={ProjectForm.deadline}
                sx={{
                  minWidth: '100%',
                  ...inputStyle // ✅ spread your custom style
                }}
                InputLabelProps={{ shrink: true }}
                error={!!error?.deadline}
                helperText={error?.deadline}
              />
            </Grid>
          </Stack>

          <Stack spacing={2} direction="row" marginTop={0} sx={{ width: '100%' }}>
            <Grid item xs={12} sx={{ width: '100%', ...inputStyle }}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={ProjectForm.tags}
                onChange={(event, newValue) => {
                  setProjectForm((prev) => ({
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
            <Grid item xs={12} sx={{ width: '100%' }}>
              <RichText
                value={ProjectForm.description}
                onChange={(content) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    description: content
                  }))
                }
                error={error?.description}
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

export default AddProject;
