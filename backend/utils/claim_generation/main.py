import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime


FONT_PATH = "./utils/claim_generation/Times_New_Roman.ttf"
pdfmetrics.registerFont(TTFont('TimesNewRoman', FONT_PATH))

def create_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='MainStyle',
        fontName='TimesNewRoman',
        fontSize=12,
        leading=14,
        alignment=4,
        spaceBefore=6,
        spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        name='HeaderStyle',
        fontName='TimesNewRoman',
        fontSize=14,
        leading=16,
        alignment=1,
        spaceBefore=12,
        spaceAfter=12
    ))
    return styles

def generate_pdf(data: dict, output_path: str):
    """Генерирует PDF и сохраняет его по указанному пути"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm
    )
    styles = create_styles()
    story = []

    # Используем .get() с дефолтами
    story.append(Paragraph(f"В {data.get('court_name', 'НЕ УКАЗАНО')}", styles['HeaderStyle']))
    story.append(Paragraph(f"Адрес: {data.get('court_address', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    story.append(Spacer(1, 20))

    story.append(Paragraph("ИСТЕЦ:", styles['MainStyle']))
    story.append(Paragraph(f"{data.get('istec', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    if data.get('istec_inn'):
        story.append(Paragraph(f"ИНН: {data.get('istec_inn', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    if data.get('istec_ogrn'):
        story.append(Paragraph(f"ОГРН: {data.get('istec_ogrn', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    story.append(Paragraph(f"Адрес: {data.get('istec_address', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    story.append(Spacer(1, 20))

    story.append(Paragraph("ОТВЕТЧИК:", styles['MainStyle']))
    story.append(Paragraph(f"{data.get('otvetchik_name', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    story.append(Paragraph(f"Адрес: {data.get('otvetchik_address', 'НЕ УКАЗАНО')}", styles['MainStyle']))
    story.append(Spacer(1, 20))

    story.append(Paragraph(f"Цена иска: {data.get('damage_sum', 'НЕ УКАЗАНО')} рублей", styles['MainStyle']))
    story.append(Spacer(1, 20))

    claim_text = f"""
    ИСКОВОЕ ЗАЯВЛЕНИЕ
    о возмещении ущерба за незаконное использование электроэнергии

    В период с {data.get('consumption_period', 'НЕ УКАЗАНО')} ответчик осуществлял {data.get('activity_type', 'НЕ УКАЗАНО')} с использованием электроэнергии без соответствующего договора энергоснабжения.

    {data.get('act_date', 'НЕ УКАЗАНО')} был составлен акт о неучтенном потреблении электроэнергии.

    {data.get('expertise_date', 'НЕ УКАЗАНО')} проведена экспертиза, которая установила объем потребленной электроэнергии: {data.get('tariff_calculation', 'НЕ УКАЗАНО')}.

    На основании изложенного, руководствуясь статьями 15, 1064 Гражданского кодекса Российской Федерации,

    ПРОШУ:

    1. Взыскать с ответчика {data.get('otvetchik_name', 'НЕ УКАЗАНО')} в пользу истца {data.get('istec', 'НЕ УКАЗАНО')} {data.get('damage_sum', 'НЕ УКАЗАНО')} рублей в качестве возмещения ущерба за незаконное использование электроэнергии.
    2. Взыскать с ответчика расходы по уплате государственной пошлины.
    """
    for paragraph in claim_text.split('\n\n'):
        if paragraph.strip():
            story.append(Paragraph(paragraph, styles['MainStyle']))
    story.append(Spacer(1, 30))
    current_date = datetime.now().strftime("%d.%m.%Y")
    story.append(Paragraph(f"Дата: {current_date}", styles['MainStyle']))
    story.append(Paragraph("Подпись: _________________", styles['MainStyle']))

    doc.build(story)
    buffer.seek(0)
    with open(output_path, 'wb') as f:
        f.write(buffer.read())

# Пример использования:
mock_data = {
    "court_name": "Арбитражный суд города Москвы",
    "court_address": "г. Москва, ул. Новый Арбат, д. 10",
    "istec": "ООО \"Ромашка\"",
    "istec_inn": "7701234567",
    "istec_ogrn": "1027700123456",
    # Можно не указывать остальные поля — будет "НЕ УКАЗАНО"
}

# generate_claim_pdf(mock_data, "/home/dmitriy/PycharmProjects/PythonProject4/темт/claim.pdf")
