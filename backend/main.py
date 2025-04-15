from services.parser import parse_input, explain_forecast
from services.uploader import save_csv_to_database, load_latest_user_upload
from services.forecast import run_forecast
from services.plotter import plot_forecast
from services.user import get_or_create_user
from fastapi import FastAPI, UploadFile, File, Form, Depends, Body
import uvicorn
from sqlalchemy.orm import Session
from db import get_db
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="BDIS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/login")
def login(email: str = Form(...), db: Session = Depends(get_db)):
    user = get_or_create_user(email=email, db=db)
    return {"user_id": user.id}


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

    parsed = parse_input(input_txt)
    if not parsed["valid"]:
        return {
            "status": "error",
            "message": parsed["reason"] if "reason" in parsed else "Unable to predict. Please try another prompt."
        }

    product = parsed["product"]
    horizon = parsed["horizon"]

    try:
        df = load_latest_user_upload(user_id, db)
    except Exception as e:
        return {
            "status": "error",
            "message": (str(e))
        }

    forecast = run_forecast(product, df, horizon)
    if "status" in forecast and forecast["status"] == "error":
        return forecast

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


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
