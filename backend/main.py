from fastapi import FastAPI, UploadFile, File, Form, Depends
import uvicorn
from services.parser import parse_input
from services.data_formats import ParseInput
from sqlalchemy.orm import Session
from db import get_db
from services.uploader import save_csv_to_database


app = FastAPI(title="BDIS")


@app.post('/parse')
def parser(data: ParseInput):
    return parse_input(data.input_txt)


@app.post('/upload')
def upload_csv(user_id: str = Form(...),
               file: UploadFile = File(...),
               db: Session = Depends(get_db)):
    return save_csv_to_database(user_id=user_id, file=file, db=db)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
