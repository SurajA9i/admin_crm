import React from 'react';
import ReactApexChart from 'react-apexcharts';

const UserChart = ({ UserData }) => {

  const chartOptions = {
    chart: {
      type: 'bar', // Chart type
    },
    xaxis: {
      categories: UserData?.dates || [], // Dates go here (e.g., ['Jan', 'Feb'])
      title: {
        text: 'Months', // Optional: Title for X-axis
      },
    },
    series: [
      {
        name: 'Sales', // Name for the data series
        data: UserData?.recordcounts || [], // Numerical data goes here (e.g., [30, 40])
      },
    ],
    yaxis: {
      title: {
        text: 'Number Of Users', // Optional: Title for Y-axis
      },
    },
    dataLabels: {
      enabled: true, // Show values on bars
    },
    tooltip: {
      enabled: true, // Enable tooltip
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default UserChart;
