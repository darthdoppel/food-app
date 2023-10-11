import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from '@nextui-org/react'
import useAuthStore from '../../store/authStore' // Asegúrate de importar desde la ubicación correcta
import { toast } from 'sonner'
import { loginUser } from '../../services/authService'

interface LoginModalProps {
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { setUser, setToken } = useAuthStore() // Usa la store de auth para obtener setUser y setToken.

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit().catch(err => { console.error(err) })
    }
  }

  const handleSubmit = async () => {
    try {
      const data = await loginUser(username, password)
      toast.success('User logged in successfully!')

      setUser(data.user) // Asume que el user viene en el objeto de respuesta.
      setToken(data.token) // Asume que el token viene en el objeto de respuesta.

      // Almacenar el token en localStorage
      localStorage.setItem('token', data.token)

      onClose()
    } catch (error) {
      console.error('Error logging in user:', error)
      toast.error('Error logging in! Please check your credentials and try again.')
    }
  }

  return (
    <Modal
    isOpen
    onClose={onClose}
    backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h1>Login</h1>
        </ModalHeader>
        <ModalBody>
          <div onKeyPress={handleKeyPress}> {/* Envoltura con el evento onKeyPress */}
            <Input
              autoFocus
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
              placeholder="Username"
            />
          </div>
          <div onKeyPress={handleKeyPress}> {/* Envoltura con el evento onKeyPress */}
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              placeholder="Password"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => { handleSubmit().catch(err => { console.error(err) }) }}>
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
