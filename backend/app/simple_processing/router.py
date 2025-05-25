from fastapi import APIRouter, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import json
import tempfile
from pydantic import BaseModel

from utils.algorithm.processor import get_answers
from utils.claim_generation.main import generate_pdf
from schemas.client import ClientCreate

from app.clients.router import create_client


class CourtData(BaseModel):
    court_name: str
    court_address: str
    istec: str
    istec_inn: str
    istec_ogrn: str
    istec_address: str
    otvetchik_name: str
    otvetchik_address: str
    damage_sum: str
    consumption_period: str
    activity_type: str
    act_date: str
    expertise_date: str
    tariff_calculation: str


router = APIRouter()


@router.post("/upload-json/")
async def upload_json(file: UploadFile, background_tasks: BackgroundTasks):
    if file.content_type != "application/json":
        raise HTTPException(status_code=400, detail="Invalid file type. JSON required.")
    content = await file.read()
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file.")
    
    answers = get_answers(data)

    info = []

    for i, d in enumerate(data):
        info.append({'accountId': d['accountId'], 'isCommercial': answers[i], 'address': d['address']})
        d['suspicion'] = answers[i]
        background_tasks.add_task(create_client, ClientCreate.parse_obj(d))

    return info


@router.post("/get_claim")
async def create_pdf(data: CourtData):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        generate_pdf(data.model_dump(), tmp_file.name)
        tmp_file_path = tmp_file.name

    return FileResponse(
        path=tmp_file_path,
        media_type='application/pdf',
        filename="court_data.pdf",
        background=None
    )
