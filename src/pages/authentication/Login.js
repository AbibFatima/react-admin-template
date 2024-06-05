// material-ui
import { Grid, Stack, Typography, Box } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';
import loginImage from './img/undraw_Predictive_analytics_re_wxt8.png';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3} alignItems="stretch" sx={{ minHeight: 'calc(60vh - 64px)' }}>
      <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Box
          component="img"
          src={loginImage}
          alt="Login"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid container spacing={3} sx={{ maxWidth: 475 }}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 1, sm: 2 } }}>
              <Typography variant="h1">Bienvenue !</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { sm: 2 } }}>
              <Typography variant="h3">Se connecter</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <AuthLogin />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
