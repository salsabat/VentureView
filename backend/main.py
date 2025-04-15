from services.parser import parse_input, explain_forecast
from services.uploader import save_csv_to_database, load_latest_user_upload
from services.forecast import run_forecast
from services.plotter import plot_forecast
from fastapi import FastAPI, UploadFile, File, Form, Depends, Body
import uvicorn
from sqlalchemy.orm import Session
from db import get_db


app = FastAPI(title="BDIS")


@app.post('/parse')
def parser(input_txt: str):
    return parse_input(input_txt)


@app.post('/upload')
def upload_csv(user_id: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    return save_csv_to_database(user_id=user_id, file=file, db=db)


@app.post('/forecast')
def forecaster(user_id: str, product: str, horizon: int = 30, db: Session = Depends(get_db)):
    try:
        latest_df = load_latest_user_upload(user_id, db)
        forecast = run_forecast(product, latest_df, horizon)
        explanation = explain_forecast(product, forecast, horizon)
        graph = plot_forecast(forecast, product)
        return {
            "status": "success",
            "product": product,
            "horizon": horizon,
            "forecast": forecast,
            "explanation": explanation,
            "graph": graph
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.post('/forecast/natural')
def forecast_from_text(body: dict = Body(...), db: Session = Depends(get_db)):
    user_id = body["user_id"]
    input_txt = body["input_txt"]

    parsed_response = parse_input(input_txt)

    if parsed_response[]


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
