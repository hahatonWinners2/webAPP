import { useState } from 'react'
import axios from 'axios'
import './AddClientModal.css'

const AddClientModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    legalEntity: '',
    status: 'active',
    coefficient: 0,
    comments: '',
    photo: null
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
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      await axios.post('/api/clients', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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
            <label htmlFor="address">Адрес</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="legalEntity">Юридическое лицо</label>
            <input
              type="text"
              id="legalEntity"
              name="legalEntity"
              value={formData.legalEntity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="active">Активный</option>
              <option value="inactive">Неактивный</option>
              <option value="pending">В ожидании</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="coefficient">Коэффициент подозрительности</label>
            <input
              type="number"
              id="coefficient"
              name="coefficient"
              value={formData.coefficient}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="comments">Комментарии</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">Фото</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleInputChange}
              accept="image/*"
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