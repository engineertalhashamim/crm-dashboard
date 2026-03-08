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
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import DeleteDialog from '../../../ui-component/dialog-box/DeleteDialog.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setClient, setLoading, setError } from '../../../store/slices/clientSlice.js';
import LoopIcon from '@mui/icons-material/Loop';
import NoDataFound from '../../../ui-component/common/NoDataFound.jsx';

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

// ==============================|| SAMPLE PAGE ||============================== //

export default function ListClients() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  const dispatch = useDispatch();
  const { error, loading, clients } = useSelector((state) => state.client);

  const navigate = useNavigate();
  const gotoaddclient = () => {
    navigate('/crm/clients/add');
  };

  useEffect(() => {
    const getAllclients = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/client/getallclients');
        const resData = res.data?.data || [];
        dispatch(setClient(resData));
      } catch (error) {
        console.log('Error in fetching clients ', error);
        dispatch(setError(error.message || 'Failed to fetch clients'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAllclients();
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    try {
      const deleteClient = await axios.delete(`http://localhost:8000/api/v1/client/deleteclient/${selectedId}`);
      console.log('delete response id???', selectedId);
      dispatch(deleteClient(selectedId));
      // setClientData((prev) => prev.filter((c) => c.id !== selectedId))
    } catch (error) {
      console.log('Error deleting client', error);
    }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //  <TableCell style={{ minWidth: '100px', fontWeight: '600' }}>Company</TableCell>
  //               <TableCell style={{ minWidth: '100px', fontWeight: '600' }}>Phone</TableCell>
  //               <TableCell style={{ minWidth: '100px', fontWeight: '600' }}>Email</TableCell>
  //               <TableCell style={{ minWidth: '100px', fontWeight: '600' }}>Date Created</TableCell>
  //               <TableCell align="right" style={{ minWidth: '100px', fontWeight: '600' }}>
  //                 Action
  //               </TableCell>

  const columns = [{ label: 'Company' }, { label: 'Phone' }, { label: 'Email' }, { label: 'Date Created' }, { label: 'Action' }];

  const columnsCount = columns.length;

  return (
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
            Compaines
          </Typography>
          <Typography gutterBottom component="div">
            <Button onClick={gotoaddclient} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
              ADD CLIENT
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
                } else if (Array.isArray(clients) && clients.length > 0) {
                  tableContent = clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell>{row.companyname}</TableCell>
                        <TableCell>{row.phone} </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <EditIcon
                              onClick={() => navigate(`/crm/clients/edit/${row.id}`)}
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                            />
                            <DeleteIcon
                              onClick={() => handleOpenDelete(row.id, row.companyname)}
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
                        <NoDataFound message="No Contracts Found" onAddClick={gotoaddclient} />
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
          count={clients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteDialog open={openDelete} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} name={selectedName} />
    </MainCard>
  );
}
