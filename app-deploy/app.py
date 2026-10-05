"""Serve a publicação estática Release Overview (HTML único) como Databricks App."""
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI(title="Databricks Release Overview · Setembro 2026")

_HTML = os.path.join(os.path.dirname(__file__), "static", "index.html")


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/")
def index():
    return FileResponse(_HTML, media_type="text/html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("DATABRICKS_APP_PORT", 8000)))
