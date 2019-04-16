import React, { Component } from 'react'
import {
  ActionMenu,
  Menu,
  MenuButton,
  MenuItem,
  withBreakpoints
} from 'cozy-ui/react/'
import { UserAvatar } from '../../sharing/components/Recipient'
import styles from 'drive/styles/actionmenu.styl'

class MenuAwareMobile extends Component {
  state = {
    active: false
  }

  toggle = () => {
    this.setState({ active: !this.state.active })
  }
  render() {
    const {
      breakpoints: { isMobile },
      children,
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
              {children}
            </ActionMenu>
          )}
        </div>
      )
    }
    return <Menu {...this.props} />
  }
}

export default withBreakpoints()(MenuAwareMobile)
