import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  // --- Initial state ---
  kpiData: null,
  insights: null,
  dictionary: null,
  columnDist: null,
  timeSeries: null,
  tableData: null,
  dataHealth: null,
  
  // --- This function is now "safer" ---
  setAnalysisData: (data) => set({
    kpiData: data?.kpiData || null,
    insights: data?.insights || null,
    dictionary: data?.dictionary || null,
    columnDist: data?.columnDist || null,
    timeSeries: data?.timeSeries || null,
    tableData: data?.tableData || null,
    dataHealth: data?.dataHealth || null,
  }),
  
  clearAnalysisData: () => set({
    kpiData: null,
    insights: null,
    dictionary: null,
    columnDist: null,
    timeSeries: null,
    tableData: null,
    dataHealth: null,
  }),
}));