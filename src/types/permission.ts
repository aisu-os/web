export type PermissionLevel = 'normal' | 'dangerous' | 'system'

export type PermissionKey =
  | 'storage.self'
  | 'ui.render'
  | 'theme.read'
  | 'locale.read'
  | 'app.info'
  | 'fs.read'
  | 'fs.write'
  | 'fs.delete'
  | 'ai.ask'
  | 'ai.tools'
  | 'terminal.run'
  | 'network'
  | 'notify'
  | 'clipboard.read'
  | 'clipboard.write'
  | 'camera'
  | 'microphone'
  | 'audio.play'
  | 'window.manage'
  | 'app.manage'
  | 'settings.write'
  | 'system.info'
  | 'memory.system'
  | 'user.manage'
  | (string & {})

export interface PermissionGrant {
  key: PermissionKey
  granted: boolean
  grantedAt?: Date
  revokedAt?: Date
}

export interface PermissionRequest {
  key: PermissionKey
  reason: string
}
