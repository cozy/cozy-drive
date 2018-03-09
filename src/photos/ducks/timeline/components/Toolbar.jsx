import styles from '../../../styles/toolbar'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import UploadButton from '../../../components/UploadButton'
import Menu, { Item } from 'components/Menu'
import { MoreButton } from 'components/Button'

const Toolbar = ({ t, disabled = false, uploadPhotos, selectItems }) => (
  <div className={styles['pho-toolbar']} role="toolbar">
    <UploadButton
      className={styles['u-hide--mob']}
      onUpload={uploadPhotos}
      disabled={disabled}
      label={t('Toolbar.photo_upload')}
    />
    <Menu
      disabled={disabled}
      className={styles['pho-toolbar-menu']}
      button={<MoreButton>{t('Toolbar.more')}</MoreButton>}
    >
      <Item>
        <UploadButton
          onUpload={uploadPhotos}
          disabled={disabled}
          label={t('Toolbar.menu.photo_upload')}
          type="menu-item"
          className={classNames(
            styles['u-hide--tablet'],
            styles['pho-action-upload']
          )}
        />
      </Item>
      <hr className={styles['u-hide--desk']} />
      <Item>
        <a className={styles['pho-action-select']} onClick={selectItems}>
          {t('Toolbar.menu.select_items')}
        </a>
      </Item>
    </Menu>
  </div>
)

Toolbar.propTypes = {
  disabled: PropTypes.bool,
  uploadPhotos: PropTypes.func.isRequired,
  selectItems: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(Toolbar)
