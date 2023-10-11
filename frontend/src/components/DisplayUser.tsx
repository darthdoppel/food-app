import useAuthStore from '../store/authStore'
import { User } from '@nextui-org/react'

export default function DisplayUser () {
  // Asume que getUser es un selector que obtiene el usuario logeado desde tu store
  const user = useAuthStore((state) => state.user)

  if (user === null) return null

  const avatarUrl = user.avatar ?? 'https://i.pravatar.cc/150?u=a04258114e29026702d'

  return (
      <User
        name={user.username}
        avatarProps={{
          src: avatarUrl
        }}
      />
  )
}
