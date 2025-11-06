import React from 'react';
import ReactECharts from 'echarts-for-react';

// This component now accepts xAxisData
export default function TimeSeriesTrends({ timeColumn, seriesData, xAxisData }) {
  
  if (!timeColumn) {
    return (
      <div className="card time-series-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No valid time/date column found for trend analysis.</p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: seriesData.map(s => s.name),
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData, // <-- Use the new xAxisData prop
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: 'var(--border-color)' }
      }
    },
    // The series data is now just an array of values [1, 2, null, null]
    // which maps 1:1 to the xAxis.data
    series: seriesData 
  };

  return (
    <div className="card time-series-chart">
      <div className="card-title">Trend Analysis: **{timeColumn}**</div>
      <ReactECharts option={option} style={{ height: '350px' }} />
    </div>
  );
}