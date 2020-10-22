import React from 'react'
import PropTypes from 'prop-types'

import Banner from 'cozy-ui/transpiled/react/Banner'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import Avatar from 'cozy-ui/transpiled/react/Avatar'
import palette from 'cozy-ui/transpiled/react/palette'
import { useI18n } from 'cozy-ui/transpiled/react'

const Content = ({ avatar, name, isNewSharing }) => {
  const { t } = useI18n()

  const text = isNewSharing
    ? t('Share.banner.whats_cozy')
    : t('Share.banner.synchronise')
  const knowMore = isNewSharing ? (
    <ButtonLink
      subtle
      href="https://cozy.io"
      target="_blank"
      size="small"
      label={t('Share.banner.know_more')}
    />
  ) : (
    ''
  )

  return (
    <>
      <span className="u-fw-bold">
        {t('Share.banner.shared_from')}{' '}
        <Avatar
          image={avatar}
          size="xsmall"
          style={{ verticalAlign: 'text-bottom' }}
        />{' '}
        {name}.
      </span>
      <span>
        {' '}
        {text} {knowMore}
      </span>
    </>
  )
}

Content.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isNewSharing: PropTypes.bool
}

const SharingBanner = ({ avatar, name, isNewSharing }) => {
  const { t } = useI18n()

  const synchronise = () => {
    alert('sync')
  }

  const add = () => {
    alert('add')
  }

  const buttonOne = isNewSharing
    ? {
        label: t('Share.banner.add_to_mine'),
        icon: 'to-the-cloud',
        action: add
      }
    : {
        label: t('Share.banner.sync_to_mine'),
        icon: 'sync-cozy',
        action: synchronise
      }

  return (
    <Banner
      bgcolor={palette['paleGrey']}
      text={<Content avatar={avatar} name={name} isNewSharing={isNewSharing} />}
      buttonOne={
        <Button
          theme="text"
          label={buttonOne.label}
          icon={buttonOne.icon}
          onClick={buttonOne.action}
        />
      }
      buttonTwo={
        <Button theme="text" label="Close" onClick={() => alert('Close')} />
      }
      inline
    />
  )
}

SharingBanner.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isNewSharing: PropTypes.bool
}

export default SharingBanner
