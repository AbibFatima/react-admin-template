import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import BarChartSousSeg from './BarChartSousSeg';
import TenureSegmentChart from './TenureSegmentChart';

const Segments = () => (
  <ComponentSkeleton>
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h3">Répartition des clients churners/non churners sur les sous</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <BarChartSousSeg />
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h3">Répartition des clients churners/non churners sur les segments tenures</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TenureSegmentChart />
        </Grid>
      </Grid>
    </MainCard>
  </ComponentSkeleton>
);

export default Segments;
