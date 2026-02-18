import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, Autocomplete, InputAdornment, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ClientAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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

const AddEstimate = () => {
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

  // Default values if data not available
  const billTo = {
    // street: billToData?.street || '--',
    // city: billToData?.city || '--',
    // state: billToData?.state || '--',
    // zip: billToData?.zip || '--',
    // country: billToData?.country || '--'
    street: '--',
    city: '--',
    state: '--',
    zip: '--',
    country: '--'
  };

  const shipTo = {
    // street: shipToData?.street || '--',
    // city: shipToData?.city || '--',
    // state: shipToData?.state || '--',
    // zip: shipToData?.zip || '--',
    // country: shipToData?.country || '--'
    street: '--',
    city: '--',
    state: '--',
    zip: '--',
    country: '--'
  };
  return (
    <MainCard title={isEditMode ? 'Edit Project' : 'Add Project'}>
      <form onSubmit={leadDataSubmit} className="space-y-4">
        {/* ======= Left + Right Wrapper ======= */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* ======= Left Side ======= */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Client Select */}
            <ClientAutoComplete
              onSelect={(id) => setProjectForm((prev) => ({ ...prev, customer_id: id }))}
              required
              valueObject={ProjectForm?.customerId}
              fullWidth
            />
            <ClientAutoComplete
              onSelect={(id) => setProjectForm((prev) => ({ ...prev, customer_id: id }))}
              required
              valueObject={ProjectForm?.customerId}
              fullWidth
            />

            {/* Estimate Number */}
            <div className="flex gap-2">
              <TextField
                label="Estimate Number"
                value="00012"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="bg-gray-200 px-2 py-1 rounded-l font-semibold">EST-</span>
                    </InputAdornment>
                  )
                }}
              />
            </div>

            {/* Bill To / Ship To */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <Typography variant="subtitle2" className="font-semibold text-gray-500">
                  Bill To
                </Typography>
                <div>
                  <Typography variant="body2">{billTo.street}</Typography>
                  <Typography variant="body2">
                    {billTo.city}, {billTo.state}
                  </Typography>
                  <Typography variant="body2">
                    {billTo.country}, {billTo.zip}
                  </Typography>
                </div>
              </div>
              <div className="w-1/2">
                <Typography variant="subtitle2" className="font-semibold text-gray-500">
                  Ship To
                </Typography>
                <div>
                  <Typography variant="body2">{billTo.street}</Typography>
                  <Typography variant="body2">
                    {billTo.city}, {billTo.state}
                  </Typography>
                  <Typography variant="body2">
                    {billTo.country}, {billTo.zip}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <TextField
                  type="date"
                  name="start_date"
                  label="Start Date"
                  size="small"
                  fullWidth
                  onChange={handleChanged}
                  value={ProjectForm.start_date}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.start_date}
                  helperText={error?.start_date}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  type="date"
                  name="deadline"
                  label="End Date"
                  size="small"
                  fullWidth
                  onChange={handleChanged}
                  value={ProjectForm.deadline}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.deadline}
                  helperText={error?.deadline}
                />
              </div>
            </div>
          </div>

          {/* ======= Right Side ======= */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Tags */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={ProjectForm.tags}
              onChange={(e, newVal) => setProjectForm((prev) => ({ ...prev, tags: newVal }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
              }
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Type and press Enter" />}
            />

            {/* Billing + Status */}
            <div className="flex gap-4">
              <FormControl fullWidth>
                <InputLabel>Billing Type</InputLabel>
                <Select name="billing_type" value={ProjectForm.billing_type || ''} onChange={handleChanged} error={!!error?.billing_type}>
                  {billingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={ProjectForm.status || ''} onChange={handleChanged} error={!!error?.status}>
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Reference # */}
            <TextField
              label="Reference #"
              name="reference_no"
              size="small"
              fullWidth
              onChange={handleChanged}
              value={ProjectForm.reference_no || ''}
              error={!!error?.reference_no}
              helperText={error?.reference_no}
            />

            {/* Total Rate */}
            <TextField
              multiline
              rows={6}
              label="Total Rate"
              name="total_rate"
              fullWidth
              onChange={handleChanged}
              value={ProjectForm.total_rate}
              error={!!error?.total_rate}
              helperText={error?.total_rate}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" variant="contained" className="addData-button">
            {buttonLabel}
          </Button>
        </div>

        {/* Snackbar */}
        <div className="text-center mt-4">
          <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
            <MuiAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
              {message}
            </MuiAlert>
          </Snackbar>
        </div>
      </form>
    </MainCard>
  );
};

export default AddEstimate;
