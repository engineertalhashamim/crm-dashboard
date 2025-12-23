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
import { setAllLead, setDeleteLead, setLoading, setError } from '../../../store/slices/leadSlice.js';
import LoopIcon from '@mui/icons-material/Loop';
import NoDataFound from '../../../ui-component/common/NoDataFound.jsx';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)

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

const ListLead = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState('');

  // Toaster
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [snackSeverity, setSnackSeverity] = React.useState('success');

  const dispatch = useDispatch();
  const { error, loading, leadsArr } = useSelector((state) => state.lead);

  const navigate = useNavigate();
  const gotoaddlead = () => {
    navigate('/crm/lead/add');
  };

  useEffect(() => {
    const getAllLeads = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/lead/getalllead');
        const resData = res.data?.data || [];
        dispatch(setAllLead(resData));
      } catch (error) {
        console.log('Error in fetching lead', error);
        dispatch(setError(error.message || 'Failed to fetch lead'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAllLeads();
  }, [dispatch]);

  useEffect(() => {
    console.log('redux leads data is.. ', leadsArr);
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    try {
      const deleteContract = await axios.delete(`http://localhost:8000/api/v1/lead/deletelead/${selectedId}`);
      console.log('delte id is..', selectedId);
      dispatch(setDeleteLead(selectedId));
      // setSnack
      console.log('delete confirm res..');
    } catch (error) {
      console.log('Error deleting leads', error);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { label: '#' },
    { label: 'Name' },
    { label: 'Comapny' },
    { label: 'Email' },
    { label: 'Phone' },
    { label: 'Value' },
    { label: 'Tags' },
    { label: 'Assigned' },
    { label: 'Status' },
    { label: 'Source' },
    { label: 'Last Contact' },
    { label: 'Created' },
    { label: 'Action' }
  ];

  const columnsCount = columns.length;

  useEffect(() => {
    console.log('test lead list..', leadsArr);
  }, [leadsArr]);

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
            Leads
          </Typography>
          <Typography gutterBottom component="div">
            <Button onClick={gotoaddlead} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
              Add Leads
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
                } else if (Array.isArray(leadsArr) && leadsArr.length > 0) {
                  tableContent = leadsArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name_lead}</TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone1}</TableCell>
                        <TableCell>{row.leadValue}</TableCell>
                        <TableCell>{row.tags}</TableCell>
                        <TableCell>{row.assignedUserId?.name}</TableCell>
                        <TableCell>{row.statusId?.statusname}</TableCell>
                        <TableCell>{row.sourceId?.sourcename}</TableCell>
                        <TableCell>{row.phone2}</TableCell>
                        <TableCell>{dayjs(row.createdAt).fromNow()}</TableCell>
                        {/*<TableCell></TableCell>*/}
                        <TableCell>
                          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <EditIcon
                              onClick={() => navigate(`/crm/lead/edit/${row.id}`)}
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                            />
                            <DeleteIcon
                              onClick={() => handleOpenDelete(row.id, row.parentCustomer?.companyname)}
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
                        <NoDataFound message="No Leads Found" onAddClick={gotoaddlead} />
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
          count={leadsArr.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteDialog open={openDelete} onClose={handleCloseDelete} onConfirm={handleConfirmDelete} name={selectedName} />
    </MainCard>
  );
};

export default ListLead;
