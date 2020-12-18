import {
  CarbonCopy as CarbonCopyCell,
  ElectronicSafe as ElectronicSafeCell
} from 'drive/web/modules/filelist/cells'
import {
  CarbonCopy as CarbonCopyHeader,
  ElectronicSafe as ElectronicSafeHeader
} from 'drive/web/modules/filelist/headers'

export const extraColumnsSpecs = {
  carbonCopy: {
    query: ({ queryBuilder, currentFolderId, sharedDocumentIds, attribute }) =>
      queryBuilder({ currentFolderId, sharedDocumentIds, attribute }),
    condition: ({ conditionBuilder, files, attribute }) =>
      conditionBuilder({ files, attribute }),
    label: 'carbonCopy',
    HeaderComponent: CarbonCopyHeader,
    CellComponent: CarbonCopyCell
  },
  electronicSafe: {
    query: ({ queryBuilder, currentFolderId, sharedDocumentIds, attribute }) =>
      queryBuilder({ currentFolderId, sharedDocumentIds, attribute }),
    condition: ({ conditionBuilder, files, attribute }) =>
      conditionBuilder({ files, attribute }),
    label: 'electronicSafe',
    HeaderComponent: ElectronicSafeHeader,
    CellComponent: ElectronicSafeCell
  }
}
