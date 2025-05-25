import asyncio
from fastapi import APIRouter, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import json
import tempfile
from pydantic import BaseModel
from copy import deepcopy
from random import uniform
import urllib
from bs4 import BeautifulSoup
import httpx

from utils.algorithm.processor import get_answers
from utils.claim_generation.main import generate_pdf
from schemas.client import ClientCreate

from app.clients.router import create_client
from transformers import pipeline


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
    
    answers = get_answers(deepcopy(data))

    info = []

    for i, d in enumerate(data):
        info.append({'accountId': d['accountId'], 'isCommercial': answers[i], 'address': d['address']})
        d['suspicion'] = answers[i]
        new_cl = ClientCreate.model_validate(d)
        background_tasks.add_task(create_client, new_cl)

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


classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=-1
)

HIGH_CONFIDENCE = 0.60
MEDIUM_CONFIDENCE = 0.40

candidate_labels = ["частные услуги", "официальная компания", "не определено"]

keywords = [
    "частный мастер",
    "услуги на дому",
    "работаю без лицензии",
    "частный специалист",
    "индивидуальный мастер",
    "частная практика",
    "выезд на дом",
    "частный ремонт",
    "частная уборка",
    "частный сантехник",
    "частный электрик",
    "частный парикмахер",
    "частная няня",
    "частный репетитор",
    "услуги без лицензии",
    "нелицензированная деятельность",
    "частный предприниматель",
    "самозанятый",
    "фрилансер",
    "неофициальные услуги",
    "работа без регистрации",
    "неофициальная деятельность",
    "услуги без ИП",
    "домашний мастер",
    "услуги частным образом",
    "частная помощь",
    "бытовые услуги на дому",
    "неофициальный мастер"
]
legal_keywords = [
    "официальный сайт",
    "ООО",
    "ИП",
    "ИНН",
    "лицензия",
    "регистрация бизнеса",
    "государственная регистрация",
    "разрешение на деятельность",
    "свидетельство о регистрации",
    "налоговая инспекция",
    "патент",
    "уставные документы",
    "юридическое лицо",
    "фирменное наименование",
    "корпоративное имя",
    "ОГРН",
    "выписка из ЕГРЮЛ",
    "выписка из ЕГРИП",
    "налоговый режим",
    "бухгалтерская отчетность",
    "сертификация",
    "лицензируемая деятельность",
    "контроль лицензирующих органов",
    "разрешительная документация",
    "государственная пошлина",
    "регистрационные документы",
    "правовой статус",
    "нормативные акты",
    "государственный реестр лицензий",
    "устав организации",
    "юридический адрес",
    "налоговая отчетность",
    "аккредитация",
    "проверка документов",
    "соблюдение законодательства",
    "государственный контроль"
]
excluded_domains = ["avito.ru", "2gis.ru"]

async def extract_real_url(ddg_link: str) -> str:
    parsed = urllib.parse.urlparse(ddg_link)
    params = urllib.parse.parse_qs(parsed.query)
    return urllib.parse.unquote(params.get('uddg', [''])[0])


async def search_address(address: str) -> list:
    query = f"{address} услуги частные объявления"
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}&kl=ru-ru"

    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://duckduckgo.com/'
    }
    results = []
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, timeout=15)
            soup = BeautifulSoup(response.text, 'html.parser')
            for link in soup.select('.result__a'):
                ddg_url = link.get('href', '')
                real_url = await extract_real_url(ddg_url)
                if real_url:
                    results.append({
                        'title': link.text.strip(),
                        'url': real_url
                    })
        return results[:2]
    except Exception as e:
        print(f"Ошибка поиска: {e}")
        return []

async def zero_shot_classify(text: str) -> tuple[str, float]:
    try:
        result = classifier(text, candidate_labels)
        top_label = result['labels'][0]
        score = result['scores'][0]
        return top_label, score
    except Exception as e:
        print(f"Ошибка классификации: {e}")
        return "не определено", 0.0

async def analyze_site(url: str) -> tuple:
    domain = urllib.parse.urlparse(url).netloc.lower()
    if any(excluded_domain in domain for excluded_domain in excluded_domains):
        return "⚪ Исключен", []

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }

    try:
        if not url.startswith('http'):
            url = f'http://{url}'
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers, timeout=10)

    except Exception as e:
        return f"🔴 ОШИБКА: {str(e)}", []

    soup = BeautifulSoup(resp.text, 'html.parser')
    text = soup.get_text(separator=' ', strip=True).lower()
    metas = ' '.join([meta.get('content', '') for meta in soup.find_all('meta')]).lower()
    titles = soup.title.string if soup.title else ''
    full_text = ' '.join([text, metas, titles.lower()])

    # Keyword checks
    found_keywords = [kw for kw in keywords if kw in full_text]
    found_legal = [kw for kw in legal_keywords if kw in full_text]

    # Zero-shot classification
    label, score = await zero_shot_classify(full_text[:1000])
    label_upper = label.upper()

    if score >= HIGH_CONFIDENCE:
        emoji = "🟢"
    elif score >= MEDIUM_CONFIDENCE:
        emoji = "🟡"
    else:
        emoji = "🔴"

    result_string = f"{emoji} {label_upper} ({score:.2f})"

    if found_keywords and not found_legal:
        return f"🔴 ПОДОЗРИТЕЛЬНЫЙ | {result_string}", found_keywords
    elif found_legal:
        return f"🟢 НОРМАЛЬНЫЙ | {result_string}", found_legal
    else:
        return f"⚪ НЕ ОПРЕДЕЛЕНО | {result_string}", []


@router.get("/analyze_address")
async def analyze_address_endpoint(address: str):
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    search_results = await search_address(address)

    analyzed_sites = []
    for site in search_results:
        status, found_keywords = await analyze_site(site['url'])
        analyzed_sites.append({
            "title": site['title'],
            "url": site['url'],
            "status": status,
            "found_keywords": found_keywords
        })
        asyncio.sleep(uniform(0.5, 1.5))

    return {"address": address, "analyzed_sites": analyzed_sites}

