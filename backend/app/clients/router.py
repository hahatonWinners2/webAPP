from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.future import select
from datetime import date
from sqlalchemy import desc, and_
from typing import List, Optional

from schemas.client import ClientCreate, MonthlyConsumptionCreate, ClientResponse, TopClientResponse
from storage.models.client import Client
from storage.models.consumption import MonthlyConsumption
from storage.models.suspicious import SuspiciousClient
from storage.postgres import async_session
from datetime import date
from dateutil.relativedelta import relativedelta

def next_month(d: date) -> date:
    return d + relativedelta(months=1)



router = APIRouter()

@router.post("/clients/")
async def create_client(
    client_in: ClientCreate
):
    suspicion_level = 0

    new_client = Client(
        name=client_in.name,
        address=client_in.address,
        description=client_in.description,
        suspicion=suspicion_level,
        buildingType=client_in.buildingType,
        roomsCount=client_in.roomsCount,
        residentsCount=client_in.residentsCount,
    )

    async with async_session() as db:

        db.add(new_client)
        await db.commit()
        await db.refresh(new_client)

    return new_client


@router.get("/clients/", response_model=List[TopClientResponse])
async def get_clients(checked: Optional[bool] = Query(None, description="Filter clients by suspicious checked status")):
    async with async_session() as db:
        query = select(Client, SuspiciousClient.checked).join(SuspiciousClient, SuspiciousClient.client_id == Client.id, isouter=True)

        if checked is not None:
            subq = (
                select(SuspiciousClient.client_id)
                .where(
                    and_(
                        SuspiciousClient.client_id == Client.id,
                        SuspiciousClient.checked == checked
                    )
                )
                .exists()
            )
            query = query.where(subq)

        query = query.order_by(desc(Client.suspicion)).limit(15)

        result = await db.execute(query)
        clients = [TopClientResponse(**client[0].__dict__, checked=client[1]) for client in result.all()]
        return clients


@router.post("/clients/{client_id}/monthly_consumption", response_model=MonthlyConsumptionCreate)
async def add_next_month_consumption(
    client_id: str,
    consumption_value: float
):
    
    async with async_session() as db:
        result = await db.execute(select(Client).where(Client.id == client_id))
        client = result.scalars().first()
        if not client:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

        result = await db.execute(
            select(MonthlyConsumption)
            .where(MonthlyConsumption.client_id == client_id)
            .order_by(MonthlyConsumption.date.desc())
            .limit(1)
        )
        last_consumption = result.scalars().first()

        if last_consumption:
            new_date = next_month(last_consumption.date)
        else:
            new_date = date.today().replace(day=1)

        new_consumption = MonthlyConsumption(
            client_id=client_id,
            date=new_date,
            consumption=consumption_value
        )

        db.add(new_consumption)
        await db.commit()
        await db.refresh(new_consumption)

    return new_consumption


@router.get("/clients/{client_id}", response_model=ClientResponse)
async def get_monthly_consumptions(
    client_id: str
):
    async with async_session() as db:
        query = select(Client, SuspiciousClient).where(Client.id == client_id).join(SuspiciousClient, Client.id == SuspiciousClient.client_id, isouter=True)
        result = await db.execute(query)
        client = result.first()
        if not client:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
        result = await db.execute(
            select(MonthlyConsumption)
            .where(MonthlyConsumption.client_id == client_id)
            .order_by(MonthlyConsumption.date)
        )
        consumptions = result.scalars().all()
    suspicious = client[1].__dict__ if client[1] else {}
    suspicious.update(client[0].__dict__)
    client = ClientResponse(**suspicious, consumptions=consumptions)
    return client
