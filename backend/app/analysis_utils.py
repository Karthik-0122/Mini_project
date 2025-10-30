import pandas as pd
import numpy as np

# --- No changes to get_kpis, get_actionable_insights, or get_data_dictionary ---
# ... (paste your existing get_kpis, get_actionable_insights, and get_data_dictionary functions here) ...

def get_kpis(df):
    """Calculates all the Key Performance Indicators."""
    total_records = len(df)
    
    # Data Quality (non-empty cells)
    total_cells = np.prod(df.shape)
    missing_values = df.isnull().sum().sum()
    valid_cells = total_cells - missing_values
    data_quality_score = (valid_cells / total_cells) * 100
    
    # Columns
    total_columns = len(df.columns)
    numeric_cols = df.select_dtypes(include=np.number).columns
    categorical_cols = df.select_dtypes(include='object').columns
    
    # Anomalies (simple example: duplicate rows)
    anomalies = df.duplicated().sum()
    anomalies_percent = (anomalies / total_records) * 100 if total_records > 0 else 0

    return {
        "totalRecords": f"{total_records:,}",
        "totalRecordsDelta": "Uploaded file",
        "dataQuality": f"{data_quality_score:.1f}%",
        "dataQualityDelta": f"{missing_values:,} missing",
        "columns": f"{total_columns}",
        "columnsDelta": f"{len(categorical_cols)} Cat, {len(numeric_cols)} Num",
        "anomalies": f"{anomalies:,}",
        "anomaliesDelta": f"{anomalies_percent:.1f}% duplicate",
        "anomaliesDeltaType": "negative" if anomalies > 0 else "positive"
    }

def get_actionable_insights(df, kpis):
    """Generates simple text-based insights."""
    insights = [
        {"id": "i1", "insight": f"Analysis complete for {kpis['totalRecords']} records."},
        {"id": "i2", "insight": f"Data Quality Score is {kpis['dataQuality']}. Check 'Data Health' for details on missing values."},
    ]
    if int(kpis['anomalies'].replace(',', '')) > 0:
        insights.append({"id": "i3", "insight": f"Found {kpis['anomalies']} duplicate rows. Recommend running 'Deduplication' process."})
    
    # Find a high-cardinality categorical column for a warning
    categorical_cols = df.select_dtypes(include='object').columns
    for col in categorical_cols:
        if df[col].nunique() > 50:
            insights.append({"id": "i4", "insight": f"Column '{col}' has high cardinality ({df[col].nunique()} unique values). May be difficult to visualize."})
            break
    return insights

def get_data_dictionary(df):
    """Generates a list of all columns, their types, and missing %."""
    dictionary = []
    total_records = len(df)
    for col in df.columns:
        col_type = str(df[col].dtype)
        missing_count = df[col].isnull().sum()
        missing_percent = (missing_count / total_records) * 100 if total_records > 0 else 0
        
        dictionary.append({
            "id": col,
            "columnName": col,
            "columnType": col_type,
            "metric": f"{missing_percent:.1f}% missing"
        })
    return dictionary

# --- MODIFIED FUNCTION ---
def get_column_distribution(df, target_column=None):
    """Finds the first categorical column (or uses target_column) and gets its value counts."""
    if df.empty or len(df.columns) == 0:
        return {"columnName": "N/A", "chartData": []}
    
    col_to_analyze = target_column
    
    if col_to_analyze is None:
        # --- Fallback "Auto-Guess" Logic ---
        categorical_cols = df.select_dtypes(include='object').columns
        if len(categorical_cols) > 0:
            col_to_analyze = categorical_cols[0]
        else:
            col_to_analyze = df.columns[0] # Just use the first column
    
    # Check if the chosen column exists
    if col_to_analyze not in df.columns:
        raise ValueError(f"Column '{col_to_analyze}' not found in file.")

    # Get top 10 value counts
    counts = df[col_to_analyze].value_counts().nlargest(10).to_dict()
    chart_data = [{"name": str(key), "value": int(val)} for key, val in counts.items()]
    
    return {
        "columnName": col_to_analyze,
        "chartData": chart_data
    }

# --- MODIFIED FUNCTION ---
def get_time_series_data(df, target_column=None):
    """Finds the first datetime column (or uses target_column) and aggregates by month."""
    if df.empty:
        return {"timeColumn": None, "seriesData": []}
        
    date_col = target_column
    
    if date_col is None:
        # --- Fallback "Auto-Guess" Logic ---
        for col in df.columns:
            if df[col].isnull().all():
                continue
            try:
                temp_col = pd.to_datetime(df[col], errors='coerce') # Coerce errors to NaT
                non_null = df[col].notna().sum()
                valid = temp_col.notna().sum()
                # Require at least 50% of non-null values to parse as dates and more than one unique date
                if non_null == 0 or valid / non_null < 0.5 or temp_col.nunique() <= 1:
                    continue
                
                date_col = col
                df[date_col] = temp_col # Convert in place
                break
            except Exception:
                continue
    else:
        # User provided a column, we MUST try to convert it
        if target_column not in df.columns:
            raise ValueError(f"Time column '{target_column}' not found in file.")
        try:
            df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
            if df[date_col].isnull().all():
                date_col = None # Conversion failed for all rows
        except Exception:
            date_col = None # Conversion failed

    if date_col is None:
        # No date column found or conversion failed
        return {"timeColumn": None, "seriesData": []}

    # Aggregate by month-end frequency ('ME')
    monthly_counts = df.set_index(date_col).resample('ME').size()
    
    series_data = [{
        "name": "Record Count",
        "type": "line",
        "smooth": True,
        "data": [{"name": date.strftime('%Y-%m-%d'), "value": count} for date, count in monthly_counts.items()]
    }]
    
    return {
        "timeColumn": date_col,
        "seriesData": series_data
    }

# --- No changes to get_table_data or get_data_health ---
# ... (paste your existing get_table_data and get_data_health functions here) ...

def get_table_data(df):
    """Gets the first 100 rows and column definitions for the table."""
    # Get Column Defs for AG-Grid
    column_defs = []
    for col in df.columns:
        column_defs.append({
            "headerName": col,
            "field": col,
            "sortable": True,
            "filter": True,
            "resizable": True,
        })
    
    # Get Row Data (first 100 rows)
    # Convert DataFrame to JSON-safe format
    df_head = df.head(100).replace({np.nan: None})
    row_data = df_head.to_dict(orient='records')
    
    return {"columnDefs": column_defs, "rowData": row_data}

def get_data_health(df):
    """Generates metrics for the data health component."""
    if df.empty:
        return [
            {"metric": "Completeness", "value": "0%", "status": "negative"},
            {"metric": "Uniqueness", "value": "0%", "status": "negative"},
        ]
        
    total_records = len(df)
    missing_values = df.isnull().sum().sum()
    total_cells = np.prod(df.shape)
    completeness = (total_cells - missing_values) / total_cells * 100 if total_cells > 0 else 0
    
    duplicates = df.duplicated().sum()
    duplicate_percent = (duplicates / total_records) * 100 if total_records > 0 else 0

    return [
        {"metric": "Completeness", "value": f"{completeness:.1f}%", "status": "positive" if completeness > 95 else "neutral"},
        {"metric": "Uniqueness", "value": f"{(100 - duplicate_percent):.1f}%", "status": "positive" if duplicate_percent == 0 else "negative"},
        {"metric": "Total Duplicates", "value": f"{duplicates:,}", "status": "positive" if duplicates == 0 else "negative"},
        {"metric": "Missing Values", "value": f"{missing_values:,}", "status": "positive" if missing_values == 0 else "negative"},
    ]