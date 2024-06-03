import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  MenuItem,
  Select,
  Stack,
  Snackbar
} from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
//import { Alert as MuiAlert } from '@mui/material';

import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import MainCard from 'components/MainCard';

// ============================|| ADD USER - DIALOG ||============================ //

const AddUser = () => {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');

    const fetchRoles = async () => {
      try {
        const response = await fetch('//localhost:5000/roles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rolesData = await response.json();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <>
      <MainCard>
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
            User added successfully!
          </Alert>
        </Snackbar>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            role_id: ''
          }}
          validationSchema={Yup.object().shape({
            firstname: Yup.string().max(255).required('Firstname is required'),
            lastname: Yup.string().max(255).required('Lastname is required'),
            role_id: Yup.number().required('Role is required'),
            email: Yup.string()
              .email('Must be a valid email')
              .max(255)
              .matches(/@djezzy\.dz$/, 'Email must end with @djezzy.dz')
              .required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const response = await fetch('//localhost:5000/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
              });

              const data = await response.json();
              if (!response.ok) {
                if (response.status === 409) {
                  // Cas où l'e-mail existe déjà
                  setErrors({ email: data.error });
                } else {
                  // Cas d'autres erreurs
                  setErrors({ submit: data.message });
                }
              } else {
                setStatus({ success: true });
                setSubmitting(true);
                setOpenSnackbar(true);
              }
            } catch (error) {
              console.log('Error:', error);
              setErrors({ submit: error.message });
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstname-signup">First Name</InputLabel>
                    <OutlinedInput
                      id="firstname-signup"
                      type="text"
                      value={values.firstname}
                      name="firstname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={Boolean(touched.firstname && errors.firstname)}
                    />
                    {touched.firstname && errors.firstname && (
                      <FormHelperText error id="helper-text-firstname-signup">
                        {errors.firstname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastname-signup">Last Name</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="lastname-signup"
                      type="text"
                      value={values.lastname}
                      name="lastname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.lastname && errors.lastname)}
                    />
                    {touched.lastname && errors.lastname && (
                      <FormHelperText error id="helper-text-lastname-signup">
                        {errors.lastname}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role">Role</InputLabel>
                    <Select
                      labelId="role"
                      id="role_id"
                      name="role_id"
                      value={values.role_id}
                      onChange={(event) => {
                        const { value } = event.target;
                        handleChange({
                          target: {
                            name: 'role_id',
                            value: typeof value === 'string' ? Number(value) : value
                          }
                        });
                      }}
                      variant="outlined"
                      error={Boolean(touched.role_id && errors.role_id)}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.role_id && errors.role_id && <FormHelperText error>{errors.role_id}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-signup">Email Address</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="name@djezzy.dz"
                      error={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-signup">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
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
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
              </Grid>
              <Box mt={2} display="flex" justifyContent="flex-end">
                <AnimateButton>
                  <Button color="primary" disabled={isSubmitting} type="submit" variant="contained">
                    Submit
                  </Button>
                </AnimateButton>
              </Box>
            </form>
          )}
        </Formik>
      </MainCard>
    </>
  );
};

export default AddUser;
