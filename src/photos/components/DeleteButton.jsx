import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import classNames from 'classnames'
import button from 'cozy-ui/stylus/components/button'

const styles = {
  parent: {
    position: 'relative',
    overflow: 'hidden'
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  }
}

export const DeleteButton = ({
  t,
  label,
  type = 'button',
  disabled,
  onDelete,
  className = ''
}) => (
  <label
    role="button"
    disabled={disabled}
    className={`${className} ${type === 'menu-item'
      ? button['c-link--delete']
      : classNames(
          button['c-btn'],
          button['c-btn--danger'],
          button['c-btn--delete']
        )}`}
    style={styles.parent}
  >
    {label}
    <button
      disabled={disabled}
      style={styles.input}
      onClick={() => onDelete()}
    />
  </label>
)

export default translate()(DeleteButton)
