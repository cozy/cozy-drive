import React, { Component } from 'react'
import { Button, Text } from 'cozy-ui/transpiled/react'
import Scanner from './Scanner'
import toolbarContainer from '../toolbar'
import PortaledQueue from './PortaledQueue'
import { connect } from 'react-redux'
/**
 *
 */
class ScanItem extends Component {
  resetState = () => {}
  render() {
    const { displayedFolder, onlyAddToQueue } = this.props
    return (
      <>
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
              return (
                <>
                  <PortaledQueue
                    file={{
                      file: {
                        name,
                        isDirectory: false,
                        status
                      }
                    }}
                    doneCount={0}
                    key={name}
                  />
                  <Button label="Prendre une photo" busy />
                </>
              )
            }
            if (status === 'done') {
              return (
                <>
                  <PortaledQueue
                    file={{
                      file: {
                        name,
                        isDirectory: false,
                        status
                      }
                    }}
                    doneCount={1}
                    successCount={1}
                    key={name}
                  />
                  <Button label="Prendre une photo" onClick={onClick} />
                </>
              )
            }

            return <Button label="Prendre une photo" onClick={onClick} />
          }}
        </Scanner>
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onlyAddToQueue: files => dispatch(onlyAddToQueue(files))
})

export default toolbarContainer(
  connect(
    null,
    mapDispatchToProps
  )(ScanItem)
)
