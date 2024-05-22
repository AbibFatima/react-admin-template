// material-ui
import { Box, Grid } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import ColumnChartUplift from './ColumnChartUplift';

// ===============================|| COMPONENT - FORM PREDICTION ||=============================== //
const Uplift = () => (
  <ComponentSkeleton>
    <MainCard>
      <Grid>
        <Box mt={2}>
          <MainCard sx={{ mt: 2 }} content={false}>
            <ColumnChartUplift />
          </MainCard>
        </Box>
      </Grid>
    </MainCard>
  </ComponentSkeleton>
);

export default Uplift;
