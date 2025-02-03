import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSoundLabel = (value?: string) => {
  switch (value) {
    case 'notification':
      return 'Apple'
    case 'notification2':
      return 'Sammi.sh'
    case 'sending':
      return 'Belli'
    case 'sending2':
      return 'Orange'
    default:
      return ''
  }
}

export const sliceText = (text: string, length: number) => {
  return text.length > length ? `${text.slice(0, length)}...` : text
}
