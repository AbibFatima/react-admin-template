import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Select,
  Grid
} from '@mui/material';
import { EditOutlined, DeleteOutlined, AddCircleOutline, SearchOutlined } from '@mui/icons-material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import AddUser from './AddUsers';
import TableUsersHead from './TableUsersHead';
import MainCard from 'components/MainCard';

// ==============================|| USERS TABLE ||============================== //

export default function UsersTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [editedUser, setEditedUser] = useState({
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('//localhost:5000/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setUsers(jsonData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch('//localhost:5000/roles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonRoles = await response.json();
        setRoles(jsonRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchData();
    fetchRoles();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`//localhost:5000/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setUsers(users.filter((user) => user.id !== userId));
      setSelectedRows(selectedRows.filter((rowId) => rowId !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const promises = selectedRows.map((userId) => fetch(`//localhost:5000/users/${userId}`, { method: 'DELETE' }));
      await Promise.all(promises);
      setUsers(users.filter((user) => !selectedRows.includes(user.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected users:', error);
    }
  };

  const handleRowSelect = (userId) => {
    const selectedIndex = selectedRows.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
    }

    setSelectedRows(newSelected);
  };

  const handleEditDialogOpen = (user) => {
    setEditedUser({
      ...user,
      role: user.role ? user.role.id : ''
    });
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditedUser({
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role: ''
    });
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch(`//localhost:5000/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editedUser,
          role_id: editedUser.role
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      setUsers(updatedUsers);
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    handleAddDialogClose();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      user.lastname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.role && user.role.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <FormControl variant="outlined">
          <OutlinedInput
            value={search}
            onChange={handleSearchChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            }
            placeholder="Search Users"
          />
        </FormControl>
        <Box>
          <Button variant="contained" startIcon={<AddCircleOutline />} onClick={handleOpenAddDialog}>
            Add User
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            sx={{ ml: 2 }}
          >
            Delete Selected
          </Button>
        </Box>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            position: 'relative',
            display: 'block',
            maxWidth: '100%',
            '& td, & th': { whiteSpace: 'nowrap' }
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            sx={{
              '& .MuiTableCell-root:first-of-type': {
                pl: 2
              },
              '& .MuiTableCell-root:last-of-type': {
                pr: 3
              }
            }}
          >
            <TableUsersHead />
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={selectedRows.indexOf(row.id) !== -1} onChange={() => handleRowSelect(row.id)} />
                  </TableCell>
                  <TableCell align="left">
                    <Typography color="secondary">{row.id}</Typography>
                  </TableCell>
                  <TableCell align="left">{row.firstname}</TableCell>
                  <TableCell align="left">{row.lastname}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.role ? row.role.name : ''}</TableCell>
                  <TableCell align="left">
                    <IconButton onClick={() => handleEditDialogOpen(row)} color="primary">
                      <EditOutlined />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left">
                    <IconButton onClick={() => handleDelete(row.id)} color="secondary">
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>
          <Typography variant="h4">Edit User</Typography>
        </DialogTitle>
        <DialogContent>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  value={editedUser.firstname}
                  onChange={(e) => setEditedUser({ ...editedUser, firstname: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  value={editedUser.lastname}
                  onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="roles-select-label">Roles</InputLabel>
                  <Select
                    labelId="roles-select-label"
                    id="roles-select"
                    value={editedUser.role}
                    onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    renderValue={(selected) => roles.find((role) => role.id === selected)?.name || ''}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={editedUser.password}
                    onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </MainCard>
          <DialogActions>
            <Button variant="contained" onClick={handleEditUser} color="primary">
              Save Changes
            </Button>
            <Button onClick={handleEditDialogClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>
          <Typography variant="h4">Add User</Typography>
        </DialogTitle>
        <DialogContent>
          <AddUser onAddUser={handleAddUser} />
          <DialogActions>
            <Button onClick={handleAddDialogClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
