import PropTypes from 'prop-types'
import React from 'react'

import { useSharingInfos } from 'cozy-sharing'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import CozyHomeLinkIcon from '@/components/Button/CozyHomeLinkIcon'

const CozyHomeLink = ({ className }) => {
  const { t } = useI18n()
  const { createCozyLink } = useSharingInfos
  return (
    <ButtonLink
      label={t('Share.create-cozy')}
      icon={CozyHomeLinkIcon}
      className={className}
      href={createCozyLink}
      size="normal"
    />
  )
}

CozyHomeLink.propTypes = {
  from: PropTypes.string
}

CozyHomeLink.defaultProps = {
  from: ''
}

export default CozyHomeLink
