/* global __TARGET__ */

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

/**
 * Returns the columns names according to the media
 * @param {object} params - Params
 * @param {bool} params.isMobile - Whether the breakpoint is mobile
 * @param {array} params.mobileExtraColumnsNames - Names of the columns to be shown in mobile
 * @param {array} params.desktopExtraColumnsNames - Names of the columns to be shown in desktop
 * @returns {array} Names of the columns
 */
export const makeExtraColumnsNamesFromMedia = ({
  isMobile,
  mobileExtraColumnsNames,
  desktopExtraColumnsNames
}) =>
  isMobile || __TARGET__ === 'mobile'
    ? mobileExtraColumnsNames
    : desktopExtraColumnsNames
