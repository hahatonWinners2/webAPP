from asyncpg.connection import Connection

from src.repositories.base import BaseRepository
from src.schemas import AddressSchema, CreateAddressSchema
from src.specifications import Specification


class AddressesRepository(BaseRepository):
    @staticmethod
    async def create(
        connection: Connection,
        create_data: CreateAddressSchema,
    ) -> AddressSchema:
        return await super(__class__, __class__).create(
            connection,
            'hackaton.addresses',
            AddressSchema,
            create_data,
        )

    @staticmethod
    async def get(
        connection: Connection,
        *specifications: Specification,
        page: int = 1,
        page_size: int = 100,
    ) -> list[AddressSchema]:
        return await super(__class__, __class__).get(
            connection,
            'dating.accounts',
            AddressSchema,
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
