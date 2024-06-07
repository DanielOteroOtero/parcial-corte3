import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PagPrincipal from './pagPrincipal';
import { AuthProvider } from './authContext'

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<PagPrincipal />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
