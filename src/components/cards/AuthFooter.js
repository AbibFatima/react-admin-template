// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; Djezzy s Dashboard by&nbsp;
          <Typography component={Link} variant="subtitle2" target="_blank" underline="hover">
            F.Abib & S.Bouzidi
          </Typography>
        </Typography>

        <Stack>
          <Typography
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://www.djezzy.dz/"
            target="_blank"
            underline="hover"
          >
            Officiel web site
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
