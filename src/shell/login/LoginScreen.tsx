import { cn } from "@/lib/cn";
import { useThemeStore } from "@/stores/use-theme-store";
import { useWallpaper } from "@/hooks/use-wallpaper";
import { useLogin } from "@/hooks/use-login";
import { VERSION_TEXT } from "@/constants/app";
import LoginClock from "./LoginClock";
import LoginAvatar from "./LoginAvatar";
import LoginPasswordField from "./LoginPasswordField";
import LoginProgress from "./LoginProgress";
import LoginSwitchUser from "./LoginSwitchUser";
import "./login-screen.css";

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
    loginMode,
    switchToOtherUser,
    switchToKnownUser,
    handleUsernameSubmit,
    goToSetup,
  } = useLogin();

  const wallpaper = useThemeStore((s) => s.theme.wallpaper);
  const { backgroundStyle } = useWallpaper(wallpaper);

  if (!isVisible) return null;
  if (!user && loginMode === "known-user") return null;

  return (
    <div className={cn("login-screen", isFadingOut && "login-screen--fading")}>
      {/* Background: Blurred wallpaper */}
      <div className="login-bg">
        <div className="login-bg__image" style={backgroundStyle} />
        <div className="login-bg__overlay" />
      </div>

      {/* Clock and date */}
      <LoginClock />

      {/* Center content */}
      <div className="login-content">
        {isDesktopLoading ? (
          <>
            {user && <LoginAvatar user={user} isSuccess={isFadingOut} />}
            {user && <div className="login-username">{user.displayName}</div>}
            <LoginProgress progress={loadingProgress} status={loadingStatus} />
          </>
        ) : loginMode === "switch-user" ? (
          <LoginSwitchUser
            onSubmit={handleUsernameSubmit}
            onBack={switchToKnownUser}
            onCreateNew={goToSetup}
            error={error}
            isLoading={isLoading}
            showBackButton={!!user}
          />
        ) : (
          <>
            <LoginAvatar user={user!} isSuccess={isFadingOut} />

            <div className="login-username">{user!.displayName}</div>

            <LoginPasswordField
              onSubmit={handleSubmit}
              error={error}
              isLoading={isLoading}
            />
            <button
              type="button"
              className="login-link login-link--switch"
              onClick={switchToOtherUser}
            >
              Switch User
            </button>
          </>
        )}
      </div>

      {/* Footer version text */}
      <div className="login-footer">{VERSION_TEXT}</div>
    </div>
  );
};

export default LoginScreen;
