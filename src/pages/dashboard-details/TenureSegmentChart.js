import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

const BarChartSousSeg = () => {
  const theme = useTheme();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      height: 350,
      stacked: true
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    dataLabels: {
      formatter: (val) => {
        return val + '';
      }
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    xaxis: {
      categories: [],
      labels: {
        formatter: (val) => {
          return val + '';
        }
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#E57373', '#81C784'], // Soft red for churners, soft green for non-churners
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/TenureSegments');
        const data = await response.json();

        // Process the data to match the chart's format
        const categories = data.map((item) => item.tenureSegment);
        const nbChurners = data.map((item) => item.nbChurners);
        const nbNonChurners = data.map((item) => item.nbNonChurners);

        setSeries([
          {
            name: 'Churners',
            data: nbChurners
          },
          {
            name: 'Non-Churners',
            data: nbNonChurners
          }
        ]);

        setCategories(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: categories
      },
      colors: [theme.palette.primary.light, theme.palette.success.light]
    }));
  }, [categories, theme.palette.primary.light, theme.palette.success.light]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChartSousSeg;
