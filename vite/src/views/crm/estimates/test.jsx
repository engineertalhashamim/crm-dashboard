import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import {
  Button,
  Autocomplete,
  Box,
  InputAdornment,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ClientAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
import { setAddProject, setUpdateProject, setLoading, setError } from '../../../store/slices/projectSlice.js';

const AddEstimate = () => {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);

  const [billingOptions, setBillingOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.project);

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
    customerId: null,
    reference_no: ''
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setProjectForm({ ...ProjectForm, [name]: value });
  };

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
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/project/singleprojectdata/${id}`);
          setProjectForm(res.data?.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProject();
    }
  }, [id]);

  const leadDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      let resData;
      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/project/updateproject/${id}`, ProjectForm);
        resData = res.data?.data;
        if (resData?.id) dispatch(setUpdateProject(resData));
        setMessage('Project updated successfully!');
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/project/createproject', ProjectForm);
        resData = res.data?.data;
        if (resData?.id) dispatch(setAddProject(resData));
        setMessage('Project added successfully!');
      }
      setSeverity('success');
      setOpen(true);
      setTimeout(() => navigate('/crm/projects/list'), 1500);
    } catch (err) {
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      dispatch(setError(formattedErrors));
      setMessage(isEditMode ? 'Failed to update Project' : 'Failed to add Project');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Project' : 'Add Project';

  const billTo = {
    street: '--',
    city: '--',
    state: '--',
    zip: '--',
    country: '--'
  };

  return (
    <MainCard title={isEditMode ? 'Edit Project' : 'Add Project'}>
      <form onSubmit={leadDataSubmit} className="space-y-6">
        {/* ===== LEFT + RIGHT GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-4">
            <ClientAutoComplete
              onSelect={(id) => setProjectForm((prev) => ({ ...prev, customer_id: id }))}
              required
              valueObject={ProjectForm?.customerId}
              fullWidth
            />

            <TextField
              label="Estimate Number"
              value="00012"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className="bg-gray-200 px-2 py-1 rounded-l font-semibold">
                    EST-
                  </InputAdornment>
                )
              }}
            />

            {/* BILL TO / SHIP TO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="subtitle2" className="font-semibold text-gray-500">
                  Bill To
                </Typography>
                <Box>
                  <Typography variant="body2">{billTo.street}</Typography>
                  <Typography variant="body2">
                    {billTo.city}, {billTo.state}
                  </Typography>
                  <Typography variant="body2">
                    {billTo.country}, {billTo.zip}
                  </Typography>
                </Box>
              </div>
              <div>
                <Typography variant="subtitle2" className="font-semibold text-gray-500">
                  Ship To
                </Typography>
                <Box>
                  <Typography variant="body2">{billTo.street}</Typography>
                  <Typography variant="body2">
                    {billTo.city}, {billTo.state}
                  </Typography>
                  <Typography variant="body2">
                    {billTo.country}, {billTo.zip}
                  </Typography>
                </Box>
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                type="date"
                name="start_date"
                label="Start Date"
                size="small"
                fullWidth
                onChange={handleChanged}
                value={ProjectForm.start_date}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                name="deadline"
                label="End Date"
                size="small"
                fullWidth
                onChange={handleChanged}
                value={ProjectForm.deadline}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={ProjectForm.tags}
              onChange={(e, newValue) => setProjectForm((prev) => ({ ...prev, tags: newValue }))}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />)
              }
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Type and press Enter" size="small" fullWidth />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth size="small">
                <InputLabel>Billing Type</InputLabel>
                <Select name="billing_type" value={ProjectForm.billing_type || ''} onChange={handleChanged} label="Billing Type">
                  {billingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select name="status" value={ProjectForm.status || ''} onChange={handleChanged} label="Status">
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <TextField
              label="Reference #"
              name="reference_no"
              size="small"
              fullWidth
              onChange={handleChanged}
              value={ProjectForm.reference_no || ''}
            />

            <TextField
              multiline
              rows={6}
              label="Total Rate"
              name="total_rate"
              fullWidth
              onChange={handleChanged}
              value={ProjectForm.total_rate}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button type="submit" variant="contained" className="addData-button">
          {buttonLabel}
        </Button>

        {/* SNACKBAR */}
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {message}
          </MuiAlert>
        </Snackbar>
      </form>
    </MainCard>
  );
};

export default AddEstimate;
