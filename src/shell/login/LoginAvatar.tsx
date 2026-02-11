import { cn } from '@/lib/cn'
import type { UserProfile } from '@/types'

interface LoginAvatarProps {
  user: UserProfile
  isSuccess: boolean
}

const LoginAvatar = ({ user, isSuccess }: LoginAvatarProps) => {
  const isImageUrl = user.avatar?.startsWith('/') || user.avatar?.startsWith('http')

  return (
    <div className={cn('login-avatar', isSuccess && 'login-avatar--success')}>
      {user.avatar && isImageUrl ? (
        <img
          src={user.avatar}
          alt={user.displayName}
          className="login-avatar__image"
        />
      ) : user.avatar ? (
        <div className="login-avatar__placeholder">
          {user.avatar}
        </div>
      ) : (
        <div className="login-avatar__placeholder">
          {user.displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default LoginAvatar
