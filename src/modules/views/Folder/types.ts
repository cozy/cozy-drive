import { IOCozyFile } from 'cozy-client/types/types'

export interface SortOrder {
  attribute: string
  order: string
}

export type IOCozyFileWithMetadata = IOCozyFile & {
  cozyMetadata?: {
    createdByApp: string
    sourceAccount: string
  }
  metadata: {
    instanceName: string
  }
}
export interface UseSharedDrivesQuery {
  data?: IOCozyFileWithMetadata[]
}
