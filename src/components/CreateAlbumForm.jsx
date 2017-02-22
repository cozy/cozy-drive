import styles from '../styles/createAlbumForm'

import React, { Component } from 'react'
import { translate } from '../lib/I18n'

class CreateAlbumForm extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      disabled: true
    }
  }

  onSubmitCurried (onSubmit) {
    return (event) => {
      event.preventDefault()
      onSubmit(this.state.name)
    }
  }

  onNameChange (event) {
    const name = event.target.value.trim()
    this.setState({
      name: name,
      disabled: !name.length
    })
  }

  render ({ t, onSubmitNewAlbum }) {
    return (
      <form onSubmit={this.onSubmitCurried(onSubmitNewAlbum)}>
        <label className={styles['coz-create-album-label']}>
          {t('Albums.add_photos.create_label')}
        </label>
        <div className={styles['coz-inline-form']}>
          <input
            className={styles['coz-input-text']}
            type='text'
            name='album-name'
            onInput={this.onNameChange.bind(this)}
            />
          <button
            className={styles['coz-btn--regular']}
            disabled={this.state.disabled}
            >
            {t('Albums.add_photos.create_button')}
          </button>
        </div>
      </form>
    )
  }
}

export default translate()(CreateAlbumForm)
