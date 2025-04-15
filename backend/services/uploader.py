import pandas as pd
from io import StringIO
from sqlalchemy.orm import Session
from fastapi import UploadFile
from db import Upload
import json


def save_csv_to_database(user_id: str, file: UploadFile, db: Session) -> dict:
    try:
        content = file.file.read().decode("utf-8")
        df = pd.read_csv(StringIO(content))
        data_json = df.to_json(orient="records")

        upload = Upload(
            user_id=user_id,
            filename=file.filename,
            row_count=len(df),
            data_json=data_json,
        )

        db.add(upload)
        db.commit()
        db.refresh(upload)

        return {
            "status": "success",
            "upload_id": upload.id,
            "filename": upload.filename,
            "row_count": upload.row_count,
            "upload_date": upload.upload_date.isoformat(),
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


def load_latest_user_upload(user_id: str, db: Session) -> pd.DataFrame:
    upload = (
        db.query(Upload)
        .filter(Upload.user_id == user_id)
        .order_by(Upload.upload_date.desc())
        .first()
    )
    if not upload:
        raise ValueError(
            "Please upload a CSV containing the product, date, and revenue data.")

    return pd.read_json(upload.data_json)
