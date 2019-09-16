import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, Text, translate } from 'cozy-ui/transpiled/react'
import Scanner from './Scanner'
import toolbarContainer from '../toolbar'
import { UploadQueue } from 'drive/web/modules/upload/UploadQueue'
import { onlyAddToQueue } from 'drive/web/modules/upload'
import { connect } from 'react-redux'
/**
 *
 */
class ScanItem extends Component {
  render() {
    const { displayedFolder, t, onlyAddToQueue } = this.props
    return (
      <Scanner
        dirId={displayedFolder.id} //Pour savoir où uploader
        pluginConfig={{
          sourceType: 1 // Camera
        }}
        generateName={() => {
          const date = new Date()
          return `Scan_${date.toISOString()}.jpg`
        }}
        onConflict={'rename'}
      >
        {({ status, error, onClick, name }) => {
          if (error) return <Text>{error.message} </Text>
          if (status === 'uploading') {
            return <Button label="Prendre une photo" busy />
          }
          if (status === 'done')
            return (
              <>
                <Text>Uploaded</Text>
                <Button label="Prendre une photo" onClick={onClick} />
              </>
            )

          return (
            <>
              {ReactDOM.createPortal(
                <UploadQueue
                  queue={[
                    {
                      file: {
                        name: 'toto.png',
                        isDirectory: false,
                        status: 'loading'
                      }
                    }
                  ]}
                  doneCount={0}
                  t={t}
                />,
                document.querySelector('[role=application]')
              )}
              <Button label="Prendre une photo" onClick={onClick} />
            </>
          )
        }}
      </Scanner>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onlyAddToQueue: files => dispatch(onlyAddToQueue(files))
})

export default toolbarContainer(
  translate()(
    connect(
      null,
      mapDispatchToProps
    )(ScanItem)
  )
)
