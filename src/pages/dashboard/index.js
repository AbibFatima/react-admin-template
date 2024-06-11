import { useState, useEffect } from 'react';
// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import secureLocalStorage from 'react-secure-storage';

// project import
import LineChartTotalChurn from './LineChartTotalChurn';
import ValueSegmentDonutChart from './ValueSegmentDonutChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import TariffProfilColumnChart from './TariffProfilColumnChart';
import ChurnersTable from './ChurnersTable';

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({
    totalCount: 0,
    churnersCount: 0,
    churnersPercentage: 0,
    nonChurnersCount: 0,
    nonChurnersPercentage: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = secureLocalStorage.getItem('token');
      try {
        const response = await fetch('//localhost:5000/dashboard/analytics', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch analytics data. Status: ${response.status}`);
        }
        const responseData = await response.text();
        const data = JSON.parse(responseData);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  const [maxChurnersData, setMaxChurnersData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard/maxchurnprofile');
        const data = await response.json();
        setMaxChurnersData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateDataset = async () => {
    try {
      const response = await fetch('//localhost:5000/updatedateset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update dataset');
      }

      window.location.reload();
      // Optionally, you can refresh the data after the dataset update
      fetchData();
      fetchMaxChurnersData();
    } catch (error) {
      console.error('Error updating dataset:', error);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Tableau de bord</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total clients actuels" count={analyticsData.totalCount.toString()} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Nombre total de churners"
          count={analyticsData.churnersCount.toString()}
          percentage={analyticsData.churnersPercentage}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Nombre total de non-churners"
          count={analyticsData.nonChurnersCount.toString()}
          percentage={analyticsData.nonChurnersPercentage}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Box mt={3} display="flex" justifyContent="space-around" flexWrap="wrap">
          <Button size="large" variant="contained" color="primary" onClick={handleUpdateDataset} startIcon={<RefreshOutlinedIcon />}>
            Actualiser Dashboard
          </Button>
        </Box>
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Nombre total de désabonnements en fonction du temps</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Semaine
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Mois
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <LineChartTotalChurn slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Population par Value Segment</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2, mb: 4 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                Statistiques de la semaine
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ mb: 3 }}>
            <ValueSegmentDonutChart />
          </Box>
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Tableau de clients susceptibles au désabonnement</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ChurnersTable />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Nombre total prédit de désabonnement et non désabonnement par Tariff Profile</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <Stack spacing={1.5} sx={{ mb: -12 }}>
            <Typography variant="h6" color="secondary">
              Tariff Profile avec le plus grand nombre de désabonnement
            </Typography>
            <Typography variant="h4">{maxChurnersData ? maxChurnersData.tariff_profile : 'Loading...'}</Typography>
            <Typography variant="subtitle1" color="secondary">
              Maximum: {maxChurnersData ? maxChurnersData.churnersCount + ' churners' : 'Loading...'}
            </Typography>
          </Stack>
          <TariffProfilColumnChart />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
