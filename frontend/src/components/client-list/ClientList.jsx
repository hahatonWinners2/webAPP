import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ClientList.css'
import { FaPlus, FaSync, FaPaperclip } from 'react-icons/fa'
import UploadPage from "/src/pages/upload_page.jsx";
import axios from 'axios'

const ClientList = ({ onAddClick }) => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sortField, setSortField] = useState('address')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showUPloader, setUPloader] = useState(false);


  useEffect(() => {
    setTimeout(async () => {
      const clients = await axios.get('/clients/')
      setClients(clients.data)
      setLoading(false)
    }, 500)
  }, [])

  const handleResearch = (client_id) => {
    setTimeout(async () => {
      const res = await axios.post('/suspicious_clients/', {client_id: client_id})
      return res.data?.id
    }, 500)
  }

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(async () => {
      const clients = await axios.get('/clients/')
      setClients(clients.data)
      setLoading(false)
    }, 500)
  }

  const filteredAndSortedClients = clients
    .filter(client => 
      client.address.toLowerCase().includes(filter.toLowerCase()) ||
      client.buildingType.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === 'asc' ? 1 : -1
      
      if (sortField === 'suspicion') {
        return (aValue - bValue) * direction
      }
      
      return String(aValue).localeCompare(String(bValue)) * direction
    })

  const SuspicionIndicator = ({ value }) => {
    let color = 'green'
    if (value > 80) color = 'red'
    else if (value >= 50) color = 'orange'
    return (
      <span className="suspicion-indicator">
        <span className={`suspicion-dot ${color}`}></span>
        {value}%
      </span>
    )
  }

  if (loading) return <div className="loading">Загрузка...</div>
  return (
    <main className="app-main">
      <div className="client-list-page">
        <div className="client-list-filters">
          <input
            type="text"
            placeholder="Поиск по адресу или типу строения..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          <div className="header-actions">
            <button className="btn-icon" onClick={handleRefresh} title="Обновить данные">
              <FaSync />
            </button>
            <button className="btn-icon" onClick={onAddClick} title="Добавить клиента">
              <FaPlus />
            </button>
            <button className="btn-icon" onClick={() => setUPloader(true)} title="Загрузить таблицу">
              <FaPaperclip />
            </button>
          </div>
          {showUPloader && (
              <UploadPage onClose={() => setUPloader(false)} />
          )}
        </div>
        <div className="client-list">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('address')} className="sortable">
                  Адрес {sortField === 'address' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('buildingType')} className="sortable">
                  Тип строения {sortField === 'buildingType' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('suspicion')} className="sortable">
                  Процент подозрительности {sortField === 'suspicion' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedClients.map(client => (
                <tr 
                  key={client.id}
                  className={client.highlighted ? 'highlighted' : ''}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{client.address}</td>
                  <td>{client.buildingType}</td>
                  <td><SuspicionIndicator value={client.suspicion} /></td>
                  <td>
                    {
                      client?.checked == null ?
                      <button 
                        type="button"
                        className="client-checkbox"
                        onClick={(e) => {e.stopPropagation(); handleResearch(client.id)}}>
                        Запросить проверку
                      </button>
                      : 
                      <button 
                        type="button"
                        className="client-checkbox requested"
                      >
                        Запрошена проверка
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default ClientList