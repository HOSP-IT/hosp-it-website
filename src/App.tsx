import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SatuSehatPage from './pages/SatuSehatPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/integrasi-satusehat" element={<SatuSehatPage />} />
    </Routes>
  )
}

export default App
