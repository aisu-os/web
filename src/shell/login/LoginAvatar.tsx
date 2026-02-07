import { cn } from '@/lib/cn'
import type { UserProfile } from '@/types'

interface LoginAvatarProps {
  user: UserProfile
  isSuccess: boolean
}

const LoginAvatar = ({ user, isSuccess }: LoginAvatarProps) => {
  return (
    <div className={cn('login-avatar', isSuccess && 'login-avatar--success')}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.displayName}
          className="login-avatar__image"
        />
      ) : (
        <div className="login-avatar__placeholder">
          {user.displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default LoginAvatar
