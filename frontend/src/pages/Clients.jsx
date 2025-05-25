import React from  'react';
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom';

import Header from '/src/components/header/Header'
import ClientList from '/src/components/client-list/ClientList'
import AddClientModal from '/src/components/add-client-modal/AddClientModal'

const ClientsPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const { setHeader } = useOutletContext();

    React.useEffect(() => {
        setHeader(<Header>Аналитика потребления клиентов</Header>);
    }, [setHeader]);

    return (
        <>
            <ClientList onAddClick={() => setIsAddModalOpen(true)}></ClientList>

            {isAddModalOpen && (
                <AddClientModal onClose={() => setIsAddModalOpen(false)} />
            )}
        </>
    )
}

export default ClientsPage