declare module 'cozy-ui/*'

declare module 'cozy-ui/transpiled/react/Icons/*' {
  const Icon: React.ComponentType<{
    className?: string
    color?: string
    size?: string
  }>
  export default Icon
}

declare module 'cozy-ui/transpiled/react' {
  export const Alerter: {
    error: (message: string) => void
  }

  export const logger: {
    info: (message: string, ...rest: unknown[]) => void
  }

  export const BreakpointsProvider: React.ComponentType
  export const MuiCozyTheme: React.ComponentType
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

declare module 'cozy-ui/transpiled/react/providers/Alert' {
  export const useAlert: () => {
    showAlert: ({
      message,
      severity
    }: {
      message: string
      severity?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'warning'
        | 'info'
    }) => void
  }
}

declare module 'cozy-ui/transpiled/react/providers/Breakpoints' {
  const useBreakpoints: () => {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }

  export default useBreakpoints
}

declare module 'models/index' {
  export const CozyFile: {
    splitFilename: (file: IOCozyFile) => { filename: string; extension: string }
  }
}
