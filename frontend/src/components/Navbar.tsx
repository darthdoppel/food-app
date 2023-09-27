import React from 'react'
import { AcmeLogo } from '../icons/AcmeLogo'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react'
import DarkModeSwitch from './DarkModeSwitch'
import { useTheme } from './ThemeContext'

const NavbarComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">FOOD APP</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Restaurants
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Bares
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Reseñas
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <DarkModeSwitch onChange={toggleTheme} checked={theme === 'dark'} />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default NavbarComponent
