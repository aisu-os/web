import { useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { PRESET_AVATARS } from './setup.constants'

interface SetupAvatarProps {
  selected: string | null
  uploadedAvatar: string | null
  onSelect: (gradient: string | null) => void
  onUpload: (dataUrl: string, file: File | null) => void
  onNext: () => void
}

const SetupAvatar = ({ selected, uploadedAvatar, onSelect, onUpload, onNext }: SetupAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpload(reader.result, file)
        }
      }
      reader.readAsDataURL(file)

      // Reset input
      e.target.value = ''
    },
    [onUpload]
  )

  const hasSelection = !!selected || !!uploadedAvatar

  return (
    <div className="setup-form">
      <h2 className="setup-step__title">Choose Your Avatar</h2>
      <p className="setup-step__subtitle">Pick an image for your profile</p>

      {/* Upload area */}
      {uploadedAvatar ? (
        <div className="setup-upload">
          <div className="setup-upload__preview">
            <img
              src={uploadedAvatar}
              alt="Uploaded avatar"
              className="setup-upload__preview-img"
            />
            <div className="setup-upload__preview-info">
              <span className="setup-upload__preview-label">Uploaded image</span>
              <button
                type="button"
                className="setup-upload__preview-remove"
                onClick={() => onUpload('', null)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="setup-upload">
          <div
            className="setup-upload__area"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="setup-upload__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <span className="setup-upload__text">Upload image</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Divider */}
      {!uploadedAvatar && (
        <div className="setup-upload__divider">
          <span className="setup-upload__divider-text">or choose</span>
        </div>
      )}

      {/* Preset avatars grid */}
      {!uploadedAvatar && (
        <div className="setup-avatars">
          {PRESET_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              className={cn(
                'setup-avatars__item',
                selected === avatar.gradient && 'setup-avatars__item--selected'
              )}
              onClick={() =>
                onSelect(avatar.gradient === selected ? null : avatar.gradient)
              }
            >
              <div
                className="setup-avatars__preview"
                style={{ background: avatar.gradient }}
              >
                <span className="setup-avatars__emoji">{avatar.emoji}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="setup-form__actions">
        <button
          type="button"
          className="setup-btn setup-btn--secondary"
          onClick={() => {
            onSelect(null)
            onNext()
          }}
        >
          Skip
        </button>
        <button
          type="button"
          className="setup-btn setup-btn--primary"
          onClick={onNext}
          disabled={!hasSelection}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default SetupAvatar
