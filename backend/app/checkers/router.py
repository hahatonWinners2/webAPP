from fastapi import APIRouter, HTTPException, status
from sqlalchemy.future import select
from storage.models.suspicious import SuspiciousClient
from schemas.suspicious import SuspiciousClientCreate, SuspiciousClientRead, SuspiciousClientUpdateComment, SuspiciousClientResponse, SuspiciousClientUpdateVerdict
from storage.postgres import async_session  # your async sessionmaker

router = APIRouter()

@router.post("/suspicious_clients/", response_model=SuspiciousClientRead)
async def create_suspicious_client(data: SuspiciousClientCreate):
    new_record = SuspiciousClient(
        client_id=data.client_id,
        company='Не обнаружено',
        checked=False,
        comment='',
    )

    async with async_session() as db:
        db.add(new_record)
        await db.commit()
        await db.refresh(new_record)

    return new_record


@router.delete("/suspicious_clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_suspicious_clients_by_client(client_id: str):
    async with async_session() as db:
        result = await db.execute(
            select(SuspiciousClient).where(SuspiciousClient.client_id == client_id)
        )
        records = result.scalars().all()
        if not records:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No records found for this client")

        for record in records:
            await db.delete(record)
        await db.commit()


@router.patch("/suspicious_clients/{client_id}/comment")
async def update_comment_by_client(client_id: str, data: SuspiciousClientUpdateComment):
    async with async_session() as db:
        result = await db.execute(
            select(SuspiciousClient).where(SuspiciousClient.client_id == client_id)
        )
        records = result.scalars().all()
        if not records:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No records found for this client")

        for record in records:
            record.comment = data.comment

        await db.commit()
        return {"updated": len(records)}

@router.patch("/suspicious_clients/{client_id}/verdict")
async def update_comment_by_client(client_id: str, data: SuspiciousClientUpdateVerdict):
    async with async_session() as db:
        result = await db.execute(
            select(SuspiciousClient).where(SuspiciousClient.client_id == client_id)
        )
        records = result.scalars().all()
        if not records:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No records found for this client")

        for record in records:
            record.verdict = data.verdict
            record.checked = True

        await db.commit()
        return {"updated": len(records)}

@router.get("/suspicious_client/{client_id}", response_model=SuspiciousClientResponse)
async def get_suspicious_client_id(client_id: str):
    async with async_session() as db:
        result = await db.execute(
            select(SuspiciousClient).where(SuspiciousClient.client_id == client_id)
        )
        record = result.scalars().first()
        if not record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Suspicious client record not found")

    return record