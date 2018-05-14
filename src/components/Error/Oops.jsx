import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Empty, Button } from 'cozy-ui/react'
import EmptyIcon from '!!svg-sprite-loader!../../drive/assets/icons/icon-folder-broken.svg'

const reload = () => {
  window.location.reload()
}

const Oops = ({ t }) => (
  <Empty title={t('error.open_folder')} icon={EmptyIcon}>
    <Button onClick={reload} label={t('error.button.reload')} />
  </Empty>
)

export default translate()(Oops)
