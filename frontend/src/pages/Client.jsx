import { useState } from 'react'
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import Header from '/src/components/header/Header';
import ClientDetails from '/src/components/client-details/ClientDetails'

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
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    width: "100%"
                }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    }}>
                        <button style={{
                            fontSize: "28px",
                            background: "none",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            padding: "0 10px 0 5px"
                        }} onClick={() => navigate('/clients')}>
                            ←
                        </button>
                        <span>Информация о клиенте</span>
                    </div>
                    {isEditing ? (
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    }}>
                        <button className="btn btn-primary" onClick={handleSave}>
                        Сохранить
                        </button>
                        <button className="btn" onClick={handleCancel}>
                        Отмена
                        </button>
                    </div>
                    ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Редактировать
                    </button>
                    )}
                </div>
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