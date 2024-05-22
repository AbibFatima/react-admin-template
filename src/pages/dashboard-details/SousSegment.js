// material-ui
import { Grid, Stack, Typography } from '@mui/material';
//import ReactApexChart from 'react-apexcharts';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import BarChartSousSeg from './BarChartSousSeg';

// ===============================|| COMPONENT - FORM PREDICTION ||=============================== //
const SousSegment = () => (
  <ComponentSkeleton>
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h3">Form Customer Prediction</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <BarChartSousSeg />
        </Grid>
      </Grid>
    </MainCard>
  </ComponentSkeleton>
);

export default SousSegment;
