import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import uvicorn
from fastapi import FastAPI

from config import logger
# from src.api.grpc.services import ProxyService
# from src.storage import database
from src.api import router as api_router

logger = logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # await database.connect()
    # grpc_task = asyncio.create_task(ProxyService.serve())
    yield
    # grpc_task.cancel()
    # await database.disconnect()


def create_app() -> FastAPI:
    fastapi = FastAPI(docs_url='/swagger', lifespan=lifespan)
    fastapi.include_router(api_router)
    return fastapi


if __name__ == '__main__':
    uvicorn.run(
        'src.__main__:create_app',
        factory=True,
        host='0.0.0.0',
        port=8001,  # noqa: WPS432
        workers=1,
        access_log=False,
    )
