import styles from '../styles/newAlbum'

import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/react/I18n'
import { fetchIfNeededPhotos, fetchMorePhotos, getTimelineList, getPhotosByMonth } from '../ducks/timeline'
import { createAlbum } from '../ducks/albums'
import PhotoBoard from './PhotoBoard'

class NewAlbum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: [],
      name: props.t('Albums.create.panel_form.placeholder')
    }
  }

  onPhotoToggle = id => {
    this.setState(({ selected }) => {
      const idx = selected.findIndex(i => i === id)
      return {
        selected: idx === -1
          ? [...selected, id]
          : [...selected.slice(0, idx), ...selected.slice(idx + 1)]
      }
    })
  }

  onPhotosSelect = ids => {
    this.setState(({ selected }) => {
      const newIds = ids.filter(id => selected.indexOf(id) === -1)
      return {
        selected: [...selected, ...newIds]
      }
    })
  }

  onPhotosUnselect = ids => {
    this.setState(({ selected }) => {
      return {
        selected: selected.filter(id => ids.indexOf(id) === -1)
      }
    })
  }

  onNameChange = e => {
    this.setState({ name: e.target.value })
  }

  componentDidMount () {
    this.props.fetchIfNeededPhotos()
    this.input.focus()
    this.input.select()
  }

  render () {
    const { t } = this.props
    const { name } = this.state
    return (
      <div className={styles['pho-panel']}>
        <form action='' className={styles['pho-panel-form']}>
          <header className={styles['pho-panel-header']}>
            <div className={styles['pho-panel-wrap']}>
              <label className={styles['coz-form-label']}>{t('Albums.create.panel_form.label')}</label>
              <input
                type='text'
                ref={input => { this.input = input }}
                value={name}
                onChange={this.onNameChange}
              />
            </div>
          </header>
          <div className={styles['pho-panel-content']}>
            <div className={styles['pho-panel-wrap']}>
              {this.renderBoard()}
            </div>
          </div>
          <footer className={styles['pho-panel-footer']}>
            <div className={styles['pho-panel-wrap']}>
              <div className={styles['pho-panel-controls']}>
                <button className={classNames('coz-btn', 'coz-btn--secondary')}>
                  {t('Albums.create.panel_form.cancel')}
                </button>
                <button className={classNames('coz-btn', 'coz-btn--regular')}>
                  {t('Albums.create.panel_form.submit')}
                </button>
              </div>
            </div>
          </footer>
        </form>
      </div>
    )
  }

  renderBoard () {
    const { f, list, fetchMorePhotos } = this.props
    if (!list) {
      return null
    }
    const photoLists = getPhotosByMonth(list.entries, f, 'MMMM YYYY')
    return (
      <PhotoBoard
        lists={photoLists}
        selected={this.state.selected}
        photosContext='albums'
        showSelection
        onPhotoToggle={this.onPhotoToggle}
        onPhotosSelect={this.onPhotosSelect}
        onPhotosUnselect={this.onPhotosUnselect}
        fetchStatus={list.fetchStatus}
        hasMore={list.hasMore}
        onFetchMore={() => fetchMorePhotos(list.index, list.entries.length)}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: getTimelineList(state)
})

export const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchIfNeededPhotos: () => dispatch(fetchIfNeededPhotos()),
  fetchMorePhotos: (index, skip) => dispatch(fetchMorePhotos(index, skip)),
  onSubmit: (name, photos) => {
    return dispatch(createAlbum(name, photos))
      .then(() => {
        //dispatch(closeAddToAlbum())
        Alerter.success('Albums.create.success', {name: name, smart_count: photos.length})
      })
  },
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAlbum))
