from fastapi.responses import ORJSONResponse

from src.api.v1.router import router
from src.storage import postgres
from src.schemas import CreateAddressSchema
from src.repositories import AddressesRepository

@router.post('/analyze', include_in_schema=False)
async def healthcheck(data: CreateAddressSchema) -> ORJSONResponse:
    async with postgres.pool.acquire() as db:
        await AddressesRepository.create(db, data)
    return ORJSONResponse('healthy')
