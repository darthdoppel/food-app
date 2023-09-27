import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import NavbarComponent from './components/Navbar'
import { ThemeProvider, useTheme } from './components/ThemeContext'
import RestaurantList from './components/RestaurantList'

const Main: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme} min-h-screen text-foreground bg-background flex flex-col`}>
      <NavbarComponent />
      <div className="container mx-auto px-4 py-8 mt-12 flex-1">
        <RestaurantList />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </NextUIProvider>
  </React.StrictMode>
)
