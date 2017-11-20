import styles from '../styles/actionmenu'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import Toggle from 'cozy-ui/react/Toggle'
import withGestures from '../lib/withGestures'
import Hammer from 'hammerjs'

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
  const { t, files, actions } = props
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
    <div className={styles['fil-actionmenu']}>
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
    </div>
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
        {filename}
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

const ActionMenu = translate()(Menu)

const Backdrop = withGestures(ownProps => ({
  tap: () => ownProps.onClose()
}))(() => <div className={styles['fil-actionmenu-backdrop']} />)

class FileActionMenu extends Component {
  componentDidMount() {
    this.gesturesHandler = new Hammer.Manager(this.fam, {
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]]
    })

    this.actionMenuNode = this.actionMenu.getDOMNode()

    this.dismissHandler = this.dismiss.bind(this)

    // to be completely accurate, `maximumGestureDelta` should be the difference between the top of the menu and the bottom of the page; but using the height is much easier to compute and accurate enough.
    const maximumGestureDistance = this.actionMenuNode.getBoundingClientRect()
      .height
    const minimumCloseDistance = 0.6 // between 0 and 1, how far down the gesture must be to be considered complete upon release
    const minimumCloseVelocity = 0.6 // a gesture faster than this will dismiss the menu, regardless of distance traveled

    let currentGestureProgress = null

    this.gesturesHandler.on('panstart', e => {
      // disable css transitions during the gesture
      this.actionMenuNode.classList.remove(styles['with-transition'])
      currentGestureProgress = 0
    })
    this.gesturesHandler.on('pan', e => {
      currentGestureProgress = e.deltaY / maximumGestureDistance
      this.applyTransformation(currentGestureProgress)
    })
    this.gesturesHandler.on('panend', e => {
      // re enable css transitions
      this.actionMenuNode.classList.add(styles['with-transition'])
      // dismiss the menu if the swipe pan was bigger than the treshold, or if it was a fast, downward gesture
      let shouldDismiss =
        e.deltaY / maximumGestureDistance >= minimumCloseDistance ||
        (e.deltaY > 0 && e.velocity >= minimumCloseVelocity)

      if (shouldDismiss) {
        if (currentGestureProgress >= 1) {
          // the menu was already hidden, we can close it right away
          this.dismissHandler()
        } else {
          // we need to transition the menu to the bottom before dismissing it
          this.actionMenuNode.addEventListener(
            'transitionend',
            this.dismissHandler,
            false
          )
          this.applyTransformation(1)
        }
      } else {
        this.applyTransformation(0)
      }
    })
  }

  componentWillUnmount() {
    this.gesturesHandler.destroy()
  }

  // applies a css trasnform to the element, based on the progress of the gesture
  applyTransformation(progress) {
    // wrap the progress between 0 and 1
    progress = Math.min(1, Math.max(0, progress))
    this.actionMenuNode.style.transform = 'translateY(' + progress * 100 + '%)'
  }

  dismiss() {
    this.props.onClose()
    // remove the event handler so subsequent transitions don't trigger dismissals
    this.actionMenuNode.removeEventListener(
      'transitionend',
      this.dismissHandler
    )
    this.applyTransformation(0)
  }

  render(props) {
    return (
      <div
        className={styles['fil-actionmenu-wrapper']}
        ref={fam => {
          this.fam = fam
        }}
      >
        <Backdrop {...props} />
        <ActionMenu
          {...props}
          ref={actionMenu => {
            this.actionMenu = actionMenu
          }}
        />
      </div>
    )
  }
}

export default translate()(FileActionMenu)
