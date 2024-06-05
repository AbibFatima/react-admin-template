import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required('First Name is required'),
  lastname: Yup.string().required('Last Name is required'),
  role: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const EditUserDialog = ({ openEditDialog, handleEditDialogClose, editedUser, setEditedUser, roles }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleEditUser = async (values) => {
    try {
      const response = await fetch(`//localhost:5000/users/${editedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      setEditedUser(updatedUser);
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
      <DialogTitle>
        <Typography variant="h4">Edit User</Typography>
      </DialogTitle>
      <DialogContent>
        <Formik initialValues={editedUser} validationSchema={validationSchema} onSubmit={handleEditUser}>
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="First Name"
                    name="firstname"
                    margin="normal"
                    error={touched.firstname && Boolean(errors.firstname)}
                    helperText={touched.firstname && errors.firstname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    error={touched.lastname && Boolean(errors.lastname)}
                    helperText={touched.lastname && errors.lastname}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={touched.role && Boolean(errors.role)}>
                    <InputLabel id="roles-select-label">Roles</InputLabel>
                    <Field
                      as={Select}
                      labelId="roles-select-label"
                      id="roles-select"
                      name="role"
                      renderValue={(selected) => roles.find((role) => role.id === selected)?.name || ''}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.role && Boolean(errors.role) && (
                      <Typography color="error" variant="caption">
                        {errors.role}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth error={touched.password && Boolean(errors.password)}>
                    <InputLabel>Password</InputLabel>
                    <Field
                      as={OutlinedInput}
                      name="password"
                      type={showPassword ? 'text' : 'password'}
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
                    {touched.password && Boolean(errors.password) && (
                      <Typography color="error" variant="caption">
                        {errors.password}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <DialogActions>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
                <Button onClick={handleEditDialogClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
