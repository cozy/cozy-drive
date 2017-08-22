import styles from '../styles/menu'

import React, { Component } from 'react'
import classNames from 'classnames'

export const Item = ({ children, onClick }) =>
  <div onClick={onClick} className={styles['coz-menu-item']}>{children}</div>

export default class Menu extends Component {
  state = { opened: false }

  toggle = () => this.state.opened ? this.close() : this.open()

  handleClickOutside = e => {
    if (!this.container.contains(e.target)) {
      e.stopPropagation()
      this.close()
    }
  }

  handleSelect = (item, e) => {
    this.close()
  }

  open () {
    this.setState({ opened: true })
    document.addEventListener('click', this.handleClickOutside, true)
  }

  close () {
    this.setState({ opened: false })
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  renderItems () {
    return React.Children.map(this.props.children, (item) => {
      if (!item) return item
      // ideally here, we should rely on React's type property and verify that
      // type === Item, but for some reason, preact vnodes don't have this property
      if (item.nodeName !== 'hr') {
        return React.cloneElement(item, {
          onClick: this.handleSelect.bind(this, item)
        })
      }
      return React.cloneElement(item)
    })
  }

  render () {
    const { title, disabled, className, buttonClassName } = this.props
    const { opened } = this.state
    return (
      <div
        className={classNames(styles['coz-menu'], className)}
        ref={ref => { this.container = ref }}
      >
        <button
          role='button'
          className={classNames('coz-btn', buttonClassName)}
          disabled={disabled}
          onClick={this.toggle}
        >
          <span className='coz-hidden'>{title}</span>
        </button>
        <div className={classNames(
          styles['coz-menu-inner'],
          { [styles['coz-menu-inner--opened']]: opened }
        )}>
          {this.renderItems()}
        </div>
      </div>
    )
  }
}
