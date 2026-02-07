interface LoginProgressProps {
  progress: number
  status: string
}

const LoginProgress = ({ progress, status }: LoginProgressProps) => {
  return (
    <div className="login-progress">
      <div className="login-progress__bar">
        <div
          className="login-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="login-progress__status">{status}</div>
    </div>
  )
}

export default LoginProgress
