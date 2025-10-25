import { open } from '@tauri-apps/plugin-dialog';

type FileType = 'img' | 'doc' | 'vid' | 'aud' | 'all'

interface OpenFileOptions {
  type?: FileType
  multiple?: boolean
  defaultPath?: string
}

interface OpenFolderOptions {
  multiple?: boolean
  defaultPath?: string
}

const fileFilters: Record<FileType, { name: string; extensions: string[] }[]> = {
  img: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp'] }],
  doc: [{ name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'] }],
  vid: [{ name: 'Videos', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'] }],
  aud: [{ name: 'Audio', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'] }],
  all: []
}

export default function useFile() {
  const openFile = async (options: OpenFileOptions = {}): Promise<string | string[] | null> => {
    const { type = 'all', multiple = false, defaultPath } = options
    const filters = fileFilters[type]
    return await open({
      multiple,
      defaultPath,
      filters
    })
  }

  const openFolder = async (options: OpenFolderOptions = {}): Promise<string | string[] | null> => {
    const { multiple = false, defaultPath } = options
    return await open({
      directory: true,
      multiple,
      defaultPath
    })
  }

  const openFileOrFolder = async (options: OpenFileOptions & { directory?: boolean } = {}): Promise<string | string[] | null> => {
    const { type = 'all', multiple = false, defaultPath, directory = false } = options
    const filters = directory ? undefined : fileFilters[type]
    return await open({
      directory,
      multiple,
      defaultPath,
      filters
    })
  }

  return {
    openFile,
    openFolder,
    openFileOrFolder,
  }
}