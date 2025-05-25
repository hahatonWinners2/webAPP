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
import './ClientDetails.css'
import axios from 'axios'

const ClientDetails = (props) => {
  const { id } = useParams()
  const [consumption, setConsumption] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isChecked, setChecked] = useState(null)

  const setEditedClient = props.setEditedClient
  const setClient = props.setClient
  const isEditing = props.isEditing
  const client = props.client
  const editedClient = props.editedClient

  useEffect(() => {
    setTimeout(async () => {
      const foundClient = (await axios.get('/clients/' + id)).data
      if (foundClient) {
        setClient(foundClient)
        setEditedClient(foundClient)
        const chartData = foundClient.consumptions.map(([month, value]) => ({
          month,
          потребление: value
        }))
        setConsumption(chartData)
        setError(null)
        setChecked(foundClient.checked)
      } else {
        setError('Клиент не найден')
      }
      setLoading(false)
    }, 500)
  }, [setClient, setEditedClient, id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResearch = (client_id) => {
    console.log(client_id)
    setTimeout(async () => {
      const res = await axios.post('/suspicious_clients/', {client_id: client_id})
      setChecked(res.data?.checked)
      return res.data?.id
    }, 500)
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
                    name="buildingType"
                    value={editedClient.buildingType}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="Частный">Частный</option>
                    <option value="Многоквартирный">Многоквартирный</option>
                    <option value="Дача">Дача</option>
                    <option value="Прочий">Прочий</option>
                  </select>
                ) : (
                  <span className="input">{client.buildingType}</span>
                )}
              </div>
              <div className="form-group">
                <span style={{fontWeight: "bold"}}>Коэффициент подозрительности:</span> {client.suspicion}%
              </div>
            </div>

            <div className="info-section">
              <h2>Статус проверки</h2>
              { isChecked == null
                ? <button onClick={() => handleResearch(client.id)}>Запросить проверку</button>
                : <div className="form-group">
                    <label>Комментарий</label>
                    <p>{isChecked == true ? client.comment : 'Запрошена проверка'}</p>
                  </div>
              }
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