import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 365
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: 'top' // top, center, bottom
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(2) + '%';
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  xaxis: {
    position: 'top',
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5
        }
      }
    },
    tooltip: {
      enabled: true
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      show: false,
      formatter: function (val) {
        return val.toFixed(2) + '%';
      }
    }
  }
};

// ==============================|| COLUMN CHART ||============================== //

const ColumnChartUplift = () => {
  const theme = useTheme();

  const [, setData] = useState([]);
  const [series, setSeries] = useState([{ name: 'Churners Percentage', data: [] }]);
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/uplift');
        const data = await response.json();
        setData(data);

        const churnersPercentage = data.map((item) => item.Churners_Percentage);
        const deciles = data.map((item) => `Decile ${item.Decile}`);
        setSeries([{ name: 'Churners Percentage', data: churnersPercentage }]);

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            ...prevState.xaxis,
            categories: deciles
          },
          colors: [theme.palette.primary.light]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [theme.palette.primary.light]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={450} />
    </div>
  );
};

export default ColumnChartUplift;
