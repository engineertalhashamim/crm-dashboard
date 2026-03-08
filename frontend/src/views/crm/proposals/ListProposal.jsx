// Estimate imports
// import MainCard from 'ui-component/cards/MainCard';
// import * as React from 'react';
// import TextField from '@mui/material/TextField';
// import { Grid, Stack, Button, Autocomplete, InputLabel, Select } from '@mui/material';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
// import { useNavigate, useParams } from 'react-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { ClientAutoComplete, MultiUserAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
// import Chip from '@mui/material/Chip';
// import FormControl from '@mui/material/FormControl';
// import MenuItem from '@mui/material/MenuItem';
// import RichText from '../../../ui-component/common/RichText.jsx';
// import { setAddProject, setUpdateProject, setLoading, setError } from '../../../store/slices/projectSlice.js';

import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import {
  Button,
  Autocomplete,
  InputAdornment,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ClientAutoComplete, StatusAutoComplete } from '../../../ui-component/auto-complete/autoSearch';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { setAddProject, setUpdateProject, setLoading, setError } from '../../../store/slices/projectSlice.js';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

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

const ListProposal = () => {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [open, setOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [quantityType, setQuantityType] = useState('Qty');

  const [billingOptions, setBillingOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [items, setItems] = useState([
    {
      description: 'Website Development',
      long_description: 'Full stack website build',
      quantity: 2,
      unit: 'pcs',
      rate: 100,
      tax_name: 'No Tax',
      amount: 100
    },
    {
      description: 'Website Development',
      long_description: 'Full stack website build',
      quantity: 2,
      unit: 'pcs',
      rate: 100,
      tax_name: 'No Tax',
      amount: 100
    },
    {
      description: 'Website Development',
      long_description: 'Full stack website build',
      quantity: 2,
      unit: 'pcs',
      rate: 100,
      tax_name: 'No Tax',
      amount: 100
    }
  ]);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.project);

  const [estimateProject, setEstimateProject] = useState({
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

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setEstimateProject({
      ...estimateProject,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await axios.get('http://localhost:8000/api/v1/estimate/getprojectoptions');

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
          const res = await axios.get(`http://localhost:8000/api/v1/estimate/singleprojectdata/${id}`);
          const data = res.data?.data;
          console.log('estimate edit data is........', res);

          setEstimateProject(data);
        } catch (err) {
          console.error('Error fetching lead:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchProject();
    }
  }, [id]);

  // Item Dialog Handlers
  const handleOpenItemDialog = () => {
    // if ((a = 2)) {
    //   console.log('test');
    // } else {
    //   console.log('test2');
    // }
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
  };

  const handleSaveItem = () => {
    handleCloseItemDialog();
  };

  const leadDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/estimate/updateproject/${id}`, estimateProject);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateProject(resData));
          setMessage('estimate updated successfully!');
        } else {
          setMessage('Invalid edit response data');
          setSeverity('error');
        }
      } else {
        console.log('test1111 scu data..');
        console.log('test old scu data..', estimateProject);

        const res = await axios.post('http://localhost:8000/api/v1/estimate/createproject', estimateProject);
        const resData = res.data?.data;
        console.log('estimateProject data get is ..', resData);
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

      const errorMessage = isEditMode ? 'Failed to update Estimate' : 'Failed to Add Estimate';
      dispatch(setError(formattedErrors));
      setMessage(errorMessage || 'Something went wrong');
      setSeverity('error');
      setOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update Estimate' : 'Add Estimate';

  return (
    <MainCard title={isEditMode ? 'Edit Estimate' : 'Add Estimate'}>
      <form onSubmit={leadDataSubmit}>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* ======= Left Side ======= */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Customer Number */}
            <StatusAutoComplete
              onSelect={(id) => {
                setEstimateProject((prev) => ({ ...prev, status_id: id }));
                console.log('id isss', id);
              }}
              required={true}
              valueObject={estimateProject?.statusId}
            />

            {/* Bill To / Ship To */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <TextField
                  multiline
                  rows={4}
                  type="text"
                  name="name_lead"
                  id="outlined-basic"
                  label="Billing To"
                  variant="outlined"
                  autoComplete="new-name_lead"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.name_lead}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  error={!!error?.name_lead}
                  helperText={error?.name_lead}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  multiline
                  rows={4}
                  type="text"
                  name="name_lead"
                  id="outlined-basic"
                  label="Ship To"
                  variant="outlined"
                  autoComplete="new-name_lead"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.name_lead}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  error={!!error?.name_lead}
                  helperText={error?.name_lead}
                  required
                />
              </div>
            </div>

            {/* Estimate Number */}
            <TextField
              type="text"
              name="name_lead"
              id="outlined-basic"
              label="Name"
              variant="outlined"
              autoComplete="new-name_lead"
              size="small"
              onChange={handleChanged}
              value={estimateProject.name_lead}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.name_lead}
              helperText={error?.name_lead}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="bg-gray-200 px-2 py-1 rounded-l font-semibold">EST-</span>
                  </InputAdornment>
                )
              }}
            />

            {/* Dates */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <TextField
                  type="date"
                  name="start_date"
                  id="outlined-basic"
                  label="Estimate Date"
                  variant="outlined"
                  autoComplete="new-start_date"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.start_date}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle // ✅ spread your custom style
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.start_date}
                  helperText={error?.start_date}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  type="date"
                  name="start_date"
                  id="outlined-basic"
                  label="Expiry Date"
                  variant="outlined"
                  autoComplete="new-start_date"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.start_date}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle // ✅ spread your custom style
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.start_date}
                  helperText={error?.start_date}
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
              value={estimateProject.tags}
              onChange={(event, newValue) => {
                setEstimateProject((prev) => ({
                  ...prev,
                  tags: newValue
                }));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />)
              }
              renderInput={(params) => <TextField {...params} label="Tags" placeholder="Type and press Enter" />}
            />

            {/* Billing + Status */}
            <div className="flex gap-4">
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="billing_type"
                  value={estimateProject.billing_type || ''}
                  onChange={handleChanged}
                  error={!!error?.billing_type}
                >
                  {billingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={estimateProject.status || ''} onChange={handleChanged} error={!!error?.status}>
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
              type="text"
              name="Reference #"
              id="outlined-basic"
              label="Total Rate"
              variant="outlined"
              autoComplete="new-name_lead"
              size="small"
              onChange={handleChanged}
              value={estimateProject.name_lead}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.name_lead}
              helperText={error?.name_lead}
            />
            <div className="flex gap-4">
              <div className="w-1/2">
                <StatusAutoComplete
                  onSelect={(id) => {
                    setEstimateProject((prev) => ({ ...prev, status_id: id }));
                    console.log('id isss', id);
                  }}
                  required={true}
                  valueObject={estimateProject?.statusId}
                />
              </div>
              <div className="w-1/2">
                <FormControl fullWidth>
                  <InputLabel>Discount Type</InputLabel>
                  <Select name="status" value={estimateProject.status || ''} onChange={handleChanged} error={!!error?.status}>
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Total Rate */}
            <TextField
              multiline
              rows={6}
              type="text"
              name="name_lead"
              id="outlined-basic"
              label="Admin Note"
              variant="outlined"
              autoComplete="new-name_lead"
              size="small"
              onChange={handleChanged}
              value={estimateProject.name_lead}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.name_lead}
              helperText={error?.name_lead}
            />
          </div>
        </div>

        {/* ======= Items Table Section ======= */}
        <div className="mt-8">
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="center">Tax</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">No items added. Click "Add Item" to add items.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    // console.log('items is', items);
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.long_description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                      <TableCell align="right">${item.rate}</TableCell>
                      <TableCell align="right">{item.tax_name || 'No Tax'}</TableCell>
                      <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleOpenItemDialog(index)} size="small">
                          <EditIcon style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteItem(index)} size="small" color="error">
                          <DeleteIcon style={{ fontSize: '20px', color: 'darkred', cursor: 'pointer' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenItemDialog()} sx={{ mb: 3 }}>
            Add Item
          </Button>
        </div>

        <div className="flex justify-left mt-3">
          <Button type="submit" variant="contained" className="addData-button">
            {buttonLabel}
          </Button>
        </div>
      </form>

      {/* Add/Edit Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <div className="pt-4 space-y-4">
            <div>
              <RadioGroup row value={quantityType} onChange={(e) => setQuantityType(e.target.value)}>
                <FormControlLabel value="Qty" control={<Radio />} label="Qty" />
                <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                <FormControlLabel value="Qty/Hours" control={<Radio />} label="Qty/Hours" />
              </RadioGroup>
            </div>
          </div>
          <Box sx={{ pt: 2 }}>
            {/* Item Form */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  size="small"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Long Description"
                  size="small"
                  multiline
                  rows={2}
                  value={itemForm.long_description}
                  onChange={(e) => setItemForm({ ...itemForm, long_description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ListProposal;
