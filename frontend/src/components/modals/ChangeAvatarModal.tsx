import React, { useState, useCallback } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { updateUserAvatar } from '../../services/ApiService'
import useAuthStore from '../../store/authStore'
import { toast } from 'sonner'

interface ChangeAvatarModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({ isOpen, onOpenChange }) => {
  const [newAvatarUrl, setNewAvatarUrl] = useState('')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAvatarUrl(e.target.value)
  }

  const { user, token } = useAuthStore((state) => ({
    user: state.user,
    token: state.token
  }))

  const handleAvatarSubmit = useCallback(async () => {
    if (user?.id == null) {
      console.error('User or user ID is not defined')
      onOpenChange(false)
      return
    }

    try {
      await updateUserAvatar(user.id, newAvatarUrl, token)
      toast.success('Avatar updated successfully')
      useAuthStore.getState().setUser({
        ...user,
        avatar: newAvatarUrl
      })
    } catch (error) {
      console.error('Error al actualizar el avatar', error)
    }

    // Cierra el modal después de enviar el formulario
    onOpenChange(false)
  }, [user, token, newAvatarUrl, onOpenChange])

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Change Avatar</ModalHeader>
        <ModalBody>
          <Input
            value={newAvatarUrl}
            onChange={handleAvatarChange}
            placeholder="Enter new avatar URL"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={() => { onOpenChange(false) }}>
            Close
          </Button>

          <Button color="primary" onPress={() => { void handleAvatarSubmit() }}>
                Update Avatar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
