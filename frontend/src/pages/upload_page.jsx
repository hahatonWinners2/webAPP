import React, { useState } from 'react';
import '/src/components/add-client-modal/AddClientModal.css'
import axios from 'axios'

const UploadPage = ({ onClose, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setError(null);
        setIsLoading(true);

        try {
            if (!selectedFile) {
                throw new Error("Пожалуйста, выберите файл!");
            }

            if (!selectedFile.name.endsWith('.json')) {
                throw new Error("Только JSON-файлы разрешены!");
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/api/upload-json/', formData);

            if (response.status != 200) {
                const errorData = await response.json;
                throw new Error(errorData.detail || "Ошибка сервера");
            }

            const result = await response.json;
            if (onUploadSuccess != undefined && onUploadSuccess != null) {
                onUploadSuccess(result);
            }
            onClose();
            alert("Файл успешно загружен!");

        } catch (error) {
            setError(error.message);
        } finally {
            setTimeout(() => setIsLoading(false), 5000)
        }
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>Загрузка JSON-файла</h2>

                {error && <div style={errorStyle}>{error}</div>}

                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={inputStyle}
                />

                <div style={buttonContainerStyle} className="modal-actions">
                    <button
                        onClick={onClose}
                        className="btn"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? 'Загрузка...' : 'Загрузить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Стили
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '500px'
};

const errorStyle = {
    color: 'red',
    margin: '1rem 0',
    fontSize: '0.9rem'
};

const inputStyle = {
    margin: '1rem 0',
    width: '100%'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
};

export default UploadPage;
