import { IOCozyFile } from 'cozy-client/types/types'

export type IOCozyFileWithMetadata = IOCozyFile & {
  cozyMetadata?: {
    createdByApp: string
    sourceAccount: string
  }
  metadata: {
    instanceName: string
  }
}
