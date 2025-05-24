from fastapi.responses import ORJSONResponse

from src.api.v1.router import router
from src.storage import postgres
from src.schemas import CreateAccountSchema
from src.repositories import AccountsRepository

@router.post('/analyze', include_in_schema=False)
async def analyze(data: CreateAccountSchema) -> ORJSONResponse:
    async with postgres.pool.acquire() as db:
        res = await AccountsRepository.create(db, data)
    return ORJSONResponse(res.model_dump())
