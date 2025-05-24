import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

const ClientDetails = (props) => {
  const { id } = useParams()
  const [consumption, setConsumption] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const setEditedClient = props.setEditedClient
  const setClient = props.setClient
  const isEditing = props.isEditing
  const client = props.client
  const editedClient = props.editedClient

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      const foundClient = mockClients.find(c => c.id === parseInt(id))
      if (foundClient) {
        setClient(foundClient)
        setEditedClient(foundClient)
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

  if (loading) return <div className="loading">Загрузка...</div>
  if (error) return <div className="error">{error}</div>
  if (!client) return <div className="error">Клиент не найден</div>

  return (
    <main className="app-main">
      <div className="client-details-page">
        <div className="client-content">
          <div className="client-info">
            <div className="info-section">
              <h2>Основная информация</h2>
              <div className="form-group">
                <span style={{fontWeight: "bold"}}>Адрес: </span>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedClient.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className="input">{client.address}</span>
                )}
              </div>
              <div className="form-group">
                <span style={{fontWeight: "bold"}}>Статус: </span>
                {isEditing ? (
                  <select
                    name="type"
                    value={editedClient.type}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="private">Частный</option>
                    <option value="apartment">Многоквартирный</option>
                    <option value="country_house">Дача</option>
                    <option value="other">Прочий</option>
                  </select>
                ) : (
                  <span className="input">{client.type}</span>
                )}
              </div>
              <div className="form-group">
                <span style={{fontWeight: "bold"}}>Коэффициент подозрительности:</span> {client.coefficient}%
              </div>
            </div>

            <div className="info-section">
              <h2>Статус проверки</h2>
              <div className="form-group">
                <label>Комментарий</label>
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
    </main>
  )
}

export default ClientDetails 