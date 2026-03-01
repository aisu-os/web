import { cn } from "@/lib/cn";
import { useSetup } from "@/hooks/use-setup";
import { AnimatePresence, motion } from "framer-motion";
import BootLogo from "@/shell/boot/BootLogo";
import { VERSION_TEXT } from "@/constants/app";
import SetupWelcome from "./SetupWelcome";
import SetupAccount from "./SetupAccount";
import SetupPassword from "./SetupPassword";
import SetupAvatar from "./SetupAvatar";
import SetupComplete from "./SetupComplete";
import "./setup-screen.css";

const stepVariants = {
  enter: { opacity: 0, x: 60, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -60, scale: 0.98 },
};

const SetupScreen = () => {
  const setup = useSetup();

  if (!setup.isVisible) return null;

  const renderStep = () => {
    switch (setup.currentStep) {
      case "welcome":
        return <SetupWelcome onContinue={setup.goNext} />;
      case "account":
        return (
          <SetupAccount
            data={setup.accountData}
            errors={setup.accountErrors}
            onChange={setup.updateAccountData}
            onNext={setup.goNext}
          />
        );
      case "password":
        return (
          <SetupPassword
            data={setup.passwordData}
            errors={setup.passwordErrors}
            onChange={setup.updatePasswordData}
            onNext={setup.goNext}
          />
        );
      case "avatar":
        return (
          <SetupAvatar
            selected={setup.selectedAvatar}
            uploadedAvatar={setup.uploadedAvatar}
            onSelect={setup.selectAvatar}
            onUpload={setup.uploadAvatar}
            onNext={setup.goNext}
          />
        );
      case "complete":
        return (
          <SetupComplete
            userName={setup.createdUserName}
            isSubmitting={setup.isSubmitting}
            error={setup.submitError}
            onComplete={setup.completeSetup}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "setup-screen",
        setup.isFadingOut && "setup-screen--fading",
      )}
    >
      {/* Background aurora */}
      <div className="setup-bg">
        <div className="setup-bg__aurora">
          <div className="setup-bg__blob" />
          <div className="setup-bg__blob" />
          <div className="setup-bg__blob" />
        </div>
        <div className="setup-bg__gradient" />
      </div>

      {/* Header: Logo + step dots */}
      <div className="setup-header">
        <div className="setup-header__logo">
          <BootLogo />
        </div>

        {setup.currentStep !== "welcome" &&
          setup.currentStep !== "complete" && (
            <div className="setup-dots">
              {["account", "password", "avatar"].map((step, i) => (
                <div
                  key={step}
                  className={cn(
                    "setup-dots__dot",
                    setup.currentStepIndex > i + 1 && "setup-dots__dot--done",
                    setup.currentStepIndex === i + 1 &&
                      "setup-dots__dot--active",
                  )}
                />
              ))}
            </div>
          )}
      </div>

      {/* Step content */}
      <div className="setup-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={setup.currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="setup-step"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back button */}
      {setup.canGoBack && (
        <button
          type="button"
          className="setup-nav__back"
          onClick={setup.goBack}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 4, verticalAlign: "middle" }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}

      {/* Footer */}
      <div className="setup-footer">{VERSION_TEXT}</div>
    </div>
  );
};

export default SetupScreen;
