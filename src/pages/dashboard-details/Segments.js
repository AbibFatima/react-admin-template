import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import BarChartSousSeg from './BarChartSousSeg';
import TenureSegmentChart from './TenureSegmentChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const Segments = () => (
  <ComponentSkeleton>
    <Grid container rowSpacing={4.5} columnSpacing={3.75}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Current Customers" count={50} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Churners" count={50} percentage={20} color="warning" isLoss />
      </Grid>
    </Grid>

    <MainCard sx={{ mt: 1.75 }}>
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
