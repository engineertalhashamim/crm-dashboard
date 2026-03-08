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
import { setAllSource, setDeleteSource, setLoading, setError } from '../../../store/slices/sourceSlice.js';
import LoopIcon from '@mui/icons-material/Loop';
import NoDataFound from '../../../ui-component/common/NoDataFound.jsx';
import AddSource from './AddSources.jsx';
import Snackbar from '@mui/material/Snackbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const ListSources = () => {
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
  const {error,loading, sourceArr} = useSelector((state)=> state.source);

  useEffect(() => {
    const getAllSource = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/source/getallsource');
        const resData = res.data?.data || [];
        dispatch(setAllSource(resData));
      } catch (error) {
        console.log('Error in fetching source', error);
        dispatch(setError(error.message || 'Failed to fetch source'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAllSource();
  }, [dispatch]);

  // useEffect(() => {
  //   console.log('redux data source is.. ', sourceArr);
  // }, [sourceArr]);

  const handleConfirmDelete = async () => {
    try {
      const deleteSource = await axios.delete(`http://localhost:8000/api/v1/source/deletesource/${selectedId}`);
      dispatch(setDeleteSource(selectedId));
      setSnackMessage('source deleted successfully!');
    } catch (error) {
      setSnackMessage('something wet wrong!');
      setSnackSeverity('error');
      console.log('Error deleting source', error);
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

  const columns = [{ label: 'Sno#' }, { label: 'SourceName' }, { label: 'Action' }];

  const columnsCount = columns.length;

  return (
    <>
      <Modal open={openMode} onClose={handleChangeCloseMode}>
        <AddSource
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
              borderBottom: '1px solid #e3e8ef',
              marginBottom: '10px'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 500, fontSize: '1.155rem' }}>
              Source
            </Typography>
            <Typography gutterBottom component="div">
              <Button onClick={() => handleChangeOpenMode(null)} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
                Add Source
              </Button>
            </Typography>
          </Stack>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((col) => {
                    return (
                      <TableCell
                        key={col.label}
                        style={{ minWidth: '100px', fontWeight: '600' }}
                        align={col.label === 'Action' ? 'right' : 'left'}
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
                  } else if (Array.isArray(sourceArr) && sourceArr.length > 0) {
                    tableContent = sourceArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.sourcename}</TableCell>
                          <TableCell>
                            <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                              <EditIcon
                                onClick={() => handleChangeOpenMode(row.id)}
                                style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                              />
                              <DeleteIcon
                                onClick={() => handleOpenDelete(row.id, row.sourcename)}
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
                          <NoDataFound message="No source Found" onAddClick={() => handleChangeOpenMode(null)} />
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
            count={sourceArr.length}
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

export default ListSources;
