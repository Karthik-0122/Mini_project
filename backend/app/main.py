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
    get_data_health
)

app = FastAPI(
    title="Data Analytics Platform API",
    description="API for processing uploaded files and generating dashboard analytics.",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODIFIED ENDPOINT ---
@app.post("/api/v1/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    col_dist_target: str = Form(None), # Optional: Column for Distribution Chart
    col_time_target: str = Form(None)  # Optional: Column for Time Series Chart
):
    """
    This is the main endpoint.
    It now accepts optional form fields for target columns.
    """
    try:
        # 1. Read the file into Pandas
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        except UnicodeDecodeError:
            df = pd.read_csv(io.StringIO(contents.decode('latin-1')))
        
        # --- 2. Run all analysis modules ---
        
        kpis = get_kpis(df)
        
        # --- 3. Build the final JSON response ---
        # We pass the optional column names to the functions
        response_data = {
            "kpiData": kpis,
            "insights": get_actionable_insights(df, kpis),
            "dictionary": get_data_dictionary(df),
            "columnDist": get_column_distribution(df, target_column=col_dist_target),
            "timeSeries": get_time_series_data(df, target_column=col_time_target),
            "tableData": get_table_data(df),
            "dataHealth": get_data_health(df)
        }
        
        return response_data
        
    except Exception as e:
        import traceback
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {e}")

@app.get("/")
def read_root():
    """A simple root endpoint to check if the server is running."""
    return {"status": "Backend server is running!"}

# --- This allows running the file directly with `python app/main.py` ---
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)