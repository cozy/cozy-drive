import KonnectorBlock from 'cozy-harvest-lib/dist/components/KonnectorBlock'

import {
  hasCertifications,
  isFromKonnector
} from 'drive/web/modules/viewer/helpers'
import Certifications from './Certifications'

export const panelBlocksSpecs = {
  konnector: {
    condition: isFromKonnector,
    component: KonnectorBlock
  },
  certifications: {
    condition: hasCertifications,
    component: Certifications
  }
}

const getPanelBlocks = ({ panelBlocksSpecs, file }) => {
  const panelBlocks = []

  Object.values(panelBlocksSpecs).forEach(panelBlock => {
    panelBlock.condition({ file }) && panelBlocks.push(panelBlock.component)
  })

  return panelBlocks
}

export default getPanelBlocks
