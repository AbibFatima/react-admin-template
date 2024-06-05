import React, { useState, useEffect } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ComponentSkeleton from 'pages/components-overview/ComponentSkeleton';
import BarChartSousSeg from './BarChartSousSeg';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const Segments = () => {
  const [segmentData, setSegmentData] = useState({
    maxChurnersTenureSegment: 0,
    maxChurnersCount: 0,
    maxChurnersPercentage: 0,
    nonChurnersCount: 0,
    nonChurnersPercentage: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('//localhost:5000/maxTenureSegments');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.text();
        const data = JSON.parse(responseData);
        setSegmentData(data);
      } catch (error) {
        console.error('Error fetching tenure segments data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ComponentSkeleton>
      <Grid container  rowSpacing={4.5} columnSpacing={5.75}>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard>
            <Typography variant="h5" color="textSecondary">
              Segment Tenure with maximum of Churners
            </Typography>
            <AnalyticEcommerce
              title={segmentData.maxChurnersTenureSegment.toString()}
              count={segmentData.maxChurnersCount.toString()}
              percentage={segmentData.maxChurnersPercentage}
            />
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MainCard>
            <Typography variant="h5" color="textSecondary">
              Non churners of max segment tenure
            </Typography>
            <AnalyticEcommerce
              title={segmentData.maxChurnersTenureSegment.toString()}
              count={segmentData.nonChurnersCount.toString()}
              percentage={segmentData.nonChurnersPercentage}
            />
          </MainCard>
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
    </ComponentSkeleton>
  );
};

export default Segments;
