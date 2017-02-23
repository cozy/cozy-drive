import styles from '../styles/createAlbumForm'

import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import classNames from 'classNames'

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

  render ({ t, isBusy, hasError, onSubmitNewAlbum }) {
    return (
      <form onSubmit={this.onSubmitCurried(onSubmitNewAlbum)}>
        <label className={styles['coz-create-album-label']}>
          {t('Albums.create.inline_form.create_label')}
        </label>
        <div className={styles['coz-inline-form']}>
          <input
            className={classNames(styles['coz-input-text'], hasError && styles['error'])}
            type='text'
            name='album-name'
            onInput={this.onNameChange.bind(this)}
            disabled={isBusy}
            placeholder={t('Albums.create.inline_form.placeholder')}
            />
          <button
            className={classNames('coz-btn', 'coz-btn--regular', styles['coz-btn'])}
            disabled={this.state.disabled || isBusy}
            aria-busy={isBusy}
            >
            {t('Albums.create.inline_form.create_button')}
          </button>
        </div>
      </form>
    )
  }
}

export default translate()(CreateAlbumForm)
