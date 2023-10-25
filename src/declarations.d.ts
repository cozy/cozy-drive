declare module 'cozy-ui/*'

declare module 'cozy-ui/transpiled/react' {
  export const Alerter: {
    error: (message: string) => void
  }

  export const logger: {
    info: (message: string, ...rest: unknown[]) => void
  }
}

declare module 'cozy-ui/transpiled/react/providers/I18n' {
  export const useI18n: () => {
    t: (key: string, options?: Record<string, unknown>) => string
  }
}

declare module 'cozy-ui/transpiled/react/deprecated/Alerter' {
  const Alerter: {
    error: (message: string, options?: Record<string, unknown>) => void
    success: (message: string, options?: Record<string, unknown>) => void
  }

  export default Alerter
}
