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
import { setContact, setDeleteContact, setLoading, setError } from '../../../store/slices/contactSlice.js';
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

export default function ListContacts() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  const dispatch = useDispatch();
  const { error, loading, contacts } = useSelector((state) => state.contact);

  const navigate = useNavigate();
  const gotoaddcontacts = () => {
    navigate('/crm/contacts/add');
  };

  useEffect(() => {
    const getAllContacts = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/contact/getallcontact');
        const resData = res.data?.data || [];
        dispatch(setContact(resData));
      } catch (error) {
        console.log('Error in fetching contact', error);
        dispatch(setError(error.message || 'Failed to fetch contact'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAllContacts();
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    console.log('delete confirm..');
    try {
      const deleteContact = await axios.delete(`http://localhost:8000/api/v1/contact/deletecontact/${selectedId}`);
      dispatch(setDeleteContact(selectedId));
      console.log('delete confirm res..');
    } catch (error) {
      console.log('Error deleting contact', error);
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

  const columns = [
    { label: 'Full Name' },
    { label: 'Email' },
    { label: 'Position' },
    { label: 'Phone' },
    { label: 'Status' },
    { label: 'Action' }
  ];

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
            Contacts
          </Typography>
          <Typography gutterBottom component="div">
            <Button onClick={gotoaddcontacts} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
              Add Contacts
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
                } else if (Array.isArray(contacts) && contacts.length > 0) {
                  tableContent = contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell>
                          {row.firstname} {row.lastname}
                        </TableCell>
                        <TableCell>{row.email} </TableCell>
                        <TableCell>{row.position}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>
                          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <EditIcon
                              onClick={() => navigate(`/crm/contacts/edit/${row.id}`)}
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                            />
                            <DeleteIcon
                              onClick={() => handleOpenDelete(row.id, row.firstname)}
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
                        <NoDataFound message="No Contracts Found" onAddClick={gotoaddcontacts} />
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
          count={contacts.length}
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
