/* global cozy */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import Main from 'drive/web/modules/layout/Main'
import ScrollToTop from 'drive/web/modules/navigation/ScrollToTop'
import styles from '../styles'
import Toggle from 'cozy-ui/react/Toggle'
import { getMediaBuckets, addMediaBucket, delMediaBucket } from '../duck'
import { getMediaBuckets as getAllMediaBuckets } from 'drive/mobile/lib/media'
import {
  backupImages,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'

const { BarCenter } = cozy.bar

class SelectMediaBuckets extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mediaBuckets: new Set()
    }
  }

  createHandle(item, checked) {
    if (checked) {
      this.props.addMediaBucket(item)
    } else {
      this.props.delMediaBucket(item)
    }
  }

  async componentDidMount() {
    const data = await getAllMediaBuckets()
    this.setState({ mediaBuckets: data })
  }

  render() {
    const { t } = this.props
    return (
      <Main>
        <ScrollToTop />
        <BarCenter>
          <h2 className={styles['settings__title']}>
            {t('mobile.settings.media_backup.media_buckets.title')}
          </h2>
        </BarCenter>
        <div className="u-p-1">
          {[...this.state.mediaBuckets].map(item => (
            <div className={styles['settings__subcategory']} key={item}>
              <label
                htmlFor={item}
                className={styles['settings__subcategory__label']}
              >
                {item}
              </label>
              <label
                htmlFor={item}
                className={styles['settings__subcategory__item']}
              >
                <Toggle
                  id={item}
                  checked={this.props.selectedBuckets.has(item)}
                  onToggle={checked => this.createHandle(item, checked)}
                />
              </label>
            </div>
          ))}
        </div>
      </Main>
    )
  }
}

const mapStateToProps = state => ({
  selectedBuckets: getMediaBuckets(state)
})

const mapDispatchToProps = dispatch => ({
  addMediaBucket: item => {
    dispatch(addMediaBucket(item))
    dispatch(cancelMediaBackup())
    dispatch(backupImages(true))
  },
  delMediaBucket: item => {
    dispatch(delMediaBucket(item))
    dispatch(cancelMediaBackup())
    dispatch(backupImages(true))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SelectMediaBuckets))
