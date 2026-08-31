import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SatuSehatPage from './pages/SatuSehatPage'
import ArtikelListPage from './pages/ArtikelListPage'
import ArtikelDetailPage from './pages/ArtikelDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/integrasi-satusehat" element={<SatuSehatPage />} />
      <Route path="/artikel" element={<ArtikelListPage />} />
      <Route path="/artikel/:slug" element={<ArtikelDetailPage />} />
    </Routes>
  )
}

export default App
