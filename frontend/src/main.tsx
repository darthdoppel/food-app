import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import { NextUIProvider } from '@nextui-org/react'
import NavbarComponent from './components/Navbar'
import { ThemeProvider, useTheme } from './components/ThemeContext'
import RestaurantList from './components/RestaurantList'
import RestaurantDetail from './components/RestaurantDetail'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const Main: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme} min-h-screen text-foreground bg-background flex flex-col`}>
      <Toaster richColors />
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8 mt-12 flex-1">
        {/* Definir tus rutas aquí */}
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        </Routes>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <ThemeProvider>
        {/* Envuelve tu aplicación con el Router */}
        <Router>
          <Main />
        </Router>
      </ThemeProvider>
    </NextUIProvider>
  </React.StrictMode>
)
