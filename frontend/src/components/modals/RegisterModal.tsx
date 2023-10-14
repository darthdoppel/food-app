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
import { useTheme } from '../ThemeContext'
import useAuthStore from '../../store/authStore'
import { toast } from 'sonner'
import { registerUser } from '../../services/ApiService'

interface RegisterModalProps {
  onClose: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const { theme } = useTheme() // Obtiene el tema actual del contexto
  const { setUser, setToken } = useAuthStore() // Usa la store de auth para obtener setUser y setToken.

  const handleSubmit = async () => {
    try {
      const user = {
        username,
        email,
        password
      }
      const data = await registerUser(user)

      setUser(data.user)
      setToken(data.token)
      onClose()
    } catch (error) {
      // Manejar error. Podrías mostrar un mensaje al usuario aquí
      toast.error('Failed to register. Please try again later.')
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h1 className={theme === 'dark' ? 'text-white' : ''}>Register</h1>
        </ModalHeader>
        <ModalBody>
          <Input value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" />
          <Input value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
          <Input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={() => { handleSubmit().catch(err => { console.error(err) }) }}>
            Register
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default RegisterModal
