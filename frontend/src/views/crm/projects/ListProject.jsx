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

const ListProject = () => {
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
    navigate('/crm/projects/add');
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
    { label: '#' },
    { label: 'Project Name' },
    { label: 'Customer' },
    { label: 'Tags' },
    { label: 'Start Date' },
    { label: 'Deadline' },
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
            Projects
          </Typography>
          <Typography gutterBottom component="div">
            <Button onClick={gotoaddproj} variant="contained" className="addData-button" endIcon={<AddCircleIcon />}>
              Add Project
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
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.project_name}</TableCell>
                        <TableCell>{row.customer?.companyname}</TableCell>
                        {/* <TableCell>{row.tags}</TableCell> */}
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {row.tags?.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  backgroundColor: '#d1d5db4d',
                                  fontWeight: 500,
                                  color: '#1f2937',
                                  borderRadius: '4px'
                                }}
                              />
                            ))}
                          </Stack>
                        </TableCell>
                        <TableCell>{row.start_date}</TableCell>
                        <TableCell>{row.deadline}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              fontWeight: 500,
                              backgroundColor: '#f6f9fe',
                              color: '#2563eb',
                              border: '1px solid #a8c1f7',
                              padding: '0.25rem 0rem',
                              height: 'unset'
                            }}
                          />
                        </TableCell>
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

export default ListProject;
