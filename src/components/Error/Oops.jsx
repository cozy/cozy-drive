import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Empty, Button } from 'cozy-ui/transpiled/react'
import EmptyIcon from '../../drive/assets/icons/icon-folder-broken.svg'
import styles from './oops.styl'

const reload = () => {
  window.location.reload()
}

const Oops = ({ t }) => (
  <Empty
    title={t('error.open_folder')}
    icon={EmptyIcon}
    className={styles['oops']}
  >
    <Button onClick={reload} label={t('error.button.reload')} />
  </Empty>
)

export default translate()(Oops)
