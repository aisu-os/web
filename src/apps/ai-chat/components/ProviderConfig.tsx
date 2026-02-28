import { useState, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { useAiChatStore } from '../hooks/use-ai-chat-store'
import { PROVIDER_PRESETS } from '../ai-chat.constants'
import type { AiProviderConfig } from '@/types'

const inputClasses =
  'w-full bg-white/[0.06] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-white/80 placeholder:text-white/30 focus:border-white/10 focus:bg-white/[0.08] outline-none transition-colors'

const FieldGroup = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
      {label}
    </label>
    {children}
  </div>
)

const ProviderConfig = () => {
  const selectedPresetName = useAiChatStore((s) => s.selectedPresetName)
  const providerConfig = useAiChatStore((s) => s.providerConfig)
  const activeConversationId = useAiChatStore((s) => s.activeConversationId)
  const selectPreset = useAiChatStore((s) => s.selectPreset)
  const setProviderConfig = useAiChatStore((s) => s.setProviderConfig)
  const setCurrentView = useAiChatStore((s) => s.setCurrentView)

  const selectedPreset = PROVIDER_PRESETS.find(
    (p) => p.name === selectedPresetName,
  )

  const [apiKey, setApiKey] = useState(providerConfig?.apiKey ?? '')
  const [model, setModel] = useState(
    providerConfig?.model ?? selectedPreset?.models[0] ?? '',
  )
  const [baseUrl, setBaseUrl] = useState(
    providerConfig?.baseUrl ?? selectedPreset?.defaultBaseUrl ?? '',
  )
  const [customModel, setCustomModel] = useState('')
  const [useCustomModel, setUseCustomModel] = useState(false)

  const handlePresetSelect = useCallback(
    (name: string) => {
      selectPreset(name)
      const preset = PROVIDER_PRESETS.find((p) => p.name === name)
      if (preset) {
        setModel(preset.models[0] ?? '')
        setBaseUrl(preset.defaultBaseUrl ?? '')
        setUseCustomModel(false)
        setCustomModel('')
      }
    },
    [selectPreset],
  )

  const handleSave = useCallback(() => {
    if (!selectedPresetName) return

    const config: AiProviderConfig = {
      name: selectedPresetName,
      apiKey,
      model: useCustomModel ? customModel : model,
      ...(baseUrl ? { baseUrl } : {}),
    }

    setProviderConfig(config)
  }, [
    selectedPresetName,
    apiKey,
    model,
    baseUrl,
    customModel,
    useCustomModel,
    setProviderConfig,
  ])

  const handleBack = useCallback(() => {
    setCurrentView(activeConversationId ? 'chat' : 'welcome')
  }, [activeConversationId, setCurrentView])

  const canSave =
    selectedPresetName &&
    (selectedPreset?.requiresApiKey ? apiKey.trim().length > 0 : true) &&
    (useCustomModel ? customModel.trim().length > 0 : model.length > 0)

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBack}
          className="text-[13px] text-sky-400 hover:text-sky-300 transition-colors"
        >
          &larr; Back
        </button>
        <div className="flex-1" />
        <h2 className="text-[16px] font-semibold text-white">
          Provider Settings
        </h2>
        <div className="flex-1" />
        <div className="w-[52px]" />
      </div>

      {/* Current Config Badge */}
      {providerConfig && (
        <div className="mb-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[12px] text-green-400">
            Connected: {providerConfig.name} / {providerConfig.model}
          </span>
        </div>
      )}

      {/* Provider Selection Grid */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-white/30 mb-3 block">
          Select Provider
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDER_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset.name)}
              className={cn(
                'flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border transition-colors',
                selectedPresetName === preset.name
                  ? 'border-[#2463EB] bg-[#2463EB]/10'
                  : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]',
              )}
            >
              <span className="text-xl">{preset.icon}</span>
              <span className="text-[12px] text-white/70">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      {selectedPreset && (
        <div className="flex flex-col gap-4">
          {/* API Key */}
          {selectedPreset.requiresApiKey && (
            <FieldGroup label="API Key">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className={inputClasses}
              />
            </FieldGroup>
          )}

          {/* Model */}
          <FieldGroup label="Model">
            {!useCustomModel ? (
              <div className="flex gap-2">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={cn(inputClasses, 'appearance-none flex-1')}
                >
                  {selectedPreset.models.map((m) => (
                    <option key={m} value={m} className="bg-[#1E1E2E]">
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setUseCustomModel(true)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 shrink-0 px-2 transition-colors"
                >
                  Custom
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Enter model name..."
                  className={cn(inputClasses, 'flex-1')}
                />
                <button
                  onClick={() => {
                    setUseCustomModel(false)
                    setCustomModel('')
                  }}
                  className="text-[11px] text-sky-400 hover:text-sky-300 shrink-0 px-2 transition-colors"
                >
                  List
                </button>
              </div>
            )}
          </FieldGroup>

          {/* Base URL */}
          <FieldGroup label="Base URL (optional)">
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={
                selectedPreset.defaultBaseUrl ?? 'https://api.provider.com/v1'
              }
              className={inputClasses}
            />
          </FieldGroup>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              'text-white text-[13px] font-medium rounded-lg px-5 py-2 mt-2 w-fit transition-colors',
              canSave
                ? 'bg-[#2463EB] hover:bg-[#3b75f0] cursor-pointer'
                : 'bg-white/[0.06] cursor-not-allowed opacity-40',
            )}
          >
            Save Configuration
          </button>
        </div>
      )}
    </div>
  )
}

export default ProviderConfig
