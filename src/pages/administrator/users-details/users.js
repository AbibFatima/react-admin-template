// material-ui
import { Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';

import UsersTable from './UsersTable';
// ===============================|| COMPONENT - USERS||=============================== //
const Users = () => (
  <ComponentSkeleton>
    <Grid item xs={12}>
      <MainCard sx={{ mt: 2 }} content={false}>
        <UsersTable />
      </MainCard>
    </Grid>
  </ComponentSkeleton>
);

export default Users;
