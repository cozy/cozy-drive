import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import BreadcrumbMui from 'cozy-ui/transpiled/react/MuiCozyTheme/MuiBreadcrumbs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

import styles from 'drive/web/modules/navigation/Breadcrumb/breadcrumb.styl'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

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

  return (
    <>
      <BreadcrumbMui
        className={styles['fil-path-backdrop']}
        maxItems={3}
        separator={Separator}
        itemsAfterCollapse={2}
        expandText={expandText}
      >
        {path.map((breadcrumbPath, index) => (
          <span
            className={classNames(
              index === path.length - 1
                ? styles['fil-path-current-name']
                : styles['fil-path-link'],
              styles['fil-path-title']
            )}
            key={breadcrumbPath.name}
            onClick={e => {
              e.stopPropagation()
              onBreadcrumbClick(breadcrumbPath)
            }}
          >
            {breadcrumbPath.name}
          </span>
        ))}
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
