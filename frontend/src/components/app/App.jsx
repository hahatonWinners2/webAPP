import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import ClientPage from '/src/pages/Client'
import ClientsPage from '/src/pages/Clients'
import Response404 from '/src/pages/Response404'
import { AppRoute } from '/src/components/const'
import MainLayout from '/src/layouts/main-layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.main} element={<MainLayout />}>
          <Route index element={<ClientsPage />} />
          <Route path={AppRoute.clients} element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientPage />} />
        </Route>
        <Route path="*" element={<Response404 />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
