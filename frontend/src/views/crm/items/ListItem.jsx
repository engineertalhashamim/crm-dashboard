import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Modal, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import DeleteDialog from '../../../ui-component/dialog-box/DeleteDialog.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setAllItem, setDeleteItem, setLoading, setError } from '../../../store/slices/ItemSlice.js';
import LoopIcon from '@mui/icons-material/Loop';
import NoDataFound from '../../../ui-component/common/NoDataFound.jsx';
import AddItem from './AddItem.jsx';
import Snackbar from '@mui/material/Snackbar';

const ListItem = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [openMode, setOpenMode] = useState(false);
  const [editModalId, setEditModalId] = useState(null);

  // Toaster
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snackSeverity, setSnackSeverity] = React.useState('success');

  const dispatch = useDispatch();
  const { error, loading, itemArr } = useSelector((state) => state.item);

  useEffect(() => {
    const getAllUsers = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/item/getallitem', { withCredentials: true });
        const resData = res.data?.data || [];
        dispatch(setAllItem(resData));
      } catch (error) {
        dispatch(setError(error.message || 'Failed to fetch item'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAllUsers();
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/item/deleteitem/${selectedId}`, { withCredentials: true });
      dispatch(setDeleteItem(selectedId));
      setSnackMessage('Item deleted successfully!');
    } catch (error) {
      setSnackMessage('something went wrong!');
      setSnackSeverity('error');
      console.log('Error deleting item', error);
    }

    setSnackSeverity('success');
    setSnackOpen(true);
    handleCloseDelete();
  };

  const handleOpenDelete = (id, name) => {
    setSelectedId(id);
    setSelectedName(name);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedId(null);
  };

  const handleChangeCloseMode = () => {
    setOpenMode(false);
  };

  const handleChangeOpenMode = (id) => {
    setOpenMode(true);
    setEditModalId(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { label: 'Description' },
    { label: 'Long Description' },
    { label: 'Rate' },
    { label: 'Tax 1' },
    { label: 'Tax 2' },
    { label: 'Unit' },
    { label: 'Group Name' },
    { label: 'Action' }
  ];

  const columnsCount = columns.length;

  return (
    <>
      <Modal open={openMode} onClose={handleChangeCloseMode}>
        <AddItem
          CloseEvent={handleChangeCloseMode}
          setSnackOpen={setSnackOpen}
          setSnackMessage={setSnackMessage}
          setSnackSeverity={setSnackSeverity}
          editModaVar={editModalId}
        />
      </Modal>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
        <MuiAlert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMessage}
        </MuiAlert>
      </Snackbar>
      <MainCard>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Stack
            spacing={2}
            direction="row"
            style={{
              justifyContent: 'space-between',
              paddingBottom: '20px',
              alignItems: 'center',
              borderBottom: '1px solid #e3e8ef'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 500, fontSize: '1.155rem' }}>
              Items
            </Typography>
            <Typography gutterBottom component="div">
              <Button onClick={() => handleChangeOpenMode(null)} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
                Add Item
              </Button>
            </Typography>
          </Stack>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((col, index) => {
                    return (
                      <TableCell
                        key={col.label}
                        style={{
                          minWidth: '100px',
                          fontWeight: index === 0 ? '700' : '500',
                          color: index === 0 ? '#000000' : '#364152',
                          whiteSpace: 'nowrap'
                        }}
                        align={col.label === 'Action' ? 'right' : 'left'}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {col.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {(() => {
                  let tableContent;
                  if (loading) {
                    tableContent = (
                      <TableRow>
                        <TableCell colSpan={columnsCount} align="center">
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                            <LoopIcon
                              sx={{
                                fontSize: 28,
                                color: 'primary.main',
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                  '0%': { transform: 'rotate(0deg)' },
                                  '100%': { transform: 'rotate(360deg)' }
                                }
                              }}
                            />
                            <Typography variant="body2">Loading...</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  } else if (error && typeof error !== 'object') {
                    tableContent = (
                      <TableRow>
                        <TableCell colSpan={columnsCount} align="center" sx={{ color: 'red' }}>
                          Error: {error}
                        </TableCell>
                      </TableRow>
                    );
                  } else if (Array.isArray(itemArr) && itemArr.length > 0) {
                    tableContent = itemArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id}>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.long_description ? row.long_description : '-'}</TableCell>
                          <TableCell>{row.rate}</TableCell>
                          <TableCell>{row.tax_1}</TableCell>
                          <TableCell>{row.tax_2}</TableCell>
                          <TableCell>{row.unit ? row.unit : '-'}</TableCell>
                          <TableCell>{row.item_group ? row.item_group : '-'}</TableCell>
                          <TableCell>
                            <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                              <EditIcon
                                onClick={() => handleChangeOpenMode(row.id)}
                                style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                              />
                              <DeleteIcon
                                onClick={() => handleOpenDelete(row.id, row.username)}
                                style={{ fontSize: '20px', color: 'darkred', cursor: 'pointer' }}
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    });
                  } else {
                    tableContent = (
                      <TableRow>
                        <TableCell colSpan={columnsCount} align="center">
                          <NoDataFound message="No item Found" onAddClick={() => handleChangeOpenMode(null)} />
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return tableContent;
                })()}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[7, 25, 100]}
            component="div"
            count={itemArr.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <DeleteDialog open={openDelete} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} name={selectedName} />
      </MainCard>
    </>
  );
};

export default ListItem;
