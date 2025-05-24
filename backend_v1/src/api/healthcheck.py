from fastapi.responses import ORJSONResponse

from src.api.router import router

@router.post('/healthcheck', include_in_schema=False)
async def healthcheck() -> ORJSONResponse:
    return ORJSONResponse('healthy')
