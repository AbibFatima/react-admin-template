import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const BarChartSousSeg = () => {
  const [series, setSeries] = useState([]);
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
    // Fetch data from backend
    axios.get('http://127.0.0.1:5000/TenureSegments')
      .then((response) => {
        const data = response.data;
        
        // Process the data to match the chart's format
        const categories = data.map(item => item.tenureSegment);
        const nbChurners = data.map(item => item.nbChurners);
        const nbNonChurners = data.map(item => item.nbNonChurners);
        
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

        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: categories
          }
        }));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarChartSousSeg;
