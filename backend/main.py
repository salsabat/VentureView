from services.parser import parse_input
from services.data_formats import ParseInput
from services.uploader import save_csv_to_database, load_latest_user_upload
from services.forecast import run_forecast
from fastapi import FastAPI, UploadFile, File, Form, Depends
import uvicorn
from sqlalchemy.orm import Session
from db import get_db


app = FastAPI(title="BDIS")


@app.post('/parse')
def parser(data: ParseInput):
    return parse_input(data.input_txt)


@app.post('/upload')
def upload_csv(user_id: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    return save_csv_to_database(user_id=user_id, file=file, db=db)


@app.post('/forecast')
def forecaster(user_id: str, product: str, horizon: int = 30, db: Session = Depends(get_db)):
    try:
        latest_df = load_latest_user_upload(user_id, db)
        return run_forecast(product, latest_df, horizon)
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
