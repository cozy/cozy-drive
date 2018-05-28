import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Alerter from 'cozy-ui/react/Alerter'
import { translate } from 'cozy-ui/react'

import styles from '../styles/dropzone'

export default class StatefulDropzone extends Component {
  state = {
    dropzoneActive: false
  }

  onDragEnter = evt => {
    if (!canDrop(evt)) return
    this.setState(state => ({ ...state, dropzoneActive: true }))
  }

  onDragLeave = () =>
    this.setState(state => ({ ...state, dropzoneActive: false }))

  onDrop = async (files, _, evt) => {
    const folderId = this.props.displayedFolder.id
    this.setState(state => ({ ...state, dropzoneActive: false }))
    if (!canDrop(evt)) return
    if (canHandleFolders(evt)) {
      const filesToUpload = await getFilesFromItems(evt)
      // sometimes browsers can't detect a file's mimetype, but if all files have no type,
      // we're certainly on FF that have a bug that prevents folder drop
      if (filesToUpload.every(f => !f.type)) {
        Alerter.info('Files.dropzone.noFolderSupport')
      } else {
        this.props.onDrop(filesToUpload, folderId)
      }
    } else {
      this.props.onDrop(files, folderId)
    }
  }

  render() {
    const { dropzoneActive } = this.state
    const { displayedFolder, children, ...rest } = this.props
    return (
      <Dropzone
        {...rest}
        className={dropzoneActive ? styles['fil-dropzone-active'] : ''}
        disableClick
        style={{}}
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {dropzoneActive && <DropzoneTeaser currentFolder={displayedFolder} />}
        {children}
      </Dropzone>
    )
  }
}

const DropzoneTeaser = translate()(({ t, currentFolder }) => (
  <div className={styles['fil-dropzone-teaser']}>
    <div className={styles['fil-dropzone-teaser-claudy']} />
    <div className={styles['fil-dropzone-teaser-content']}>
      <p>{t('Files.dropzone.teaser')}</p>
      <span className={styles['fil-dropzone-teaser-folder']}>
        {(currentFolder && currentFolder.name) || 'Drive'}
      </span>
    </div>
  </div>
))

// DnD helpers for folder upload
const canHandleFolders = evt => {
  if (!evt.dataTransfer) return false
  const dt = evt.dataTransfer
  return dt.items && dt.items.length && dt.items[0].webkitGetAsEntry != null
}

const getFileFromEntry = entry => new Promise(resolve => entry.file(resolve))

const getFilesFromDirectory = directory => {
  const dirReader = directory.createReader()
  return new Promise((resolve, reject) => {
    let results = []
    const entriesReader = async entries => {
      for (let i = 0; i < entries.length; i += 1) {
        const entry = entries[i]
        if (entry.isFile) {
          results.push(await getFileFromEntry(entry))
        } else if (entry.isDirectory) {
          results = results.concat(await getFilesFromDirectory(entry))
        }
      }
      resolve(results)
    }
    dirReader.readEntries(entriesReader)
  })
}

const getFilesFromItems = async evt => {
  let results = []
  const items = evt.dataTransfer.items
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    if (item.webkitGetAsEntry != null && item.webkitGetAsEntry()) {
      const entry = item.webkitGetAsEntry()
      if (entry.isFile && item.getAsFile()) {
        results.push(item.getAsFile())
      } else if (entry.isDirectory) {
        results = results.concat(await getFilesFromDirectory(entry, entry.name))
      }
    } else if (item.getAsFile != null) {
      if (item.kind == null || (item.kind === 'file' && item.getAsFile())) {
        results.push(item.getAsFile())
      }
    }
  }
  return results
}

const canDrop = evt => {
  const items = evt.dataTransfer.items
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].kind !== 'file') return false
  }
  return true
}
