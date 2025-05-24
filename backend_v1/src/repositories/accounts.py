from asyncpg.connection import Connection

from src.repositories.base import BaseRepository
from src.schemas import AccountSchema, CreateAccountSchema
from src.specifications import Specification


class AccountsRepository(BaseRepository):
    @staticmethod
    async def create(
        connection: Connection,
        create_data: CreateAccountSchema,
    ) -> AccountSchema:
        return await super(__class__, __class__).create(
            connection,
            'hackaton.accounts',
            AccountSchema,
            create_data,
        )

    @staticmethod
    async def get(
        connection: Connection,
        *specifications: Specification,
        page: int = 1,
        page_size: int = 100,
    ) -> list[AccountSchema]:
        return await super(__class__, __class__).get(
            connection,
            'hackaton.accounts',
            AccountSchema,
            *specifications,
            page=page,
            page_size=page_size,
        )

    @staticmethod
    async def update() -> str:
        return NotImplementedError()

    @staticmethod
    async def delete() -> str:
        return NotImplementedError()
