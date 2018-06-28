import styles from '../styles/actionmenu'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ActionMenu from 'cozy-ui/react/ActionMenu'
import { translate } from 'cozy-ui/react/I18n'
import Toggle from 'cozy-ui/react/Toggle'

import Spinner from 'cozy-ui/react/Spinner'
import { splitFilename, getClassFromMime } from '../containers/File'
import { isAvailableOffline } from '../ducks/files/availableOffline'

class MenuItem extends Component {
  state = {
    working: false
  }

  toggleSpinner = () => {
    this.setState(state => ({ working: !state.working }))
  }

  handleClick = () => {
    this.toggleSpinner()
    this.props.onClick().then(() => this.toggleSpinner())
  }

  render() {
    const { className, children, checkbox } = this.props
    const { working } = this.state
    return (
      <div>
        <a className={className} onClick={this.handleClick}>
          {children}
          {working && <Spinner />}
          {checkbox && (
            <Toggle
              id={children}
              checked={checkbox.value}
              onToggle={checkbox.onChange}
            />
          )}
        </a>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  checkbox: {
    value: isAvailableOffline(state)(ownProps.files[0].id),
    onChange: () => {}
  }
})

export const ConnectedToggleMenuItem = connect(mapStateToProps)(MenuItem)

const Menu = props => {
  const { t, files, actions, onClose } = props
  const actionNames = Object.keys(actions).filter(actionName => {
    const action = actions[actionName]
    return (
      action.displayCondition === undefined || action.displayCondition(files)
    )
  })
  const header =
    files.length === 1 ? (
      <MenuHeaderFile file={files[0]} />
    ) : (
      <MenuHeaderSelection {...props} />
    )
  return (
    <ActionMenu className={styles['fil-actionmenu']} onClose={onClose}>
      {header}
      <hr />
      {actionNames.map(actionName => {
        const Component = actions[actionName].Component || MenuItem
        return (
          <Component
            className={styles[`fil-action-${actionName}`]}
            onClick={() => Promise.resolve(actions[actionName].action(files))}
            files={files}
          >
            {t(`SelectionBar.${actionName}`)}
          </Component>
        )
      })}
    </ActionMenu>
  )
}

const MenuHeaderFile = ({ file }) => {
  const { filename, extension } = splitFilename(file)
  return (
    <div>
      <div
        className={classNames(
          styles['fil-actionmenu-file'],
          styles['fil-actionmenu-header'],
          getClassFromMime(file)
        )}
      >
        <span className={styles['fil-actionmenu-file-name']}>{filename}</span>
        <span className={styles['fil-actionmenu-file-ext']}>{extension}</span>
      </div>
    </div>
  )
}

const MenuHeaderSelection = ({ t, files }) => {
  const fileCount = files.length
  return (
    <div>
      <div className={classNames(styles['fil-actionmenu-header'])}>
        {fileCount}{' '}
        {t('SelectionBar.selected_count', { smart_count: fileCount })}
      </div>
    </div>
  )
}

export default translate()(Menu)
