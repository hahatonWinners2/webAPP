from contextlib import asynccontextmanager
from typing import AsyncGenerator
import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.simple_processing.router import router as processing_router
from app.clients.router import router as client_router
from app.checkers.router import router as checker_router

logging.basicConfig(format='%(asctime)s - [%(levelname)s] -  %(name)s - (%(filename)s).%(funcName)s(%(lineno)d) - %(message)s', level=logging.DEBUG)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(processing_router, prefix="/api")
app.include_router(client_router, prefix="")
app.include_router(checker_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
