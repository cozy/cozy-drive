import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Button } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'

import { TimelineBoard } from '../../timeline'
import Selection from '../../selection'

import styles from '../../../styles/newAlbum.styl'

class PhotosPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.t('Albums.create.panel_form.placeholder')
    }
  }

  onNameChange = e => {
    this.setState({ name: e.target.value })
  }

  onCancel = () => {
    this.props.router.goBack()
  }

  onCreate = selected => {
    const { name } = this.state
    this.props
      .createAlbum(name, selected)
      .then(album => this.props.router.push(`/albums/${album.id}`))
      .catch(() => {
        this.input.focus()
        this.input.select()
      })
  }

  onUpdate = selected => {
    const { album } = this.props
    this.props
      .addPhotos(album, selected)
      .then(() => this.props.router.push(`/albums/${album.id}`))
  }

  componentDidMount() {
    if (!this.props.album) {
      this.input.focus()
      this.input.select()
    }
  }

  render() {
    const { t, album } = this.props
    const { name } = this.state
    const isNew = !album
    return (
      <Selection>
        {(selected, active, selection) => (
          <div className={styles['pho-panel']}>
            <div className={styles['pho-panel-form']}>
              <header className={styles['pho-panel-header']}>
                <div className={styles['pho-panel-wrap']}>
                  {isNew && (
                    <div>
                      <label className={styles['coz-form-label']}>
                        {t('Albums.create.panel_form.label')}
                      </label>
                      <input
                        data-test-id="input-album-name"
                        type="text"
                        ref={input => {
                          this.input = input
                        }}
                        value={name}
                        onChange={this.onNameChange}
                      />
                    </div>
                  )}
                  {!isNew && (
                    <h3 data-test-id="pho-picker-album-name">{album.name}</h3>
                  )}
                </div>
              </header>
              <div className={styles['pho-panel-content']}>
                <div
                  data-test-id="picker-panel"
                  className={styles['pho-panel-wrap']}
                >
                  <TimelineBoard
                    selected={selected}
                    showSelection
                    selection={selection}
                  />
                </div>
              </div>
              <footer className={styles['pho-panel-footer']}>
                <div className={styles['pho-panel-wrap']}>
                  <div className={styles['pho-panel-controls']}>
                    <Button
                      theme="secondary"
                      onClick={this.onCancel}
                      label={t('Albums.create.panel_form.cancel')}
                    />
                    <Button
                      data-test-id="validate-album"
                      onClick={() =>
                        isNew
                          ? this.onCreate(selected)
                          : this.onUpdate(selected)
                      }
                      label={t(
                        isNew
                          ? 'Albums.create.panel_form.submit'
                          : 'Albums.create.panel_form.update'
                      )}
                    />
                  </div>
                </div>
              </footer>
            </div>
          </div>
        )}
      </Selection>
    )
  }
}

export default translate()(withRouter(PhotosPicker))
