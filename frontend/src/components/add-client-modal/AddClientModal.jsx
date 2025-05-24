import { useState } from 'react'
import axios from 'axios'
import './AddClientModal.css'

const AddClientModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    buildingType: 'Прочий',
    roomsCount: 1,
    residentsCount: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.post('/clients', formData)
      onClose()
    } catch (err) {
      setError('Ошибка при создании клиента')
      console.error('Error creating client:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Добавить клиента</h2>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя клиента</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={500}
                  placeholder="Имя клиента"
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows="3"
                  placeholder="Описание клиента"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buildingType">Тип здания</label>
              <select
                  id="buildingType"
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleInputChange}
                  required
              >
                <option value="Прочий">Прочий</option>
                <option value="Жилой">Жилой</option>
                <option value="Коммерческий">Коммерческий</option>
                {/* Добавьте другие типы по необходимости */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roomsCount">Количество комнат</label>
              <input
                  type="number"
                  id="roomsCount"
                  name="roomsCount"
                  value={formData.roomsCount}
                  onChange={handleInputChange}
                  min={0}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="residentsCount">Количество жильцов</label>
              <input
                  type="number"
                  id="residentsCount"
                  name="residentsCount"
                  value={formData.residentsCount}
                  onChange={handleInputChange}
                  min={0}
                  required
              />
            </div>


            <div className="modal-actions">
              <button
                  type="button"
                  className="btn"
                  onClick={onClose}
                  disabled={loading}
              >
                Отмена
              </button>
              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
              >
                {loading ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

export default AddClientModal
