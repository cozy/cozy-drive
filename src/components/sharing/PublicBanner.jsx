import React from 'react'
import PropTypes from 'prop-types'
import snarkdown from 'snarkdown'

import { useClient } from 'cozy-client'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Button'
import palette from 'cozy-ui/transpiled/react/palette'
import { useI18n } from 'cozy-ui/transpiled/react'

import styles from './publicBanner.styl'

const getPublicNameFromSharing = sharing =>
  sharing.attributes.members[0].public_name

const PublicBannerCozyToCozyContent = ({
  sharing,
  isSharingShortcutCreated
}) => {
  const { t } = useI18n()
  const client = useClient()
  const name = getPublicNameFromSharing(sharing)
  const text = isSharingShortcutCreated
    ? t('Share.banner.synchronise')
    : t('Share.banner.whats_cozy')
  const avatarURL = `${client.options.uri}/public/avatar?fallback=initials`
  const knowMore = (
    <a
      href="https://cozy.io"
      target="_blank"
      className={'u-link'}
      rel="noopener noreferrer"
    >
      {t('Share.banner.know_more')}
    </a>
  )
  const withAvatar = snarkdown(
    t('Share.banner.shared_from', {
      name: name,
      image: avatarURL
    })
  )
  return (
    <>
      <span
        className={styles['bannermarkdown']}
        dangerouslySetInnerHTML={{ __html: withAvatar }}
      />
      <span>
        {' '}
        {text} {knowMore}
      </span>
    </>
  )
}
PublicBannerCozyToCozyContent.propTypes = {
  isSharingShortcutCreated: PropTypes.bool.isRequired,
  sharing: PropTypes.object.isRequired
}

const openExternalLink = url => (window.location = url)

const SharingBannerCozyToCozy = ({
  sharing,
  isSharingShortcutCreated,
  discoveryLink,
  onClose
}) => {
  const { t } = useI18n()
  const action = () => openExternalLink(discoveryLink)
  const buttonOne = isSharingShortcutCreated
    ? {
        label: t('Share.banner.sync_to_mine'),
        icon: 'sync-cozy',
        action
      }
    : {
        label: t('Share.banner.add_to_mine'),
        icon: 'to-the-cloud',
        action
      }
  return (
    <Banner
      bgcolor={palette['paleGrey']}
      text={
        <PublicBannerCozyToCozyContent
          isSharingShortcutCreated={isSharingShortcutCreated}
          sharing={sharing}
        />
      }
      buttonOne={
        <Button
          theme="text"
          label={buttonOne.label}
          icon={buttonOne.icon}
          onClick={buttonOne.action}
        />
      }
      buttonTwo={
        <Button
          theme="text"
          label={t('Share.banner.close')}
          onClick={onClose}
        />
      }
      inline
    />
  )
}

const SharingBannerByLinkText = () => {
  const { t } = useI18n()
  const text = t('Share.banner.whats_cozy')
  const knowMore = (
    <a
      href="https://cozy.io"
      target="_blank"
      className={'u-link'}
      rel="noopener noreferrer"
    >
      {t('Share.banner.know_more')}
    </a>
  )
  return (
    <span className={'u-charcoalGrey'}>
      {text} {knowMore}
    </span>
  )
}
const SharingBannerByLink = ({ onClose }) => {
  const { t } = useI18n()
  return (
    <Banner
      bgcolor={palette['paleGrey']}
      text={<SharingBannerByLinkText />}
      buttonOne={
        <Button
          theme="text"
          label={t('Share.banner.close')}
          onClick={onClose}
        />
      }
      inline
    />
  )
}
SharingBannerCozyToCozy.propTypes = {
  sharing: PropTypes.object.isRequired,
  isSharingShortcutCreated: PropTypes.bool.isRequired,
  discoveryLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}
export { SharingBannerCozyToCozy, SharingBannerByLink }
