import styles from '../styles/topbar'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'

const KEYCODE_ENTER = 13
const KEYCODE_ESC = 27

export const Topbar = ({ t, children, router, viewName, albumName = '', editing = false, onEdit = ()=>{} }) => {
  const backToAlbums = () => {
    // go to parent
    let url = router.location.pathname
    router.push(url.substring(0, url.lastIndexOf('/')))
  }

  let ignoreBlurEvent = false // we'll ignore blur events if they are triggered by pressing enter or escape, to prevent `onEdit` from firing twice

  const handleBlur = e => {
    if (!ignoreBlurEvent) onEdit(e.target.value.trim() !== '' ? e.target.value : albumName)
  }

  const handleKeyDown = e => {
    if (e.keyCode === KEYCODE_ENTER) {
      ignoreBlurEvent = true
      onEdit(e.target.value)
    }
    else if (e.keyCode === KEYCODE_ESC) {
      ignoreBlurEvent = true
      onEdit(albumName)
    }
  }

  const focusInput = elem => {
    if (!elem) return
    setTimeout(() => {
      elem.focus()
      elem.select()
    })
  }

  return (
    <div className={styles['pho-content-header']}>
      {viewName === 'albumContent' &&
        <div
          role='button'
          className={styles['pho-content-album-previous']}
          onClick={backToAlbums}
        />
      }
      <h2 className={styles['pho-content-title']}>
        {
          viewName !== 'albumContent'
          ? t(`Nav.${viewName}`)
          : editing
          ? <input type='text' value={albumName} onKeyDown={handleKeyDown} onBlur={handleBlur} ref={focusInput} />
          : albumName
        }
      </h2>
      {children}
    </div>
  )
}

export default translate()(withRouter(Topbar))
