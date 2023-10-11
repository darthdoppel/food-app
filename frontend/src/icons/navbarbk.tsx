import React, { useEffect, useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button
} from '@nextui-org/react'
import { AcmeLogo } from '../icons/AcmeLogo'
import DarkModeSwitch from './DarkModeSwitch'
import { useTheme } from './ThemeContext'
import RegisterModal from './modals/RegisterModal'
import LoginModal from './modals/LoginModal'
import UserIcon from '../icons/UserIcon'
import useAuthStore from '../store/authStore'
import DisplayUser from './DisplayUser'
import { verifyToken } from '../services/authService'

const NavbarComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(true) // Estado para manejar la carga

  const openModal = () => { setShowModal(true) }
  const openLoginModal = () => { setShowLoginModal(true) }

  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout
  }))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token != null) {
      verifyToken(token)
        .then(user => {
          useAuthStore.getState().setUser(user)
          useAuthStore.getState().setToken(token)
        })
        .catch(err => {
          console.error('Error verifying token:', err)
          localStorage.removeItem('token') // Elimina el token no válido del localStorage
        })
        .finally(() => {
          setLoading(false) // Establece loading como false independientemente de si la verificación fue exitosa o no
        })
    } else {
      setLoading(false) // Si no hay token, establece loading como false
    }
  }, [])

  const menuItems = [
    { label: 'Restaurants', href: '/' },
    { label: 'Bares', href: '#', isActive: true },
    { label: 'Reseñas', href: '#' }
  ]

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered className="py-2 md:py-4">
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <Link
          color="foreground"
          href="/"
          size="lg"
          showAnchorIcon
          anchorIcon={<AcmeLogo />}
          className='font-bold text-xl md:text-2xl'
          >
            BA RESTAURANT GUIDE
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.label} isActive={item.isActive}>
            <Link color="foreground" href={item.href}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent className="flex gap-2 md:gap-4 lg:gap-6 xl:gap-8 items-end hidden sm:flex" justify="end">
        <NavbarItem className="hidden lg:flex">
          <DarkModeSwitch onChange={toggleTheme} checked={theme === 'dark'} />
        </NavbarItem>
        {(user != null)
          ? (
            <>
            <NavbarItem>
              <DisplayUser />
            </NavbarItem>

            <NavbarItem>
              <Button color="danger" startContent={<UserIcon />} variant="ghost" onClick={logout}>
                Logout
              </Button>
            </NavbarItem>
            </>
            )
          : (
          <>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={openLoginModal}
                isLoading={loading}
              >
                Login
              </Button>
            </NavbarItem>
            {showLoginModal && <LoginModal onClose={() => { setShowLoginModal(false) }} />}
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={openModal}
                isLoading={loading}
              >
                Sign Up
              </Button>
            </NavbarItem>
            {showModal && <RegisterModal onClose={() => { setShowModal(false) }} />}
          </>
            )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link color="foreground" className="w-full" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {/* Agregar controles de usuario para móviles aquí */}
        {(user != null)
          ? (
          <>
            <NavbarMenuItem>
              <DisplayUser />
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button color="danger" startContent={<UserIcon />} variant="ghost" onClick={logout}>
                Logout
              </Button>
            </NavbarMenuItem>
          </>
            )
          : (
          <>
            <NavbarMenuItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={openLoginModal}
                isLoading={loading}
              >
                Login
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="flat"
                onClick={openModal}
                isLoading={loading}
              >
                Sign Up
              </Button>
            </NavbarMenuItem>
          </>
            )}
      </NavbarMenu>
    </Navbar>
  )
}

export default NavbarComponent
