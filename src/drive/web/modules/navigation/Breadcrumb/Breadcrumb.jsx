/* global __TARGET__ */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

import styles from 'drive/web/modules/navigation/Breadcrumb/breadcrumb.styl'

const Breadcrumb = ({
  path,
  onBreadcrumbClick,
  opening,
  inlined,
  className = ''
}) => {
  const [deployed, setDeployed] = useState(false)
  const [menu, setMenu] = useState(undefined)

  const toggleDeploy = () => (deployed ? closeMenu() : openMenu())

  const openMenu = () => {
    setDeployed(true)
    document.addEventListener('click', handleClickOutside, true)
  }

  const closeMenu = () => {
    setDeployed(false)
    document.removeEventListener('click', handleClickOutside, true)
  }

  const handleClickOutside = e => {
    if (menu && !menu.contains(e.target)) {
      e.stopPropagation()
      closeMenu()
    }
  }

  if (!path) return false

  return (
    <div
      className={cx(
        styles['fil-path-backdrop'],
        { [styles['deployed']]: deployed },
        { [styles['inlined']]: inlined },
        { [styles['mobile']]: __TARGET__ === 'mobile' },
        className
      )}
    >
      <h2
        data-testid="path-title"
        className={styles['fil-path-title']}
        onClick={toggleDeploy}
        ref={ref => {
          setMenu(ref)
        }}
      >
        {path.map((folder, index) => {
          if (index < path.length - 1) {
            return (
              <span
                className={styles['fil-path-link']}
                onClick={e => {
                  e.stopPropagation()
                  onBreadcrumbClick(folder)
                }}
                key={index}
              >
                <span className={styles['fil-path-link-name']}>
                  {folder.name}
                </span>
                <Icon
                  icon={RightIcon}
                  className={styles['fil-path-separator']}
                />
              </span>
            )
          } else {
            return (
              <span
                className={styles['fil-path-current']}
                onClick={e => {
                  e.stopPropagation()
                  if (path.length >= 2) toggleDeploy()
                }}
                key={index}
              >
                <span className={styles['fil-path-current-name']}>
                  {folder.name}
                </span>
                {path.length >= 2 && (
                  <span className={styles['fil-path-down']} />
                )}

                {opening && <Spinner />}
              </span>
            )
          }
        })}
      </h2>
    </div>
  )
}

Breadcrumb.propTypes = {
  path: PropTypes.array,
  onBreadcrumbClick: PropTypes.func,
  opening: PropTypes.bool,
  inlined: PropTypes.bool,
  className: PropTypes.string
}

export default Breadcrumb
