from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

from app.simple_processing.router import router as processing_router
from app.clients.router import router as client_router
from app.checkers.router import router as checker_router

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(processing_router, prefix="/api")
app.include_router(client_router, prefix="")
app.include_router(checker_router)
