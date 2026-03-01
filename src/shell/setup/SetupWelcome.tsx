interface SetupWelcomeProps {
  onContinue: () => void
}

const SetupWelcome = ({ onContinue }: SetupWelcomeProps) => {
  return (
    <div className="setup-welcome">
      <div className="setup-welcome__brand">
        <h1 className="setup-welcome__title">Welcome</h1>
        <p className="setup-welcome__subtitle">
          Aisu — your personal AI Web OS.
          <br />
          Let's get started with the setup.
        </p>
      </div>

      <button
        type="button"
        className="setup-btn setup-btn--primary"
        onClick={onContinue}
      >
        Get Started
      </button>
    </div>
  )
}

export default SetupWelcome
