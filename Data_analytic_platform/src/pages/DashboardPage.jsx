import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardStore from '../store';
import '../App.css'; 

// Import all components (including the new heatmap)
import  Navbar  from '../components/Navbar';
import  KpiCard  from '../components/KpiCard';
import  ActionableInsights  from '../components/ActionableInsights';
import  DataDictionary  from '../components/DataDictionary';
import  ColumnDistributionChart  from '../components/ColumnDistributionChart';
import  TimeSeriesTrends  from '../components/TimeSeriesTrends';
import  InteractiveDataTable  from '../components/InteractiveDataTable';
import  DataHealthMonitoring  from '../components/DataHealthMonitoring';
import  ReportAndAutomation  from '../components/ReportAndAutomation';
import  CorrelationHeatmap  from '../components/CorrelationHeatmap'; // <-- Import new component

export default function DashboardPage() {
  const {
    kpiData,
    insights,
    dictionary,
    columnDist,
    timeSeries,
    tableData,
    dataHealth,
    correlationMatrix // <-- Get new data
  } = useDashboardStore();
  
  const navigate = useNavigate();
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    if (!kpiData) {
      navigate('/');
    } else {
      setSelectedColumn(columnDist.columnName);
    }
  }, [kpiData, navigate, columnDist]);

  if (!kpiData) {
    return (
      <div style={{
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)'
      }}>
        <h2>Loading Analysis Data...</h2>
      </div>
    );
  }

  // --- This is the new, upgraded layout ---
  return (
    <div className="dashboard-layout">
      <Navbar />

      <KpiCard
        gridArea="kpi-1"
        title="Total Records"
        value={kpiData.totalRecords}
        delta={kpiData.totalRecordsDelta}
      />
      <KpiCard
        gridArea="kpi-2"
        title="Data Quality"
        value={kpiData.dataQuality}
        delta={kpiData.dataQualityDelta}
      />
      <KpiCard
        gridArea="kpi-3"
        title="Columns"
        value={kpiData.columns}
        delta={kpiData.columnsDelta}
      />
      <KpiCard
        gridArea="kpi-4"
        title="Total Anomalies"
        value={kpiData.anomalies}
        delta={kpiData.anomaliesDelta}
        deltaType={kpiData.anomaliesDeltaType}
      />

      <ActionableInsights insights={insights} />
      <DataDictionary dictionary={dictionary} />

      <ColumnDistributionChart 
        chartData={columnDist.chartData}
        columnName={selectedColumn}
      />
      <TimeSeriesTrends 
        timeColumn={timeSeries.timeColumn}
        seriesData={timeSeries.seriesData} 
        xAxisData={timeSeries.xAxisData}
      />

      <InteractiveDataTable 
        rowData={tableData.rowData} 
        columnDefs={tableData.columnDefs}
        onColumnHeaderClick={(col) => setSelectedColumn(col)} 
      />
      
      {/* --- NEW: Place the heatmap in its grid area --- */}
      <div className="correlation-heatmap">
        <CorrelationHeatmap heatmapData={correlationMatrix} />
      </div>

      {/* --- NEW: Stack the other two cards in their new area --- */}
      <div className="health-report-stack">
        <DataHealthMonitoring healthData={dataHealth} />
        <ReportAndAutomation />
      </div>
    </div>
  );
}