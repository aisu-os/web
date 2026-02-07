interface SetupWelcomeProps {
  onContinue: () => void
}

const SetupWelcome = ({ onContinue }: SetupWelcomeProps) => {
  return (
    <div className="setup-welcome">
      <div className="setup-welcome__brand">
        <h1 className="setup-welcome__title">Xush kelibsiz</h1>
        <p className="setup-welcome__subtitle">
          Aisu — sizning shaxsiy AI Web OS'ingiz.
          <br />
          Keling, tizimni sozlashni boshlaymiz.
        </p>
      </div>

      <button
        type="button"
        className="setup-btn setup-btn--primary"
        onClick={onContinue}
      >
        Boshlash
      </button>
    </div>
  )
}

export default SetupWelcome
