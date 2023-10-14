import { useState } from 'react'
import { User, Tooltip } from '@nextui-org/react'
import useAuthStore from '../store/authStore'
import { ChangeAvatarModal } from './modals/ChangeAvatarModal'

export default function DisplayUser () {
  const user = useAuthStore((state) => state.user)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  if (user === null) return null

  const avatarUrl = user.avatar ?? 'https://i.pravatar.cc/150?u=a04258114e29026702d'

  return (
    <>
    <Tooltip
          content="Change avatar"
          placement='bottom'
          color='secondary'
          >
      <User
        name={user.username}
        avatarProps={{
          src: avatarUrl,
          onClick: () => { setIsAvatarModalOpen(true) } // Abrir el modal al hacer clic en el avatar
        }}
      />
      </Tooltip>
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        // Pasar más props si es necesario
      />
    </>
  )
}
