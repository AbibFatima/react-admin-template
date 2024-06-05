import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
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
  MenuItem,
  Typography,
  Select,
  Grid,
  Snackbar,
  FormHelperText,
  Stack
} from '@mui/material';
import { EditOutlined, DeleteOutlined, AddCircleOutline, SearchOutlined } from '@mui/icons-material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import AddUser from './AddUsers';
import TableUsersHead from './TableUsersHead';
import MainCard from 'components/MainCard';

import secureLocalStorage from 'react-secure-storage';
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);

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
        const token = secureLocalStorage.getItem('token');

        const response = await fetch('//localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setUsers(jsonData.users);
        setCurrentAdminId(jsonData.current_admin_id);
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
      password: '',
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

  const handleEditUser = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch(`//localhost:5000/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          role_id: values.role
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          const errorData = await response.json();
          setErrors({ email: errorData.error });
        } else {
          throw new Error('Network response was not ok');
        }
      }

      const updatedUser = await response.json();
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      setUsers(updatedUsers);
      setOpenSnackbar(true);
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setSubmitting(false);
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
            placeholder="Recherche.."
          />
        </FormControl>
        <Box>
          <Button variant="contained" startIcon={<AddCircleOutline />} onClick={handleOpenAddDialog}>
            Ajouter un utilisateur
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            sx={{ ml: 2 }}
          >
            Effacer la sélection
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
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="secondary"
                      disabled={row.id === currentAdminId} // Disable the button for the admin's own account
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
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
          <Typography variant="h4">Modifier l&apos;utilisateur</Typography>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editedUser}
            enableReinitialize
            validationSchema={Yup.object().shape({
              firstname: Yup.string().max(255).required('Le prénom est requis'),
              lastname: Yup.string().max(255).required('Le nom de famille est requis'),
              role: Yup.number().required('Le rôle est requis'),
              email: Yup.string()
                .email('Doit être une adresse e-mail valide')
                .max(255)
                .matches(/@djezzy\.dz$/, "L'e-mail doit se terminer par @djezzy.dz")
                .required("L'adresse e-mail est requise"),
              password: Yup.string()
                .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
                .max(255)
                .required('Le mot de passe est requis')
            })}
            onSubmit={handleEditUser}
          >
            {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <MainCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="firstname">Prénom</InputLabel>
                        <OutlinedInput
                          id="firstname"
                          type="text"
                          value={values.firstname}
                          name="firstname"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                          error={Boolean(touched.firstname && errors.firstname)}
                        />
                        {touched.firstname && errors.firstname && (
                          <FormHelperText error id="helper-text-firstname">
                            {errors.firstname}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="lastname">Nom de famille</InputLabel>
                        <OutlinedInput
                          fullWidth
                          id="lastname"
                          type="text"
                          value={values.lastname}
                          name="lastname"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.lastname && errors.lastname)}
                        />
                        {touched.lastname && errors.lastname && (
                          <FormHelperText error id="helper-text-lastname">
                            {errors.lastname}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="role">Rôle</InputLabel>
                        <Select
                          labelId="role"
                          id="role"
                          name="role"
                          value={values.role}
                          variant="outlined"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          renderValue={(selected) => roles.find((role) => role.id === selected)?.name || ''}
                          error={Boolean(touched.role && errors.role)}
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.role && errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">Adresse e-mail</InputLabel>
                        <OutlinedInput
                          fullWidth
                          id="email"
                          type="email"
                          value={values.email}
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="name@djezzy.dz"
                          error={Boolean(touched.email && errors.email)}
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="helper-text-email">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="password">Mot de passe</InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.password && errors.password)}
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                              >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                          placeholder="******"
                          inputProps={{}}
                        />
                        {touched.password && errors.password && (
                          <FormHelperText error id="helper-text-password-signup">
                            {errors.password}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>

                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <DialogActions>
                      <Button type="submit" variant="contained" color="primary">
                        Sauvegarder
                      </Button>
                      <Button onClick={handleEditDialogClose} color="secondary">
                        Annuler
                      </Button>
                    </DialogActions>
                  </Box>
                </MainCard>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Utilisateur modifié avec succès !
        </Alert>
      </Snackbar>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>
          <Typography variant="h4">Ajouter un utilisateur</Typography>
        </DialogTitle>
        <DialogContent>
          <AddUser onAddUser={handleAddUser} />
          <DialogActions>
            <Button onClick={handleAddDialogClose} color="secondary">
              Annuler
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
