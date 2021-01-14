import { hasCertifications } from 'drive/web/modules/viewer/helpers'
import Certifications from './Certifications'

// TODO add connector block
export const panelBlocksSpecs = {
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
