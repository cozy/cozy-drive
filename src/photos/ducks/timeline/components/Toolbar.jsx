import styles from '../../../styles/toolbar'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Menu, MenuItem, withBreakpoints, Icon } from 'cozy-ui/react'
const { BarRight } = cozy.bar

import UploadButton from '../../../components/UploadButton'
import { MoreButton } from 'components/Button'

import CheckboxIcon from 'photos/assets/icons/icon-checkbox.svg'

const MoreMenu = ({ t, disabled, uploadPhotos, selectItems }) => (
  <Menu
    disabled={disabled}
    position="right"
    className={styles['pho-toolbar-menu']}
    component={<MoreButton>{t('Toolbar.more')}</MoreButton>}
  >
    <MenuItem icon={<Icon icon="upload" />} className={styles['u-hide--desk']}>
      <UploadButton
        onUpload={uploadPhotos}
        disabled={disabled}
        label={t('Toolbar.menu.photo_upload')}
        inMenu
        className={classNames(
          styles['u-hide--tablet'],
          styles['pho-action-upload']
        )}
      />
    </MenuItem>
    <hr className={styles['u-hide--desk']} />
    <MenuItem onSelect={selectItems} icon={<Icon icon={CheckboxIcon} />}>
      {t('Toolbar.menu.select_items')}
    </MenuItem>
  </Menu>
)

MoreMenu.propTypes = {
  disabled: PropTypes.bool,
  uploadPhotos: PropTypes.func.isRequired,
  selectItems: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

const Toolbar = (
  { disabled = false, uploadPhotos, selectItems, breakpoints: { isMobile } },
  { t }
) => (
  <div className={styles['pho-toolbar']} role="toolbar">
    <UploadButton
      className={styles['u-hide--mob']}
      onUpload={uploadPhotos}
      disabled={disabled}
      label={t('Toolbar.photo_upload')}
    />
    {isMobile ? (
      <BarRight>
        <MoreMenu
          t={t}
          disabled={disabled}
          uploadPhotos={uploadPhotos}
          selectItems={selectItems}
        />
      </BarRight>
    ) : (
      <MoreMenu
        t={t}
        disabled={disabled}
        uploadPhotos={uploadPhotos}
        selectItems={selectItems}
      />
    )}
  </div>
)

Toolbar.propTypes = {
  disabled: PropTypes.bool,
  uploadPhotos: PropTypes.func.isRequired,
  selectItems: PropTypes.func.isRequired
}

export default withBreakpoints()(Toolbar)
