import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import {
  Button,
  Autocomplete,
  InputAdornment,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Box,
  Divider,
  Grid
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
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import { setAddProject, setUpdateProject, setLoading, setError } from '../../../store/slices/projectSlice.js';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

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
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [quantityType, setQuantityType] = useState('Qty');
  const [currentItem, setCurrentItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  const [billingOptions, setBillingOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [items, setItems] = useState([]);

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
    start_date: '',
    deadline: '',
    tags: [],
    description: '',
    customerId: null,
    reference_no: '',
    admin_note: '',
    client_note: '',
    terms_conditions: '',
    adjustment: 0,
    adjustment_type: 'fixed', // 'fixed' or 'percentage'
    items: [],
    subtotal: 0,
    discount: 0,
    discount_type: 'fixed', // 'fixed' or 'percentage'
    total: 0
  });

  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Item form state
  const [itemForm, setItemForm] = useState({
    description: '',
    long_description: '',
    quantity: 1,
    unit: 'Unit',
    rate: 0,
    tax_id: '',
    tax_name: '',
    tax_rate: 0,
    amount: 0
  });

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setEstimateProject({
      ...estimateProject,
      [name]: value
    });
  };

  // Calculate item amount
  useEffect(() => {
    const amount = itemForm.quantity * itemForm.rate;
    const taxAmount = itemForm.tax_rate ? (amount * itemForm.tax_rate) / 100 : 0;
    setItemForm((prev) => ({
      ...prev,
      amount: amount + taxAmount
    }));
  }, [itemForm.quantity, itemForm.rate, itemForm.tax_rate]);

  // Calculate totals
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxTotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.rate;
      const taxAmount = item.tax_rate ? (itemSubtotal * item.tax_rate) / 100 : 0;
      return sum + taxAmount;
    }, 0);

    let discountAmount = 0;
    if (estimateProject.discount_type === 'percentage') {
      discountAmount = (subtotal * estimateProject.discount) / 100;
    } else {
      discountAmount = estimateProject.discount;
    }

    let adjustmentAmount = estimateProject.adjustment;

    const total = subtotal + taxTotal - discountAmount + adjustmentAmount;

    setEstimateProject((prev) => ({
      ...prev,
      subtotal: subtotal,
      total: total
    }));
  }, [items, estimateProject.discount, estimateProject.discount_type, estimateProject.adjustment]);

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await axios.get('http://localhost:8000/api/v1/estimate/getprojectoptions');
      setBillingOptions(res.data?.billingTypeOptions);
      setStatusOptions(res.data?.statusOptions);

      // Fetch tax options
      const taxRes = await axios.get('http://localhost:8000/api/v1/taxes');
      setTaxOptions(taxRes.data?.data || []);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/estimate/singleprojectdata/${id}`);
          const data = res.data?.data;
          setEstimateProject(data);
          setItems(data.items || []);
        } catch (err) {
          console.error('Error fetching lead:', err);
        }
      };
      fetchProject();
    }
  }, [id]);

  // Item Dialog Handlers
  const handleOpenItemDialog = (index = -1) => {
    if (index >= 0 && items[index]) {
      setCurrentItem(items[index]);
      setItemForm(items[index]);
      setEditingIndex(index);
    } else {
      setCurrentItem(null);
      setItemForm({
        description: '',
        long_description: '',
        quantity: 1,
        unit: 'Unit',
        rate: 0,
        tax_id: '',
        tax_name: '',
        tax_rate: 0,
        amount: 0
      });
      setEditingIndex(-1);
    }
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setCurrentItem(null);
    setEditingIndex(-1);
  };

  const handleSaveItem = () => {
    const newItems = [...items];
    if (editingIndex >= 0) {
      newItems[editingIndex] = itemForm;
    } else {
      newItems.push(itemForm);
    }
    setItems(newItems);
    setEstimateProject((prev) => ({ ...prev, items: newItems }));
    handleCloseItemDialog();
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setEstimateProject((prev) => ({ ...prev, items: newItems }));
  };

  const leadDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const payload = {
        ...estimateProject,
        items: items
      };

      if (isEditMode) {
        const res = await axios.put(`http://localhost:8000/api/v1/estimate/updateproject/${id}`, payload);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateProject(resData));
          setMessage('Estimate updated successfully!');
        } else {
          setMessage('Invalid edit response data');
          setSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/estimate/createproject', payload);
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setAddProject(resData));
          setMessage('Estimate added successfully!');
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
                  name="billing_to"
                  id="billing-to"
                  label="Billing To"
                  variant="outlined"
                  autoComplete="new-billing-to"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.billing_to || ''}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  error={!!error?.billing_to}
                  helperText={error?.billing_to}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  multiline
                  rows={4}
                  type="text"
                  name="shipping_to"
                  id="shipping-to"
                  label="Ship To"
                  variant="outlined"
                  autoComplete="new-shipping-to"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.shipping_to || ''}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  error={!!error?.shipping_to}
                  helperText={error?.shipping_to}
                />
              </div>
            </div>

            {/* Estimate Number */}
            <TextField
              type="text"
              name="estimate_number"
              id="estimate-number"
              label="Estimate Number"
              variant="outlined"
              autoComplete="new-estimate-number"
              size="small"
              onChange={handleChanged}
              value={estimateProject.estimate_number || ''}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.estimate_number}
              helperText={error?.estimate_number}
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
                  name="estimate_date"
                  id="estimate-date"
                  label="Estimate Date"
                  variant="outlined"
                  autoComplete="new-estimate-date"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.estimate_date || ''}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.estimate_date}
                  helperText={error?.estimate_date}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  type="date"
                  name="expiry_date"
                  id="expiry-date"
                  label="Expiry Date"
                  variant="outlined"
                  autoComplete="new-expiry-date"
                  size="small"
                  onChange={handleChanged}
                  value={estimateProject.expiry_date || ''}
                  sx={{
                    minWidth: '100%',
                    ...inputStyle
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={!!error?.expiry_date}
                  helperText={error?.expiry_date}
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
              value={estimateProject.tags || []}
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

            {/* Currency + Status */}
            <div className="flex gap-4">
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select name="currency" value={estimateProject.currency || 'USD'} onChange={handleChanged} error={!!error?.currency}>
                  <MenuItem value="USD">USD $</MenuItem>
                  <MenuItem value="EUR">EUR €</MenuItem>
                  <MenuItem value="GBP">GBP £</MenuItem>
                  <MenuItem value="INR">INR ₹</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={estimateProject.status || 'Draft'} onChange={handleChanged} error={!!error?.status}>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Sent">Sent</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Declined">Declined</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Reference # */}
            <TextField
              type="text"
              name="reference_no"
              id="reference-no"
              label="Reference #"
              variant="outlined"
              autoComplete="new-reference-no"
              size="small"
              onChange={handleChanged}
              value={estimateProject.reference_no || ''}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.reference_no}
              helperText={error?.reference_no}
            />

            {/* Sale Agent + Discount Type */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <StatusAutoComplete
                  onSelect={(id) => {
                    setEstimateProject((prev) => ({ ...prev, sale_agent_id: id }));
                  }}
                  label="Sale Agent"
                  required={true}
                  valueObject={estimateProject?.sale_agent_id}
                />
              </div>
              <div className="w-1/2">
                <FormControl fullWidth>
                  <InputLabel>Discount Type</InputLabel>
                  <Select name="discount_type" value={estimateProject.discount_type || 'No discount'} onChange={handleChanged}>
                    <MenuItem value="No discount">No discount</MenuItem>
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Admin Note */}
            <TextField
              multiline
              rows={4}
              type="text"
              name="admin_note"
              id="admin-note"
              label="Admin Note"
              variant="outlined"
              autoComplete="new-admin-note"
              size="small"
              onChange={handleChanged}
              value={estimateProject.admin_note || ''}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.admin_note}
              helperText={error?.admin_note}
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
                  <TableCell>Description</TableCell>
                  <TableCell>Long Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">Amount</TableCell>
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
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.long_description}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                      <TableCell align="right">${item.rate}</TableCell>
                      <TableCell align="right">{item.tax_name || 'No Tax'}</TableCell>
                      <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleOpenItemDialog(index)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteItem(index)} size="small" color="error">
                          <DeleteIcon />
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

          {/* Totals Section */}
          <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Sub Total:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">
                      ${estimateProject.subtotal?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2">Discount:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        name="discount"
                        value={estimateProject.discount || 0}
                        onChange={handleChanged}
                        sx={{ width: 80 }}
                        disabled={estimateProject.discount_type === 'No discount'}
                      />
                      <Typography variant="body2">{estimateProject.discount_type === 'percentage' ? '%' : '$'}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2">Adjustment:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        name="adjustment"
                        value={estimateProject.adjustment || 0}
                        onChange={handleChanged}
                        sx={{ width: 80 }}
                      />
                      <Typography variant="body2">$</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold" align="right">
                      ${estimateProject.total?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </div>

        {/* ======= Client Note and Terms ======= */}
        <div className="flex gap-4 mt-6">
          <div className="w-1/2">
            <TextField
              multiline
              rows={4}
              type="text"
              name="client_note"
              id="client-note"
              label="Client Note"
              variant="outlined"
              size="small"
              onChange={handleChanged}
              value={estimateProject.client_note || ''}
              sx={{ width: '100%', ...inputStyle }}
            />
          </div>
          <div className="w-1/2">
            <TextField
              multiline
              rows={4}
              type="text"
              name="terms_conditions"
              id="terms-conditions"
              label="Terms & Conditions"
              variant="outlined"
              size="small"
              onChange={handleChanged}
              value={estimateProject.terms_conditions || ''}
              sx={{ width: '100%', ...inputStyle }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-left mt-6">
          <Button type="submit" variant="contained" className="addData-button">
            {buttonLabel}
          </Button>
        </div>
      </form>

      {/* Add/Edit Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingIndex >= 0 ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Quantity Type Selection */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup row value={quantityType} onChange={(e) => setQuantityType(e.target.value)}>
                <FormControlLabel value="Qty" control={<Radio />} label="Qty" />
                <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                <FormControlLabel value="Qty/Hours" control={<Radio />} label="Qty/Hours" />
              </RadioGroup>
            </FormControl>

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

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  size="small"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: parseFloat(e.target.value) || 0 })}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Unit"
                  size="small"
                  value={itemForm.unit}
                  onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Rate"
                  type="number"
                  size="small"
                  value={itemForm.rate}
                  onChange={(e) => setItemForm({ ...itemForm, rate: parseFloat(e.target.value) || 0 })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tax</InputLabel>
                  <Select
                    value={itemForm.tax_id}
                    onChange={(e) => {
                      const selectedTax = taxOptions.find((tax) => tax.id === e.target.value);
                      setItemForm({
                        ...itemForm,
                        tax_id: e.target.value,
                        tax_name: selectedTax?.name || '',
                        tax_rate: selectedTax?.rate || 0
                      });
                    }}
                    label="Tax"
                  >
                    <MenuItem value="">
                      <em>No Tax</em>
                    </MenuItem>
                    {taxOptions.map((tax) => (
                      <MenuItem key={tax.id} value={tax.id}>
                        {tax.name} ({tax.rate}%)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  size="small"
                  value={itemForm.amount.toFixed(2)}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
              This item is optional
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <MuiAlert onClose={() => setOpen(false)} severity={severity} elevation={6} variant="filled">
          {message}
        </MuiAlert>
      </Snackbar>
    </MainCard>
  );
};

export default AddEstimate;
