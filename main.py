"""
Vet-Triage · Streamlit Main Entry Point
Alias for app.py
Run with: streamlit run main.py (or streamlit run app.py)
"""
import runpy

if __name__ == "__main__":
    runpy.run_path("app.py", run_name="__main__")
