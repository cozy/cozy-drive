import { SelectionContextType, SelectionProviderProps } from './types'

declare const SelectionProvider: React.FC<SelectionProviderProps>
declare const useSelectionContext: () => SelectionContextType

export { SelectionProvider, useSelectionContext }
export type { SelectionContextType, SelectionProviderProps }
