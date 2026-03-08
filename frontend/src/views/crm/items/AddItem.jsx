import { TextField, Button, Stack, IconButton, FormControl, InputLabel, Select, FormHelperText, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'ui-component/cards/MainCard';
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError, setAddItem, setUpdateItem, clearError } from '../../../store/slices/ItemSlice.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
  textAlign: 'center'
};

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

const AddItem = ({ CloseEvent, setSnackOpen, setSnackMessage, setSnackSeverity, editModaVar }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.item);

  const [itemForm, setItemForm] = useState({
    description: '',
    long_description: '',
    rate: '',
    tax_1: 'No Tax',
    tax_2: 'No Tax',
    unit: '',
    item_group: null
  });

  const [taxOptions, setTaxOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setItemForm({
      ...itemForm,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const res = await axios.get('http://localhost:8000/api/v1/item/getitemoptions');
      setGroupOptions(res.data?.itemGroupOptions);
      setTaxOptions(res.data?.itemTaxOptions);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    dispatch(clearError());
  }, [editModaVar]);

  useEffect(() => {
    if (editModaVar) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/v1/item/singleitemdata/${editModaVar}`, { withCredentials: true });
          const data = res.data?.data;
          console.log('this is data...', data);
          setItemForm({
            description: data.description,
            long_description: data.long_description,
            rate: data.rate,
            tax_1: data.tax_1,
            tax_2: data.tax_2,
            unit: data.unit,
            item_group: data.item_group
          });
        } catch (err) {
          console.error('Error fetching item:', err);
        } finally {
          console.log('All are perfect');
        }
      };
      fetchItem();
    }
  }, [editModaVar]);

  const itemDataSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (editModaVar) {
        const res = await axios.put(`http://localhost:8000/api/v1/item/updateitem/${editModaVar}`, itemForm, { withCredentials: true });
        const resData = res.data?.data;
        if (resData.id) {
          dispatch(setUpdateItem(resData));
          setSnackMessage('item updated successfully!');
        } else {
          setSnackMessage('Invalid edit response data');
          setSnackSeverity('error');
        }
      } else {
        const res = await axios.post('http://localhost:8000/api/v1/item/createitem', itemForm);
        const resData = res.data?.data;

        if (resData.id) {
          dispatch(setAddItem(resData));
          setSnackMessage('Item added successfully!');
        } else {
          setSnackMessage('Invalid response data');
          setSnackSeverity('error');
        }
      }

      setSnackSeverity('success');
      setSnackOpen(true);
      CloseEvent();
    } catch (err) {
      const backendErrorsArray = err.response?.data?.errors || [];
      const formattedErrors = backendErrorsArray.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});

      const errorMessage = editModaVar ? 'Failed to update item' : 'Failed to add item';
      dispatch(setError(formattedErrors));
      setSnackMessage(errorMessage || 'Something went wrong');
      setSnackSeverity('error');
      setSnackOpen(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const buttonLabel = loading ? (editModaVar ? 'Updating...' : 'Submitting...') : editModaVar ? 'Update Item' : 'Add Item';

  return (
    <>
      <MainCard sx={{ ...style }} title={editModaVar ? 'Edit Item' : 'Add Item'} className="modal-pop-cls">
        <Stack direction="row" justifyContent="flex-end" position={'absolute'} right={8} top={8}>
          <IconButton onClick={CloseEvent}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <form onSubmit={itemDataSubmit} style={{ Padding: '0' }}>
          <div className="w-full flex flex-col gap-4 text-left">
            <TextField
              type="text"
              name="description"
              id="outlined-basic"
              label="Description"
              variant="outlined"
              autoComplete="new-description"
              size="small"
              onChange={handleChanged}
              value={itemForm.description}
              sx={{
                flex: 1,
                ...inputStyle
              }}
              error={!!error?.description}
              helperText={error?.description}
            />
            <TextField
              multiline
              rows={4}
              type="text"
              label="Long Description"
              name="long_description"
              fullWidth
              onChange={handleChanged}
              sx={{
                ...inputStyle
              }}
              value={itemForm.long_description}
              error={!!error?.long_description}
              helperText={error?.long_description}
            />
            <TextField
              type="number"
              name="rate"
              id="outlined-basic"
              label="Rate"
              variant="outlined"
              autoComplete="new-rate"
              size="small"
              onChange={handleChanged}
              value={itemForm.rate}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.rate}
              helperText={error?.rate}
            />

            {/* Bill To / Ship To */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <FormControl
                  fullWidth
                  sx={{
                    ...inputStyle
                  }}
                  error={!!error?.tax_1}
                >
                  <InputLabel id="demo-simple-select-label2">Tax 2</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select"
                    label="Tax 1"
                    name="tax_1"
                    onChange={handleChanged}
                    value={itemForm.tax_1 || ''}
                  >
                    {taxOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.tax_1}</FormHelperText>
                </FormControl>
              </div>
              <div className="w-1/2">
                <FormControl
                  fullWidth
                  sx={{
                    ...inputStyle
                  }}
                  error={!!error?.tax_2}
                >
                  <InputLabel id="demo-simple-select-label">Tax 2</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Tax 2"
                    name="tax_2"
                    onChange={handleChanged}
                    value={itemForm.tax_2 || ''}
                  >
                    {taxOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.tax_2}</FormHelperText>
                </FormControl>
              </div>
            </div>

            <TextField
              type="text"
              name="unit"
              id="outlined-basic"
              label="Unit"
              variant="outlined"
              autoComplete="new-unit"
              size="small"
              onChange={handleChanged}
              value={itemForm.unit}
              sx={{
                minWidth: '100%',
                ...inputStyle
              }}
              error={!!error?.unit}
              helperText={error?.unit}
            />

            <FormControl
              fullWidth
              sx={{
                ...inputStyle
              }}
              error={!!error?.item_group}
            >
              <InputLabel id="demo-simple-select-label">Item Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Item group"
                name="item_group"
                onChange={handleChanged}
                value={itemForm.item_group || ''}
              >
                {groupOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error?.item_group}</FormHelperText>
            </FormControl>
          </div>

          <div className="flex justify-center mt-3">
            <Button type="submit" variant="contained" className="addData-button">
              {buttonLabel}
            </Button>
          </div>
        </form>
      </MainCard>
    </>
  );
};

export default AddItem;
