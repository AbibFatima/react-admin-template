import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '70%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  yaxis: {
    title: {
      text: 'Count'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `${val}`;
      }
    }
  },
  legend: {
    show: true,
    fontFamily: `'Public Sans', sans-serif`,
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: '50%',
      offsetX: 2,
      offsetY: 2
    },
    itemMargin: {
      horizontal: 15,
      vertical: 50
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

// ==============================|| TARIFF PROFIL COLUMN CHART ||============================== //

const TariffProfilColumnChart = () => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard/columnchartdata');
        const data = await response.json();

        const churnersCount = data.map((item) => item.churnersCount);
        const nonchurnersCount = data.map((item) => item.nonchurnersCount);
        const tariffProfiles = data.map((item) => item.Tariff_Profile);

        setSeries([
          { name: 'Churners Count', data: churnersCount },
          { name: 'Non-churners Count', data: nonchurnersCount }
        ]);

        setOptions((prevState) => ({
          ...prevState,
          colors: [warning, primaryMain],
          xaxis: {
            ...prevState.xaxis,
            categories: tariffProfiles
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
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            labels: {
              colors: 'grey.500'
            }
          }
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [theme.palette.primary.light, primary, secondary, line, warning, primaryMain]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={480} />
    </div>
  );
};

export default TariffProfilColumnChart;
