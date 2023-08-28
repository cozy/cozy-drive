import React from 'react'

import { isDirectory } from 'cozy-client/dist/models/file'
import { getBoundT } from 'cozy-scanner'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'

import { CozyFile } from 'models'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'

import styles from 'drive/styles/actionmenu.styl'

export const ActionMenuWithHeader = ({
  file,
  actions,
  onClose,
  anchorElRef
}) => {
  const { lang } = useI18n()
  return (
    <ActionsMenu
      open
      ref={anchorElRef}
      onClose={onClose}
      actions={actions}
      doc={file}
      anchorOrigin={{
        strategy: 'fixed',
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <ActionsMenuMobileHeader>
        <MenuHeaderFile file={file} lang={lang} />
      </ActionsMenuMobileHeader>
    </ActionsMenu>
  )
}

const MenuHeaderFile = ({ file, lang }) => {
  const { filename, extension } = CozyFile.splitFilename(file)

  const scannerT = getBoundT(lang)
  return (
    <>
      <ListItemIcon>
        <Icon
          icon={getMimeTypeIcon(isDirectory(file), file.name, file.mime)}
          size={32}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            <span className={styles['fil-mobileactionmenu-file-name']}>
              {filename}
            </span>
            <span className={styles['fil-mobileactionmenu-file-ext']}>
              {extension}
            </span>
          </>
        }
        secondary={
          file.metadata?.qualification?.label ? (
            <div className="u-coolGrey u-fz-tiny u-fs-normal u-flex u-flex-items-center">
              <Icon icon={QualifyIcon} size="10" />
              <Typography
                variant="caption"
                className={styles['fil-mobileactionmenu-category']}
              >
                {scannerT(`Scan.items.${file.metadata.qualification.label}`)}
              </Typography>
            </div>
          ) : null
        }
        primaryTypographyProps={{ variant: 'h6' }}
      />
    </>
  )
}
