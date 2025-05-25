from fastapi import APIRouter, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.future import select
from sqlalchemy.sql import exists
from datetime import date
from sqlalchemy import desc, and_
from typing import List, Optional
from collections import defaultdict
from copy import deepcopy

from schemas.client import ClientCreate, MonthlyConsumptionResponse, ClientResponse, TopClientResponse
from storage.models.client import Client
from storage.models.consumption import MonthlyConsumption
from storage.models.suspicious import SuspiciousClient
from storage.postgres import async_session
from datetime import date
from dateutil.relativedelta import relativedelta
from utils.algorithm.processor import get_answers

def next_month(d: date) -> date:
    return d + relativedelta(months=1)



router = APIRouter()

@router.post("/clients/")
async def create_client(
    client_in: ClientCreate,
):
    suspicion_level = get_answers(deepcopy(client_in.__dict__))[-1]

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
    i = 1
    for month, c in client_in.consumption.items():
        i += 1
        # background_tasks.add_task(add_next_month_consumption, new_client.id, consumption)
        await add_next_month_consumption(new_client.id, c, int(month), i == len(client_in.consumption))

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
                ).correlate(Client)
            )
            query = query.where(exists(subq))

        query = query.order_by(desc(Client.suspicion)).limit(15)

        result = await db.execute(query)
        clients = [TopClientResponse(**client[0].__dict__, checked=client[1]) for client in result.all()]
        return clients


@router.post("/clients/{client_id}/monthly_consumption")
async def add_next_month_consumption(
    client_id: str,
    consumption_value: float,
    month: int | None = None,
    get_score=True,
):
    async with async_session() as db:
        # Fetch client
        result = await db.execute(select(Client).where(Client.id == client_id))
        client = result.scalars().first()
        if not client:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

        # Fetch all consumption records for the client
        result = await db.execute(
            select(MonthlyConsumption).where(MonthlyConsumption.client_id == client_id)
        )
        all_consumptions = result.scalars().all()

        # Group consumptions by month number and calculate averages
        month_consumptions = defaultdict(list)
        for c in all_consumptions:
            month_consumptions[c.date.month].append(c.consumption)

        avg_consumptions = {
            month: sum(values) / len(values)
            for month, values in month_consumptions.items()
        }

        # Determine new date for the next consumption entry
        if month:
            today = date.today()
            new_date = date(today.year, month, 1)
        elif all_consumptions:
            last_date = max(c.date for c in all_consumptions)
            new_date = next_month(last_date)
        else:
            new_date = date.today().replace(day=1)

        # Add new consumption record
        new_consumption = MonthlyConsumption(
            client_id=client_id,
            date=new_date,
            consumption=consumption_value
        )
        db.add(new_consumption)
        await db.commit()
        await db.refresh(new_consumption)

        # Update avg_consumptions with the new month consumption (overwrite or add)
        avg_consumptions[new_date.month] = (
            (avg_consumptions.get(new_date.month, 0) * len(month_consumptions.get(new_date.month, [])) + consumption_value)
            / (len(month_consumptions.get(new_date.month, [])) + 1)
        )

        if get_score:
            # Prepare data dictionary for get_answer
            data_dict = client.__dict__
            data_dict["consumption"] = avg_consumptions

            suspicion = get_answers(data_dict)[-1]  # await if async

            # Update client suspicion
            client.suspicion = suspicion
        db.add(client)
        await db.commit()
        await db.refresh(client)

    return {
        "client": {
            "id": client.id,
            "address": client.address,
            "suspicion": client.suspicion,
        },
        "new_consumption": {
            "date": new_consumption.date,
            "consumption": new_consumption.consumption
        }
    }


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
        consumptions = [MonthlyConsumptionResponse(date=c.date, consumption=c.consumption) for c in result.scalars().all()]

    suspicious = client[1].__dict__ if client[1] else {}
    suspicious.update(client[0].__dict__)
    client = ClientResponse(**suspicious, consumptions=consumptions)
    return client
