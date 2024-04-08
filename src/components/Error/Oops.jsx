import PropTypes from 'prop-types'
import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EmptyIcon from 'assets/icons/icon-folder-broken.svg'

import styles from './oops.styl'

const reload = () => {
  window.location.reload()
}

const Oops = ({ title, icon }) => {
  const { t } = useI18n()

  return (
    <Empty
      title={title ? title : t('error.open_folder')}
      icon={icon ? icon : EmptyIcon}
      className={styles['oops']}
    >
      <Button onClick={reload} label={t('error.button.reload')} />
    </Empty>
  )
}

Oops.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node
}

export default Oops
