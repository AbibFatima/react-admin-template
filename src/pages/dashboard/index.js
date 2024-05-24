import { useState, useEffect } from 'react';

// material-ui
import {
  //Avatar,
  //AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  //ListItemAvatar,
  ListItemButton,
  //ListItemSecondaryAction,
  ListItemText,
  //MenuItem,
  Stack,
  //TextField,
  Typography
} from '@mui/material';

// project import
//import OrdersTable from './OrdersTable';
import LineChartTotalChurn from './LineChartTotalChurn';
import ValueSegmentDonutChart from './ValueSegmentDonutChart';
import ReportAreaChart from './ReportAreaChart';
//import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import TariffProfilColumnChart from './TariffProfilColumnChart';
import ChurnersTable from './ChurnersTable';

// sales report status
// const status = [
//   {
//     value: 'today',
//     label: 'Today'
//   },
//   {
//     value: 'month',
//     label: 'This Month'
//   },
//   {
//     value: 'year',
//     label: 'This Year'
//   }
// ];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  //const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('day');
  const [analyticsData, setAnalyticsData] = useState({
    totalCount: 0,
    churnersCount: 0,
    churnersPercentage: 0,
    nonChurnersCount: 0,
    nonChurnersPercentage: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('//localhost:5000/dashboard/analytics', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
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
        const response = await fetch('http://localhost:5000/dashboard/columnchartdata');
        const data = await response.json();

        // Find the tariff profile with maximum churners
        const maxChurnersProfile = data.reduce(
          (maxProfile, currentProfile) => {
            return currentProfile.churnersCount > maxProfile.churnersCount ? currentProfile : maxProfile;
          },
          { churnersCount: -Infinity }
        );

        setMaxChurnersData(maxChurnersProfile);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Current Customers" count={analyticsData.totalCount.toString()} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Churners"
          count={analyticsData.churnersCount.toString()}
          percentage={analyticsData.churnersPercentage}
          color="warning"
          isLoss
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Non Churners"
          count={analyticsData.nonChurnersCount.toString()}
          percentage={analyticsData.nonChurnersPercentage}
          color="success"
        />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Total Churn</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('day')}
                color={slot === 'day' ? 'primary' : 'secondary'}
                variant={slot === 'day' ? 'outlined' : 'text'}
              >
                Day
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
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
            <Typography variant="h5">Churn Per Value Segment</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week Statistics
              </Typography>
            </Stack>
          </Box>
          <ValueSegmentDonutChart />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Churners Table</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ChurnersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Tariff Profil</Typography>
          </Grid>
          {/* <Grid item>
            <TextField
              id="standard-select-currency"
              size="small"
              select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
            >
              {status.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <Stack spacing={1.5} sx={{ mb: -12 }}>
            <Typography variant="h6" color="secondary">
              Tariff Profile with Max Churners
            </Typography>
            <Typography variant="h4">{maxChurnersData ? maxChurnersData.tariff_profile : 'Loading...'}</Typography>
            <Typography variant="subtitle1" color="secondary">
              with: {maxChurnersData ? maxChurnersData.churnersCount : 'Loading...'}
            </Typography>
          </Stack>
          <TariffProfilColumnChart />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
