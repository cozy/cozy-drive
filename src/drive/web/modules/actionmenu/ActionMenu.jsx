import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import PopperJS from 'popper.js'
import { translate } from 'cozy-ui/react/I18n'
import { Overlay } from 'cozy-ui/react'
import MenuItem from './MenuItem'

import styles from 'drive/styles/actionmenu'

class Menu extends Component {
  componentDidMount() {
    const { reference } = this.props
    const anchorEl = ReactDOM.findDOMNode(reference)
    const menuEl = ReactDOM.findDOMNode(this.menuEl)
    this.popper = new PopperJS(anchorEl, menuEl)
  }

  componentWillUnmount() {
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
        <Overlay
          onClick={onClose}
          onEscape={onClose}
          className={styles['fil-actionmenu-overlay']}
        />
        <div
          className={styles['fil-actionmenu-inner']}
          ref={el => {
            this.menuEl = el
          }}
        >
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
      </div>
    )
  }
}

export default translate()(Menu)
