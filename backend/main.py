from fastapi import FastAPI
import uvicorn
from backend.services.parser import parse_input
from backend.services.data_formats import ParseInput

app = FastAPI(title="BDIS")

@app.post('/parse')
def parser(data : ParseInput):
    return parse_input(data.input_txt)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)