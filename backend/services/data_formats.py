from pydantic import BaseModel


class ParseInput(BaseModel):
    input_txt: str
