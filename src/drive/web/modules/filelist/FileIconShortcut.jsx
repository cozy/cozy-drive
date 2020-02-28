import React from 'react'
import { withClient } from 'cozy-client'
import useFetchShortcut from './useFetchShortcut'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import palette from 'cozy-ui/transpiled/react/palette'

const FileIconShortcut = ({ file, size, client }) => {
  const { shortcurtImg, shouldDisplayImg } = useFetchShortcut(client, file)

  return (
    <IconStack
      align="bottom-right"
      background={
        <>
          <div style={{ display: shouldDisplayImg ? 'block' : 'none' }}>
            <img src={shortcurtImg} width={size} height={size} />
          </div>
          <div
            style={{
              display: !shouldDisplayImg ? 'block' : 'none'
            }}
          >
            <Icon icon="globe" size={size} color={palette.coolGrey} />
          </div>
        </>
      }
      foreground={
        <div
          style={{
            borderRadius: '12px',
            width: '20px',
            height: '20px',
            border: 'solid 1px var(--silver)',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}
        >
          <Icon icon="link" height={10} width={10} />
        </div>
      }
    />
  )
}

export default withClient(FileIconShortcut)
