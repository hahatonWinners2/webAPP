from asyncpg.connection import Connection

from src.repositories.base import BaseRepository
from src.schemas import SuspectSchema, CreateSuspectSchema, UpdateSuspectSchema
from src.specifications import Specification


class SuspectsRepository(BaseRepository):
    @staticmethod
    async def create(
        connection: Connection,
        create_data: CreateSuspectSchema,
    ) -> SuspectSchema:
        return await super(__class__, __class__).create(
            connection,
            'hackaton.suspects',
            SuspectSchema,
            create_data,
        )

    @staticmethod
    async def get(
        connection: Connection,
        *specifications: Specification,
        page: int = 1,
        page_size: int = 100,
    ) -> list[SuspectSchema]:
        return await super(__class__, __class__).get(
            connection,
            'hackaton.suspects',
            SuspectSchema,
            *specifications,
            page=page,
            page_size=page_size,
        )

    @staticmethod
    async def update(
        connection: Connection,
        *specifications: Specification,
        update_all: bool = False,
        update_data: UpdateSuspectSchema,
    ) -> str:
        return await super(__class__, __class__).update(
            connection,
            'hackaton.suspects',
            *specifications,
            update_all=update_all,
            update_data=update_data,
        )

    @staticmethod
    async def delete() -> str:
        return NotImplementedError()