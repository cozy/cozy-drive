import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { divider } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'

import UploadButton from '../../../components/UploadButton'
import styles from '../../../styles/toolbar.styl'
import MoreMenu from '../../../components/MoreMenu'
import {
  upload,
  selectItems as selectItemsAction
} from '../../../components/actions'

const Toolbar = ({ disabled = false, uploadPhotos, selectItems }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const actions = isMobile
    ? [upload(uploadPhotos, disabled), divider, selectItemsAction(selectItems)]
    : [selectItemsAction(selectItems)]

  return (
    <div className={styles['pho-toolbar']} role="toolbar">
      {!isMobile && (
        <UploadButton
          onUpload={uploadPhotos}
          disabled={disabled}
          label={t('Toolbar.photo_upload')}
        />
      )}
      <MoreMenu actions={actions} />
    </div>
  )
}

Toolbar.propTypes = {
  disabled: PropTypes.bool,
  uploadPhotos: PropTypes.func.isRequired,
  selectItems: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default Toolbar
