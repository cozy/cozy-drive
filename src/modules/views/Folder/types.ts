import { IOCozyFile } from 'cozy-client/types/types'

export interface SortOrder {
  attribute: string
  order: string
}

export interface UseSharedDrivesQuery {
  data?: IOCozyFile[]
}
