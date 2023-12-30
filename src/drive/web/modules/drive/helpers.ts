import { makeStyles } from 'cozy-ui/transpiled/react/styles'

/* eslint-disable  */
export const useFabStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    right: ({ right = '1rem' }) => right,
    bottom: ({ bottom = '1rem' }) => bottom
  }
}))
/* eslint-enable */

interface ErrorWithMessage {
  message: string
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown): string => {
  return toErrorWithMessage(error).message
}

export const getBlobFromBase64 = (base64: string, mimeString: string): Blob => {
  const byteString = atob(base64)
  const byteNumbers = new Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  return new Blob([byteArray], { type: mimeString })
}

export const getFileFromBase64 = (
  base64: string,
  filename: string,
  mimeString: string
): File => {
  const blob = getBlobFromBase64(base64, mimeString)
  return new File([blob], filename, { type: mimeString })
}

export const getUniqueNameFromPrefix = (prefix: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(7)
  const fileName = `${prefix}_${timestamp}_${randomString}.jpg`

  return fileName
}
