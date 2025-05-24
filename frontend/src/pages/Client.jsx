import { useState } from 'react'
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Header from '../components/header/Header';
import ClientDetails from '../components/ClientDetails'

const ClientPage = () => {
    const navigate = useNavigate();
    const { setHeader } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false)
    const [client, setClient] = useState(null)
    const [editedClient, setEditedClient] = useState(null)

    React.useEffect(() => {
        const handleSave = () => {
            setClient(editedClient)
            setIsEditing(false)
        }
        
        const handleCancel = () => {
            setEditedClient(client)
            setIsEditing(false)
        }

        setHeader(
            <Header useLogo="false">
                <div>
                    <button style={{
                        fontSize: "28px",
                        background: "none",
                        border: "none",
                        display: "inline",
                        textAlign: "center",
                        color: "white",
                        cursor: "pointer"
                    }} onClick={() => navigate('/clients')}>
                        ←
                    </button>
                    Информация о клиенте
                </div>
                {isEditing ? (
                <>
                    <button className="btn btn-primary" onClick={handleSave}>
                    Сохранить
                    </button>
                    <button className="btn" onClick={handleCancel}>
                    Отмена
                    </button>
                </>
                ) : (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Редактировать
                </button>
                )}
            </Header>
        );
    }, [isEditing, client, editedClient, setHeader, navigate]);

    return (
        <>
            <ClientDetails setEditedClient={setEditedClient} setClient={setClient} isEditing={isEditing} client={client} editedClient={editedClient} />
        </>
    )
}

export default ClientPage