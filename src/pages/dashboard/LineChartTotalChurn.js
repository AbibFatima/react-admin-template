import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  },
  xaxis: {
    labels: {
      show: false
    }
  }
};

// ==============================|| CHURN NUMBER CHART ||============================== //

const LineChartTotalChurn = ({ slot }) => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const [churnData, setChurnData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your database
        let url = '//localhost:5000/dashboard/linechartdata';
        if (slot === 'month') {
          url += '?interval=month';
        }
        const response = await fetch(url);
        const data = await response.json();

        // Manipulate data
        const formattedData = [
          {
            name: 'Total',
            data: data.map((item) => item.ChurnerNumber)
          }
        ];

        // Update series state with fetched data
        setSeries(formattedData);
        setChurnData(data.map((item) => item.ChurnDate));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [slot]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary[400]],
      xaxis: {
        categories: churnData,
        labels: {
          style: {
            colors: [secondary]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: churnData.length
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [churnData, secondary, line, theme, slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

LineChartTotalChurn.propTypes = {
  slot: PropTypes.string
};

export default LineChartTotalChurn;
