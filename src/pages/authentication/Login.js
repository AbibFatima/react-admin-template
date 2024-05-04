import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import { Alert, AlertTitle, Box, Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// // ================================|| LOGIN ||================================ //

const Login = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('success') === 'true';
    setShowSuccessAlert(isSuccess);
  }, []);

  return (
    <>
      {showSuccessAlert && ( //NOT SHOWING ANYTHING
        <Box
          sx={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999
          }}
        >
          <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
            <AlertTitle>Success</AlertTitle>
            User Registered Successfully!
          </Alert>
        </Box>
      )}
      <AuthWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Login</Typography>
              <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                Don&apos;t have an account?
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthLogin />
          </Grid>
        </Grid>
      </AuthWrapper>
    </>
  );
};

export default Login;
