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
  export const logger: {
    info: (message: string, ...rest: unknown[]) => void
  }

  export const BreakpointsProvider: React.ComponentType
  export const MuiCozyTheme: React.ComponentType
}

declare module 'cozy-ui/transpiled/react/providers/I18n' {
  export const useI18n: () => {
    t: (key: string, options?: Record<string, unknown>) => string
    lang: string
  }
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
    label?: string
    icon: React.ComponentType | string
    displayInSelectionBar?: boolean
    displayCondition?: (
      docs: import('cozy-client/types/types').IOCozyFile[]
    ) => boolean
    action?: (
      docs: import('cozy-client/types/types').IOCozyFile[],
      opts: { handleAction: HandleActionCallback }
    ) => Promise<void> | void
    Component: ForwardRefExoticComponent<RefAttributes<React.ComponentType>>
  }

  export function divider(): Action

  export function makeActions(
    arg1: ((props?: T) => Action)[],
    T
  ): Record<string, () => Action>
}

declare module 'cozy-sharing' {
  export const useSharingContext: () => {
    allLoaded: boolean
    refresh: () => void
  }
}

declare module 'cozy-ui/transpiled/react/Nav' {
  export const NavIcon: React.ComponentType<{
    icon: string | React.ComponentType
  }>
  export const NavText: React.ComponentType
  export const NavItem: React.ComponentType
  export const NavLink: { className: string; activeClassName: string }
}
