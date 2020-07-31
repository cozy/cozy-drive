import React, { Component } from 'react'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { CozyFile } from 'cozy-doctypes'
import styles from 'drive/styles/filenameinput.styl'

import ExperimentalDialog, {
  ExperimentalDialogTitle,
  ExperimentalDialogActions
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import DialogContent from '@material-ui/core/DialogContent'

import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

const ENTER_KEY = 13
const ESC_KEY = 27

const valueIsEmpty = value => value.toString() === ''

class FilenameInput extends Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
    this.state = {
      value: props.name || '',
      working: false,
      error: false,
      hasBeenSubmitedOrAborted: false,
      isModalOpened: false
    }
    this.fileNameOnMount = props.name
    this.abort = this.abort.bind(this)
    this.save = this.save.bind(this)
  }

  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY && !valueIsEmpty(this.state.value)) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.submit()
    } else if (e.keyCode === ESC_KEY) {
      this.setState({ hasBeenSubmitedOrAborted: true })
      this.abort()
    }
  }

  handleChange(e) {
    const value = e.target.value
    this.setState({ value })
    this.props.onChange && this.props.onChange(value)
  }

  handleBlur() {
    // On top of "normal" blurs, the event happens all the time after a submit or an abort, because this component is removed from the DOM while having the focus.
    // we want to do things only on "normal" blurs, *not* after a submit/abort
    if (!this.state.hasBeenSubmitedOrAborted) {
      // when it's a regular blur, we want to abort, except is the value is non-empty
      if (valueIsEmpty(this.state.value)) this.abort(true)
      else this.submit()
    }
  }

  submit() {
    this.setState({ working: true, error: false })
    if (!this.fileNameOnMount) this.save()
    const previousExtension = CozyFile.splitFilename({
      name: this.fileNameOnMount,
      type: 'file'
    }).extension
    const newExtension = CozyFile.splitFilename({
      name: this.state.value,
      type: 'file'
    }).extension
    if (previousExtension !== newExtension) {
      this.setState({ isModalOpened: true })
    } else {
      this.save()
    }
  }
  save = async () => {
    if (!this.props.onSubmit) return
    try {
      await this.props.onSubmit(this.state.value)
    } catch (e) {
      this.setState({
        working: false,
        error: true
      })
    }
  }
  abort(accidental = false) {
    if (this.state.isModalOpened) this.setState({ isModalOpened: false })
    this.props.onAbort && this.props.onAbort(accidental)
  }
  handleFocus() {
    const { name } = this.props
    const { filename } = CozyFile.splitFilename({ name, type: 'file' })
    //Since we're mounting the component and focusing it at the same time
    // let's add a small timeout to be sure the ref is populated
    setTimeout(() => {
      if (this.textInput.current)
        this.textInput.current.setSelectionRange(0, filename.length)
    }, 5)
  }
  render() {
    const { value, working, error } = this.state
    const { t } = this.props
    return (
      <div data-testid="name-input" className={styles['fil-file-name-input']}>
        <input
          type="text"
          value={value}
          ref={this.textInput}
          disabled={working}
          onChange={e => this.handleChange(e)}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          onKeyDown={e => this.handleKeyDown(e)}
          className={error ? styles['error'] : null}
          autoFocus="autofocus"
        />
        {working && <Spinner />}
        <ExperimentalDialog
          onClose={this.abort}
          open={this.state.isModalOpened}
        >
          <DialogCloseButton onClick={this.abort} />
          <ExperimentalDialogTitle>
            {t('RenameModal.title')}
          </ExperimentalDialogTitle>
          <DialogContent>{t('RenameModal.description')}</DialogContent>
          <ExperimentalDialogActions layout="row">
            <Button
              theme="secondary"
              onClick={this.abort}
              label={t('RenameModal.cancel')}
            />
            <Button
              theme="primary"
              label={t('RenameModal.continue')}
              onClick={this.save}
            />
          </ExperimentalDialogActions>
        </ExperimentalDialog>
      </div>
    )
  }
}

export default translate()(FilenameInput)
