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
  const [isSearched, setSearched] = useState(null)

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
        console.log(foundClient.consumptions)
        const chartData = foundClient.consumptions.map((consumption) => ({
          month: consumption.date,
          потребление: consumption.consumption
        }))
        setConsumption(chartData)
        setError(null)
        setSearched(foundClient.company)
        setChecked(foundClient.checked)
      } else {
        setError('Клиент не найден')
      }
      setLoading(false)
    }, 500)
  }, [setClient, setEditedClient, id])

  const createDocument = async (client) => {
    let doc = ''
    const date = new Date();
    doc = await axios.post('/api/get_claim/', {
      "court_name": "Краснодарский краевой суд",
      "court_address": "Краснодарский край, г. Краснодар, ул. Красная, д. 10",
      "istec": "ПАО \"ТНС Энерго Кубань\"",
      "istec_inn": "2308119595",
      "istec_ogrn": "1062309019794",
      "istec_address": "Гимназическая ул., 55/1, Краснодар, Краснодарский край, 350000",
      "otvetchik_name": client.name,
      "otvetchik_address": client.address,
      "damage_sum": "_____________",
      "consumption_period": "\"___\" _____________ 20__ г.",
      "activity_type": "_________________",
      "act_date": `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`,
      "expertise_date": `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`,
      "tariff_calculation": "____________"
    }, {
      responseType: 'arraybuffer', // This ensures proper binary handling
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json; charset=UTF-8' // For your request body
      }})
    const blob = new Blob([doc.data], { type: "application/pdf; charset=UTF-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedClient(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleResearch = (client_id) => {
    setTimeout(async () => {
      const res = await axios.post('/suspicious_clients/', {client_id: client_id})
      setChecked(res.data?.checked)
      return res.data?.id
    }, 500)
  }

  const handleSearch = (client_address) => {
    setSearched('s')
    setTimeout(async () => {
      const res = await axios.get(`/api/analyze_address/?address=${client_address}`)
      console.log(res.data)
      const blob = new Blob([JSON.stringify(res.data)], { type: "application/json; charset=UTF-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = 'search.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSearched(null)
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
            <div style={{textAlign: "left"}} className="info-section">
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
              <div style={{display: "inline-flex", flexDirection: "column", gap: "10px", width: "100%"}}>
                { isChecked == null
                  ? <button onClick={() => handleResearch(client.id)} className="btn btn-primary">Запросить проверку</button>
                  : <div className="form-group">
                      <label>Комментарий:</label>
                      <>{isChecked == true ? (
                        <>
                          <p>{client.comment ? client.comment : <i>Бригада не оставила комментарий</i>}</p>
                          <br />
                          <button onClick={() => createDocument(client)} className="btn btn-primary">Составить иск</button>
                        </>
                      ) : <i>Запрошена проверка</i>}</>
                    </div>
                }
                {
                  isSearched == null
                  ? <button onClick={() => handleSearch(client.address)} className="btn btn-primary">Запустить поиск</button>
                  : <button className="btn">Запущен поиск, ожидайте...</button>
                }
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