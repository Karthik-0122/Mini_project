import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function TimeSeriesTrends({ timeColumn, seriesData }) {
  // Guard: no time series available
  if (!timeColumn || !seriesData || seriesData.length === 0 || !seriesData[0].data || seriesData[0].data.length === 0) {
    return (
      <div className="card time-series-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No valid time/date column found for trend analysis.</p>
      </div>
    );
  }

  const option = {
    backgroundColor: '#ffffff',
    textStyle: { color: '#111827' },
    color: ['#2563eb'],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: seriesData.map(s => s.name),
      bottom: 0,
      textStyle: { color: '#6b7280' }
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
      data: seriesData[0].data.map(item => item.name), // Assumes all series share x-axis
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: '#e5e7eb' }
      },
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    series: seriesData.map(s => ({
      ...s,
      type: 'line',
      smooth: true,
      lineStyle: { width: 2, color: '#2563eb' },
      itemStyle: { color: '#2563eb' }
    }))
  };

  return (
    <div className="card time-series-chart">
      <div className="card-title">Trend Analysis: **{timeColumn}**</div>
      <ReactECharts option={option} style={{ height: '350px' }} />
    </div>
  );
}