import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { mockClients, mockConsumption } from '../mockData'
import './ClientDetails.css'

const ClientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [consumption, setConsumption] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedClient, setEditedClient] = useState(null)

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      const foundClient = mockClients.find(c => c.id === parseInt(id))
      if (foundClient) {
        setClient(foundClient)
        setEditedClient(foundClient)
        // Преобразуем данные для графика
        const chartData = mockConsumption[id].consumption.map(([month, value]) => ({
          month,
          потребление: value
        }))
        setConsumption(chartData)
        setError(null)
      } else {
        setError('Клиент не найден')
      }
      setLoading(false)
    }, 500)
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Имитация сохранения
    setClient(editedClient)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedClient(client)
    setIsEditing(false)
  }

  if (loading) return <div className="loading">Загрузка...</div>
  if (error) return <div className="error">{error}</div>
  if (!client) return <div className="error">Клиент не найден</div>

  return (
    <div className="client-details-page">
      <div className="client-header">
        <button className="btn" onClick={() => navigate('/clients')}>
          ← Назад к списку
        </button>
        <div className="header-actions">
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
        </div>
      </div>

      <div className="client-content">
        <div className="client-info">
          <div className="info-section">
            <h2>Основная информация</h2>
            <div className="form-group">
              <label>Адрес</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedClient.address}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{client.address}</p>
              )}
            </div>
            <div className="form-group">
              <label>Юридическое лицо</label>
              {isEditing ? (
                <input
                  type="text"
                  name="legalEntity"
                  value={editedClient.legalEntity}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{client.legalEntity}</p>
              )}
            </div>
            <div className="form-group">
              <label>Статус</label>
              {isEditing ? (
                <select
                  name="status"
                  value={editedClient.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Активный</option>
                  <option value="inactive">Неактивный</option>
                  <option value="pending">В ожидании</option>
                </select>
              ) : (
                <p>{client.status}</p>
              )}
            </div>
            <div className="form-group">
              <label>Коэффициент подозрительности</label>
              {isEditing ? (
                <input
                  type="number"
                  name="coefficient"
                  value={editedClient.coefficient}
                  onChange={handleInputChange}
                  step="0.1"
                />
              ) : (
                <p>{client.coefficient}%</p>
              )}
            </div>
          </div>

          <div className="info-section">
            <h2>Дополнительная информация</h2>
            <div className="form-group">
              <label>Комментарии</label>
              {isEditing ? (
                <textarea
                  name="comments"
                  value={editedClient.comments}
                  onChange={handleInputChange}
                  rows="4"
                />
              ) : (
                <p>{client.comments}</p>
              )}
            </div>
            {client.photo && (
              <div className="photo-section">
                <h3>Фото</h3>
                <img src={client.photo} alt="Фото клиента" className="client-photo" />
              </div>
            )}
          </div>
        </div>

        <div className="chart-section">
          <h2>График потребления</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={consumption}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value} кВт⋅ч`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} кВт⋅ч`, 'Потребление']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="потребление"
                  stroke="#11A538"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#11A538" }}
                  activeDot={{ r: 6, fill: "#11A538" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDetails 