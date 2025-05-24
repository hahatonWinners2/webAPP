import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockClients } from '/src/mockData'
import './ClientList.css'
import { FaPlus, FaSync } from 'react-icons/fa'
import UploadPage from "../../pages/upload_page.jsx";

const ClientList = ({ onAddClick }) => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')
  const [sortField, setSortField] = useState('address')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showUPloader, setUPloader] = useState(false);


  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 500)
  }, [])

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
    // Имитация обновления данных
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 500)
  }

  const filteredAndSortedClients = clients
    .filter(client => 
      client.address.toLowerCase().includes(filter.toLowerCase()) ||
      client.info.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === 'asc' ? 1 : -1
      
      if (sortField === 'coefficient') {
        return (aValue - bValue) * direction
      }
      
      return String(aValue).localeCompare(String(bValue)) * direction
    })

  // SuspicionIndicator: colored dot + percent
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
  // if (error) return <div className="error">{error}</div>
  return (
    <main className="app-main">
      <div className="client-list-page">
        <div className="client-list-filters">
          <input
            type="text"
            placeholder="Поиск по адресу или информации..."
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
              <FaPlus />
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
                <th onClick={() => handleSort('info')} className="sortable">
                  Комментарий {sortField === 'info' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('coefficient')} className="sortable">
                  Процент подозрительности {sortField === 'coefficient' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                  <td>{client.info}</td>
                  <td><SuspicionIndicator value={client.coefficient} /></td>
                  <td>
                    <input 
                      type="checkbox" 
                      className="client-checkbox"
                      onClick={e => e.stopPropagation()} 
                    />
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