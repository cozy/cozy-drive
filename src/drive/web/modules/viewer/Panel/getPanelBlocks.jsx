import KonnectorBlock from 'cozy-harvest-lib/dist/components/KonnectorBlock'

import {
  hasCertifications,
  isFromConnector
} from 'drive/web/modules/viewer/helpers'
import Certifications from './Certifications'

export const panelBlocksSpecs = {
  connector: {
    condition: isFromConnector,
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
