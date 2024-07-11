declare module 'cozy-ui/*'

declare module 'cozy-ui/transpiled/react/styles' {
  export function makeStyles<T>(styles: T): () => T
}

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
  export interface showAlertProps {
    message: string
    severity?:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'error'
      | 'warning'
      | 'info'
    action?: React.ReactNode
  }

  export type showAlertFunction = (props: showAlertProps) => void

  export const useAlert: () => {
    showAlert: showAlertFunction
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

declare module 'cozy-client/dist/models/file' {
  export const splitFilename: (file: IOCozyFile) => {
    filename: string
    extension: string
  }
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module 'cozy-ui/transpiled/react/ActionsMenu/Actions' {
  export interface Action {
    name: string
    label: string
    icon: React.ComponentType
    displayInSelectionBar: boolean
    displayCondition?: (
      docs: import('components/FolderPicker/types').IOCozyFileWithExtra[]
    ) => boolean
    action?: (
      docs: import('components/FolderPicker/types').IOCozyFileWithExtra[],
      opts: { handleAction: HandleActionCallback }
    ) => Promise<void>
    Component: ForwardRefExoticComponent<RefAttributes<React.ComponentType>>
  }

  export function divider(): Action

  export function makeActions(
    arg1: ((T) => Action)[],
    T
  ): Record<string, () => Action>
}
