import { cn } from '@/lib/cn'
import { useThemeStore } from '@/stores/use-theme-store'
import { useWallpaper } from '@/hooks/use-wallpaper'
import { useLogin } from '@/hooks/use-login'
import { VERSION_TEXT } from '@/shell/boot/boot.constants'
import LoginClock from './LoginClock'
import LoginAvatar from './LoginAvatar'
import LoginPasswordField from './LoginPasswordField'
import LoginProgress from './LoginProgress'
import './login-screen.css'

const LoginScreen = () => {
  const {
    isVisible,
    isFadingOut,
    user,
    error,
    isLoading,
    isDesktopLoading,
    loadingProgress,
    loadingStatus,
    handleSubmit,
  } = useLogin()

  const wallpaper = useThemeStore((s) => s.theme.wallpaper)
  const { backgroundStyle } = useWallpaper(wallpaper)

  if (!isVisible || !user) return null

  return (
    <div className={cn('login-screen', isFadingOut && 'login-screen--fading')}>
      {/* Background: Blurred wallpaper */}
      <div className="login-bg">
        <div className="login-bg__image" style={backgroundStyle} />
        <div className="login-bg__overlay" />
      </div>

      {/* Soat va sana */}
      <LoginClock />

      {/* Markaziy kontent */}
      <div className="login-content">
        <LoginAvatar user={user} isSuccess={isFadingOut} />

        <div className="login-username">{user.displayName}</div>

        {isDesktopLoading ? (
          <LoginProgress progress={loadingProgress} status={loadingStatus} />
        ) : (
          <LoginPasswordField
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Pastdagi versiya matni */}
      <div className="login-footer">{VERSION_TEXT}</div>
    </div>
  )
}

export default LoginScreen
