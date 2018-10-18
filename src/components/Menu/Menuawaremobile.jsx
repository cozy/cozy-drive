import React, { Component } from 'react'
import {
  ActionMenu,
  Menu,
  MenuButton,
  MenuItem,
  withBreakpoints
} from 'cozy-ui/react/'
import { UserAvatar } from '../../sharing/components/Recipient'
import styles from 'drive/styles/actionmenu'

class MenuAwareMobile extends Component {
  state = {
    active: false
  }

  toggle = () => {
    this.setState({ active: !this.state.active })
  }
  renderItems() {
    return React.Children.map(this.props.children, item => {
      if (!item) return item
      // ideally here, we should rely on React's type property and verify that
      // type === Item, but for some reason, preact vnodes don't have this property
      if (item.nodeName !== 'hr') {
        return React.cloneElement(item, {
          onClick: item.props.onSelect
            ? item.props.onSelect.bind(this, item)
            : undefined
        })
      }
      return item
    })
  }

  render() {
    const {
      breakpoints: { isMobile },
      // children,
      text,
      buttonClassName,
      name
    } = this.props
    if (isMobile) {
      return (
        <div>
          <MenuButton
            onClick={this.toggle}
            text={text}
            buttonClassName={buttonClassName}
          />
          {this.state.active && (
            <ActionMenu onClose={() => this.toggle()}>
              <MenuItem className={styles['fil-mobileactionmenu']}>
                <UserAvatar name={name} size={'small'} />
              </MenuItem>
              {this.renderItems()}
            </ActionMenu>
          )}
        </div>
      )
    }
    return <Menu {...this.props} />
  }
}

export default withBreakpoints()(MenuAwareMobile)
