import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import BarChartSousSeg from './BarChartSousSeg';
import TenureSegmentChart from './TenureSegmentChart';

const Segments = () => (
  <ComponentSkeleton>
    <MainCard>
      <Grid item xs={12}>
        <Stack justifyContent="center" alignItems="center">
          <Typography variant="h3">Répartition des clients churners/non churners sur les sous</Typography>
        </Stack>
        <BarChartSousSeg />
      </Grid>
    </MainCard>

    <MainCard sx={{ mt: 1.75 }}>
      <Grid item xs={12}>
        <Box my={4}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h3">Répartition des clients churners/non churners sur les segments tenures</Typography>
          </Stack>
          <TenureSegmentChart />
        </Box>
      </Grid>
    </MainCard>
  </ComponentSkeleton>
);

export default Segments;
