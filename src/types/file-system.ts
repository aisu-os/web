export type FileType = 'file' | 'directory'

export interface FileNode {
  name: string
  path: string
  type: FileType
  size?: number
  mimeType?: string
  children?: FileNode[]
  createdAt?: Date
  updatedAt?: Date
}
