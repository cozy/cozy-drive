import styles from '../styles/photoList'

import React, { Component } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { translate } from 'cozy-ui/react/I18n'

import PhotoList from './PhotoList'

const Spinner = () => <div class={styles['pho-list-spinner']} />

class MoreButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: false
    }
  }

  handleClick () {
    this.setState({ fetching: true })
    this.props.onClick()
      .then(() => this.setState({ fetching: false }))
  }

  render () {
    const { children, width } = this.props
    const { fetching } = this.state
    return (
      <div style={{ width: width }} className={styles['pho-list-morebutton']}>
        {fetching &&
          <button className='coz-btn' disabled>
            <Spinner />
          </button>
        }
        {!fetching &&
          <button
            className='coz-btn coz-btn--secondary'
            onClick={() => this.handleClick()}
          >
            {children}
          </button>
        }
      </div>
    )
  }
}

export class PhotoBoard extends Component {
  render () {
    const {
      t,
      lists,
      selected,
      showSelection,
      onPhotoToggle,
      hasMore,
      onFetchMore
    } = this.props

    return (
      <AutoSizer>
        {({ width, height }) => (
          <div
            role='contentinfo'
            className={showSelection ? styles['pho-list-selection'] : ''}
          >
            {lists.map(photoList =>
              <PhotoList
                key={photoList.title}
                title={photoList.title}
                photos={photoList.photos}
                selected={selected}
                onPhotoToggle={onPhotoToggle}
                containerWidth={width}
              />
            )}
            {hasMore &&
              <MoreButton width={width} onClick={onFetchMore}>
                {t('Board.load_more')}
              </MoreButton>
            }
          </div>
        )}
      </AutoSizer>
    )
  }
}

export default translate()(PhotoBoard)
