import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Components
import ClientList from './components/ClientList'
import ClientDetails from './components/ClientDetails'
import AddClientModal from './components/AddClientModal'

function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <Router>
      <div className="app">
        <header className="app-header">
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ClientList onAddClick={() => setIsAddModalOpen(true)} />} />
            <Route path="/clients" element={<ClientList onAddClick={() => setIsAddModalOpen(true)} />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
          </Routes>
        </main>

        {isAddModalOpen && (
          <AddClientModal onClose={() => setIsAddModalOpen(false)} />
        )}
      </div>
    </Router>
  )
}

export default App
