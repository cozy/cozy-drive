import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'
import SafeIcon from 'cozy-ui/transpiled/react/Icons/Safe'

const Certification = ({ icon, title, caption }) => {
  return (
    <div className="u-mb-1-half">
      <Media className="u-mb-half" align="top">
        <Img className="u-mr-half">
          <Icon icon={icon} />
        </Img>
        <Bd>
          <Typography variant="body1">{title}</Typography>
        </Bd>
      </Media>
      <Typography variant="caption">{caption}</Typography>
    </div>
  )
}

Certification.propTypes = {
  icon: iconPropType.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
}

const Certifications = ({ file }) => {
  const { t } = useI18n()

  const hasCarbonCopy = has(file, 'metadata.carbonCopy')
  const hasElectronicSafe = has(file, 'metadata.electronicSafe')

  return (
    <>
      {hasCarbonCopy && (
        <Certification
          icon={CarbonCopyIcon}
          title={t('table.tooltip.carbonCopy.title')}
          caption={t('table.tooltip.carbonCopy.caption')}
        />
      )}
      {hasElectronicSafe && (
        <Certification
          icon={SafeIcon}
          title={t('table.tooltip.electronicSafe.title')}
          caption={t('table.tooltip.electronicSafe.caption')}
        />
      )}
    </>
  )
}

Certifications.propTypes = {
  file: PropTypes.object.isRequired
}

export default Certifications
