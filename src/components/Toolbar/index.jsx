/* global cozy */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Menu, { Item } from 'components/Menu'
import styles from './index.styl'

import { withBreakpoints } from 'cozy-ui/react'

const { BarRight } = cozy.bar

class Toolbar extends Component {
  render() {
    const {
      children,
      moreMenuTitle,
      moreMenuDisabled,
      moreMenuClassName,
      moreMenuButton,
      breakpoints: { isMobile }
    } = this.props

    const actions = React.Children.toArray(children)
    const highlightedActions = actions.filter(child => child.props.highlighted)
    const secondaryActions = actions.filter(child => !child.props.highlighted)

    const MoreMenu = (
      <Menu
        title={moreMenuTitle}
        disabled={moreMenuDisabled}
        className={moreMenuClassName}
        button={moreMenuButton}
      >
        {highlightedActions.map(component =>
          this.wrapInItem(
            React.cloneElement(component, {
              highlighted: false,
              isSecondaryAction: false
            })
          )
        )}
        {secondaryActions.map(component =>
          this.wrapInItem(
            React.cloneElement(component, {
              highlighted: false,
              isSecondaryAction: true
            })
          )
        )}
      </Menu>
    )

    return (
      <div role="toolbar">
        {highlightedActions.map(component =>
          React.cloneElement(component, {
            highlighted: true,
            isSecondaryAction: false
          })
        )}
        {isMobile ? <BarRight>{MoreMenu}</BarRight> : MoreMenu}
      </div>
    )
  }

  wrapInItem(component) {
    return <Item>{component}</Item>
  }
}

Toolbar.propTypes = {
  moreMenuTitle: PropTypes.string.isRequired,
  moreMenuDisabled: PropTypes.bool,
  moreMenuClassName: PropTypes.string,
  moreMenuButton: PropTypes.element.isRequired,
  children: PropTypes.node,
  breakpoints: PropTypes.object
}

Toolbar.defaultProps = {
  moreMenuDisabled: false,
  moreMenuClassName: ''
}

export class ToolbarAction extends Component {
  render() {
    try {
      const { children, visible, highlighted, isSecondaryAction } = this.props

      if (!visible) return null

      const child = React.cloneElement(React.Children.only(children), {
        highlighted
      })

      if (isSecondaryAction) return child
      else {
        const hiddenStyle = highlighted
          ? styles['u-hide--mob']
          : styles['u-hide--desk']
        return <span className={hiddenStyle}>{child}</span>
      }
    } catch (_) {
      return null
    }
  }
} // needs to extend Component to have `props.children`

ToolbarAction.propTypes = {
  visible: PropTypes.bool,
  highlighted: PropTypes.bool,
  isSecondaryAction: PropTypes.bool,
  children: PropTypes.element.isRequired
}

ToolbarAction.defaultProps = {
  visible: true,
  highlighted: false,
  isSecondaryAction: true
}

export default withBreakpoints()(Toolbar)
