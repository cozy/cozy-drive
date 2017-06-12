import styles from '../styles/createAlbumForm'

import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import classNames from 'classnames'

export class CreateAlbumForm extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      isSubmitDisabled: true,
      isBusy: false,
      hasError: false
    }
  }

  reset () {
    this.setState({
      name: '',
      isSubmitDisabled: true,
      isBusy: false,
      hasError: false
    })
  }

  onSubmit (event, callback) {
    event.preventDefault()
    this.setState({ isBusy: true })
    return callback(this.state.name)
      .then(
        () => this.reset(),
        () => this.setState({
          hasError: true,
          isBusy: false
        })
      )
  }

  onNameChange (event) {
    const name = event.target.value
    this.setState({
      name: name,
      isSubmitDisabled: !name.trim().length,
      hasError: false
    })
  }

  render () {
    const { t, onSubmitNewAlbum } = this.props
    return (
      <form className={styles['pho-create-album-form']} onSubmit={(event) => this.onSubmit(event, onSubmitNewAlbum)}>
        <label className={styles['coz-create-album-label']}>
          {t('Albums.create.inline_form.create_label')}
        </label>
        <div className={styles['coz-inline-form']}>
          <input
            className={classNames(styles['coz-input-text'], this.state.hasError && styles['error'])}
            type='text'
            name='album-name'
            onInput={(event) => this.onNameChange(event)}
            disabled={this.state.isBusy}
            placeholder={t('Albums.create.inline_form.placeholder')}
            value={this.state.name}
            />
          <button
            className={classNames('coz-btn', 'coz-btn--regular', styles['coz-btn'])}
            disabled={this.state.isSubmitDisabled || this.state.isBusy}
            aria-busy={this.state.isBusy}
            >
            {t('Albums.create.inline_form.create_button')}
          </button>
        </div>
      </form>
    )
  }
}

export default translate()(CreateAlbumForm)
