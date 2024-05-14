import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const donutChartOptions = {
  chart: {
    type: 'donut',
    height: 365
  },
  plotOptions: {
    pie: {
      customScale: 0.8
    }
  },
  dataLabels: {
    enabled: false
  }
};

// ==============================|| VALUE SEG PIE CHART ||============================== //

const ValueSegmentDonutChart = () => {
  const theme = useTheme();
  const { primary } = theme.palette;

  const [, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(donutChartOptions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('//localhost:5000/dashboard/donutchartdata');
        const data = await response.json();
        setData(data);

        const flagCount = data.map((item) => item.flagCount);
        const valueSegment = data.map((item) => item.valueSegment);
        setSeries(flagCount);

        setOptions((prevState) => ({
          ...prevState,
          colors: [theme.palette.primary[100], theme.palette.primary.main, theme.palette.primary[200]],
          labels: valueSegment,
          legend: {
            show: true,
            position: 'bottom'
          },
          tooltip: {
            theme: 'light'
          }
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [theme, primary]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="donut" height={460} />
    </div>
  );
};

export default ValueSegmentDonutChart;
