import React, { useEffect, useMemo, useState } from 'react'

import BreadcrumbMui from 'cozy-ui/transpiled/react/Breadcrumbs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FolderIcon from 'cozy-ui/transpiled/react/Icons/Folder'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import IconServer from 'assets/icons/icon-server.svg'
import { ROOT_DIR_ID } from 'constants/config'
import { DesktopBreadcrumbItem } from 'modules/breadcrumb/components/DesktopBreadcrumbItem'

import styles from 'modules/breadcrumb/styles/breadcrumb.styl'

const DesktopBreadcrumb = ({ onBreadcrumbClick, path }) => {
  const { t } = useI18n()

  const expandText = useMemo(() => t('breadcrumb.label'), [t])
  const [dropdownTrigger, setDropdownTrigger] = useState(
    document.querySelector(`[aria-label="${expandText}"]`)
  )
  const anchorElRef = useMemo(
    () => ({ current: dropdownTrigger }),
    [dropdownTrigger]
  )
  const [menuDisplayed, setMenuDisplayed] = useState(false)

  const handleDropdownTriggerClick = e => {
    e.stopPropagation()
    setMenuDisplayed(true)
  }

  useEffect(() => {
    setMenuDisplayed(false)
    setDropdownTrigger(document.querySelector(`[aria-label="${expandText}"]`))
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const trigger = anchorElRef.current
    if (trigger) {
      trigger.addEventListener('click', handleDropdownTriggerClick)
      return () => {
        setMenuDisplayed(false)
        trigger.removeEventListener('click', handleDropdownTriggerClick)
      }
    }
  }, [anchorElRef.current]) // eslint-disable-line react-hooks/exhaustive-deps

  const Separator = (
    <Icon icon={RightIcon} className={styles['fil-path-separator']} />
  )

  // When we are in a shared drive, we want to display the shared drive icon
  // in first position to reduce the number of displayed path elements
  const pathToDisplay = useMemo(() => {
    const sharedDriveIndex = path.findIndex(
      item => item.id === 'io.cozy.files.shared-drives-dir'
    )
    if (sharedDriveIndex !== -1 && path.length > 2) {
      return path.slice(sharedDriveIndex)
    }

    return path
  }, [path])

  return (
    <>
      <BreadcrumbMui
        className={styles['fil-path-backdrop']}
        maxItems={3}
        separator={Separator}
        itemsAfterCollapse={2}
        expandText={expandText}
      >
        {pathToDisplay.map((breadcrumbPath, index) => {
          if (pathToDisplay.length > 1 && breadcrumbPath.id === ROOT_DIR_ID) {
            return (
              <DesktopBreadcrumbItem
                key={breadcrumbPath.name}
                onClick={onBreadcrumbClick}
                item={breadcrumbPath}
                isCurrent={index === pathToDisplay.length - 1}
                icon={FolderIcon}
              />
            )
          }

          if (
            index === 0 &&
            breadcrumbPath.id === 'io.cozy.files.shared-drives-dir'
          ) {
            return (
              <DesktopBreadcrumbItem
                key={breadcrumbPath.name}
                onClick={onBreadcrumbClick}
                item={breadcrumbPath}
                isCurrent={index === pathToDisplay.length - 1}
                icon={IconServer}
              />
            )
          }

          return (
            <DesktopBreadcrumbItem
              key={breadcrumbPath.name}
              onClick={onBreadcrumbClick}
              item={breadcrumbPath}
              isCurrent={index === pathToDisplay.length - 1}
            />
          )
        })}
      </BreadcrumbMui>

      {menuDisplayed && (
        <ActionMenu
          anchorElRef={anchorElRef}
          autoclose={true}
          onClose={() => {
            setMenuDisplayed(false)
          }}
          popperOptions={{
            placement: 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 10]
                }
              }
            ]
          }}
        >
          {path.slice(1, -2).map(breadcrumbPath => (
            <ActionMenuItem
              key={breadcrumbPath.name}
              onClick={e => {
                e.stopPropagation()
                onBreadcrumbClick(breadcrumbPath)
              }}
            >
              {breadcrumbPath.name}
            </ActionMenuItem>
          ))}
        </ActionMenu>
      )}
    </>
  )
}

export default DesktopBreadcrumb
