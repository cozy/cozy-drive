import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'

import getPanelBlocks, { panelBlocksSpecs } from './getPanelBlocks'

const PanelContent = ({ file }) => {
  const { t } = useI18n()
  const panelBlocks = getPanelBlocks({ panelBlocksSpecs, file })

  return (
    <Stack spacing="s" className={cx('u-flex u-flex-column u-h-100')}>
      <Paper
        className={'u-ph-2 u-flex u-flex-items-center u-h-3'}
        elevation={2}
        square
      >
        <Typography variant="h4">{t('Viewer.panel.title')}</Typography>
      </Paper>
      {panelBlocks.map((PanelBlock, index) => (
        <Paper
          key={index}
          className={cx('u-ph-2 u-pv-1-half', {
            'u-flex-grow-1': index === panelBlocks.length - 1
          })}
          elevation={2}
          square
        >
          <Typography variant="h4">
            <PanelBlock file={file} />
          </Typography>
        </Paper>
      ))}
    </Stack>
  )
}

PanelContent.propTypes = {
  file: PropTypes.object.isRequired
}

export default PanelContent
