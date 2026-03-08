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
import { setAllProject, setDeleteProject, setLoading, setError } from '../../../store/slices/projectSlice.js';
import LoopIcon from '@mui/icons-material/Loop';
import NoDataFound from '../../../ui-component/common/NoDataFound.jsx';
import React from 'react';
import Chip from '@mui/material/Chip';

const ListEstimate = () => {
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
  const { error, loading, projectsArr } = useSelector((state) => state.project);

  const navigate = useNavigate();
  const gotoaddproj = () => {
    navigate('/crm/estimates/add');
  };

  useEffect(() => {
    const getAllLeads = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get('http://localhost:8000/api/v1/project/getallproject');
        const resData = res.data?.data || [];
        dispatch(setAllProject(resData));
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
    console.log('redux projects data is..', projectsArr);
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    try {
      const deleteProject = await axios.delete(`http://localhost:8000/api/v1/project/deleteproject/${selectedId}`);
      console.log('delte id is..', selectedId);
      dispatch(setDeleteProject(selectedId));
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
    { label: 'Estimate#' },
    { label: 'Amount' },
    { label: 'Total Tax' },
    { label: 'Customer' },
    { label: 'Project' },
    { label: 'Tags' },
    { label: 'Date' },
    { label: 'Expiry Date' },
    { label: 'References#' },
    { label: 'Status' },
    { label: 'Action' }
  ];

  const columnsCount = columns.length;

  useEffect(() => {
    console.log('redux after effect data is..', projectsArr);
  }, [dispatch]);

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
            Estimates
          </Typography>
          <Typography gutterBottom component="div">
            <Button onClick={gotoaddproj} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
              Add Estimate
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
                } else if (Array.isArray(projectsArr) && projectsArr.length > 0) {
                  tableContent = projectsArr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell>EST-00011</TableCell>
                        <TableCell>€1.860,00</TableCell>
                        <TableCell>€360,00</TableCell>
                        <TableCell>Thiral</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>16-02-2026</TableCell>
                        <TableCell>02-03-2026</TableCell>
                        <TableCell>02111#</TableCell>
                        <TableCell>Accepted</TableCell>
                        <TableCell>
                          <Stack spacing={2} direction="row" sx={{ justifyContent: 'flex-end' }}>
                            <EditIcon
                              onClick={() => navigate(`/crm/projects/edit/${row.id}`)}
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                            />
                            <DeleteIcon
                              onClick={() => handleOpenDelete(row.id, row.project_name)}
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
                        <NoDataFound message="No Leads Found" onAddClick={gotoaddproj} />
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
          // count={leadsArr.length}
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

export default ListEstimate;
