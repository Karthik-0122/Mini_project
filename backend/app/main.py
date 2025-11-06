import pandas as pd
import io
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- Import all your analysis functions ---
from app.analysis_utils import (
    get_kpis,
    get_actionable_insights,
    get_data_dictionary,
    get_column_distribution,
    get_time_series_data,
    get_table_data,
    get_data_health,
    get_correlation_matrix
)

app = FastAPI(
    title="Data Analytics Platform API",
    description="API for processing uploaded files and generating dashboard analytics.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    col_dist_target: str = Form(None),
    col_time_target: str = Form(None)
):
    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        except UnicodeDecodeError:
            df = pd.read_csv(io.StringIO(contents.decode('latin-1')))
        
        kpis = get_kpis(df)
        correlation_result = get_correlation_matrix(df)
        
        # This function now returns the full {timeColumn, seriesData, xAxisData} object
        time_series_result = get_time_series_data(df, target_column=col_time_target) 

        insights = get_actionable_insights(df, kpis, correlation_result['matrix'])
        
        response_data = {
            "kpiData": kpis,
            "insights": insights,
            "dictionary": get_data_dictionary(df),
            "columnDist": get_column_distribution(df, target_column=col_dist_target),
            "timeSeries": time_series_result, # <-- Send the whole object
            "tableData": get_table_data(df),
            "dataHealth": get_data_health(df),
            "correlationMatrix": {
                "columns": correlation_result['columns'],
                "data": correlation_result['data']
            }
        }
        
        return response_data
        
    except Exception as e:
        import traceback
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {e}")

@app.get("/")
def read_root():
    return {"status": "Backend server is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)