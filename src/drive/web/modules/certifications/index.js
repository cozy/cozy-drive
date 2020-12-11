import {
  CarbonCopy as CarbonCopyCell,
  ElectronicSafe as ElectronicSafeCell
} from 'drive/web/modules/filelist/cells'
import {
  CarbonCopy as CarbonCopyHeader,
  ElectronicSafe as ElectronicSafeHeader
} from 'drive/web/modules/filelist/headers'

export const makeCarbonCopy = condition => {
  return {
    condition,
    label: 'carbonCopy',
    HeaderComponent: CarbonCopyHeader,
    CellComponent: CarbonCopyCell
  }
}

export const makeElectronicSafe = condition => {
  return {
    condition,
    label: 'electronicSafe',
    HeaderComponent: ElectronicSafeHeader,
    CellComponent: ElectronicSafeCell
  }
}
