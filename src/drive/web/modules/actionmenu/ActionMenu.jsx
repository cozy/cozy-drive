import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import PopperJS from 'popper.js'
import { translate } from 'cozy-ui/react/I18n'
import MenuItem from './MenuItem'

import styles from 'drive/styles/actionmenu'

class Menu extends Component {
  handleClickOutside = e => {
    const menuEl = ReactDOM.findDOMNode(this)
    if (!menuEl.contains(e.target)) {
      e.stopPropagation()
      this.props.onClose()
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)

    const { reference } = this.props
    const anchorEl = ReactDOM.findDOMNode(reference)
    const menuEl = ReactDOM.findDOMNode(this)
    this.popper = new PopperJS(anchorEl, menuEl)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
    this.popper.destroy()
  }

  render() {
    const { t, file, actions, onClose } = this.props
    const actionNames = Object.keys(actions).filter(actionName => {
      const action = actions[actionName]
      // TODO: is it really necessary?
      return (
        action.displayCondition === undefined || action.displayCondition([file])
      )
    })
    return (
      <div className={styles['fil-actionmenu']}>
        {actionNames.map(actionName => {
          const Component = actions[actionName].Component || MenuItem
          return (
            <Component
              className={cx(
                styles['fil-action'],
                styles[`fil-action-${actionName}`]
              )}
              onClick={e => {
                const promise = actions[actionName].action([file])
                onClose()
                return promise
              }}
              files={[file]}
            >
              {t(`SelectionBar.${actionName}`)}
            </Component>
          )
        })}
      </div>
    )
  }
}

export default translate()(Menu)
