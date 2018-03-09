import styles from '../styles/photoList'

import React, { Component } from 'react'
import { withContentRect } from 'react-measure'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

import PhotoList from './PhotoList'
import { EmptyPhotos } from 'components/Error/Empty'
import Loading from './Loading'
import ErrorComponent from 'components/Error/ErrorComponent'

const Spinner = () => <div className={styles['pho-list-spinner']} />

class MoreButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false
    }
  }

  handleClick() {
    this.setState({ fetching: true })
    this.props.onClick().then(() => this.setState({ fetching: false }))
  }

  render() {
    const { children, width } = this.props
    if (!width) {
      return null
    }
    const { fetching } = this.state
    return (
      <div style={{ width: width }} className={styles['pho-list-morebutton']}>
        {fetching && (
          <Button disabled theme="secondary" label={<Spinner nomargin />} />
        )}
        {!fetching && (
          <Button
            theme="secondary"
            onClick={() => this.handleClick()}
            label={children}
          />
        )}
      </div>
    )
  }
}

export class PhotoBoard extends Component {
  render() {
    const {
      t,
      f,
      lists,
      selected,
      photosContext,
      showSelection,
      onPhotoToggle,
      onPhotosSelect,
      onPhotosUnselect,
      fetchStatus,
      hasMore,
      fetchMore,
      measureRef,
      contentRect: { entry: { width } }
    } = this.props

    const isError = fetchStatus === 'failed'
    const isFetching = fetchStatus === 'pending' || fetchStatus === 'loading'

    if (isError) {
      return <ErrorComponent errorType={`${photosContext}_photos`} />
    }
    if (isFetching) {
      return <Loading loadingType="photos_fetching" />
    }
    if (!isFetching && (lists.length === 0 || lists[0].photos.length === 0)) {
      return <EmptyPhotos localeKey={`${photosContext}_photos`} />
    }

    return (
      <div
        className={showSelection ? styles['pho-list-selection'] : ''}
        ref={measureRef}
      >
        {lists.map(photoList => (
          <PhotoList
            key={photoList.title || photoList.month}
            title={
              photoList.title ||
              (photoList.month ? f(photoList.month, 'MMMM YYYY') : '')
            }
            photos={photoList.photos}
            selected={selected}
            showSelection={showSelection}
            onPhotoToggle={onPhotoToggle}
            onPhotosSelect={onPhotosSelect}
            onPhotosUnselect={onPhotosUnselect}
            containerWidth={width}
          />
        ))}
        {hasMore && (
          <MoreButton width={width} onClick={fetchMore}>
            {t('Board.load_more')}
          </MoreButton>
        )}
      </div>
    )
  }
}

export default translate()(withContentRect()(PhotoBoard))
