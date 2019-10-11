import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Title, InputGroup, Input, Label } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import MuiCozyTheme from 'cozy-ui/react/MuiCozyTheme'
import Grid from 'cozy-ui/react/MuiCozyTheme/Grid'

import CategoryGridItem from './Grid/CategoryGridItem'
import DocumentCategory from './DocumentCategory'

import { themes, getItemById, getItemsByCategory } from './DocumentTypeData'
import GridItem from './Grid/GridItem'

/**
 * Document Qualification
 *
 * This screen is used to qualify a document ie:
 *  Selecting a metadata category etc
 *  Renaming the file
 *
 * When a selection is done, we call a callback from
 * its parent
 *
 */
const filename_extension = '.jpg'
const id_filename_input = 'filename_input'
class DocumentQualification extends Component {
  constructor(props) {
    super(props)
    const { categoryLabel = null, itemId = null } = props.initialSelected || {}
    this.defaultFilename = `Scan_${new Date().toISOString().replace(/:/g, '-')}`
    this.state = {
      selected: { categoryLabel, itemId },
      filename: this.defaultFilename,
      hasUserWrittenFileName: false
    }
    this.textInput = React.createRef()
  }

  getFilenameFromCategory = (item, t) => {
    const realItem = getItemById(item.itemId)
    if (realItem) {
      const name = t(`Scan.items.${realItem.label}`)
      return `${name.replace(/ /g, '-')}_${new Date()
        .toLocaleDateString()
        .replace(/:/g, '-')
        .replace(/\//g, '-')}`
    } else {
      return this.defaultFilename
    }
  }

  onSelect = item => {
    const { t, editFileName } = this.props
    const { hasUserWrittenFileName } = this.state
    let filename = null
    if (!hasUserWrittenFileName) {
      filename = this.getFilenameFromCategory(item, t)
    } else {
      filename = this.state.filename
    }
    this.setState({ selected: item })
    this.handleFileNameChange(filename)

    const { onQualified } = this.props
    if (onQualified) {
      const realItem = getItemById(item.itemId)
      /* ATM, we only accept JPG extension from the scanner. So 
      we hardcode the filename extension here. 

      If we can't editFileName, then we don't need to use the 
      generated filename 
      */
      if (editFileName) {
        onQualified(
          realItem ? realItem : undefined,
          filename + filename_extension
        )
      } else {
        onQualified(realItem ? realItem : undefined)
      }
    }
  }
  /**
   * Method used to synchronize our internal state and
   * our parent state if needed
   */
  handleFileNameChange = filename => {
    const { onFileNameChanged } = this.props
    this.setState({ filename })
    onFileNameChanged && onFileNameChanged(filename + filename_extension)
  }

  render() {
    const { t, title, editFileName } = this.props
    const { selected, filename, hasUserWrittenFileName } = this.state
    return (
      <MuiCozyTheme>
        {editFileName && (
          <>
            <Label htmlFor={id_filename_input}>{t('Scan.filename')}</Label>
            <InputGroup
              fullwidth
              append={<span className="u-pr-1">{filename_extension}</span>}
              className="u-bdrs-3"
            >
              <Input
                placeholder={t('Scan.filename')}
                value={filename}
                onChange={event => {
                  //If the user write something once, we don't want to rename the file automatically anymore
                  if (!hasUserWrittenFileName) {
                    this.setState({ hasUserWrittenFileName: true })
                  }
                  //If we left an empty value, then we reset the behavior
                  if (event.target.value === '')
                    this.setState({ hasUserWrittenFileName: false })
                  this.handleFileNameChange(event.target.value)
                }}
                onFocus={() => {
                  if (!hasUserWrittenFileName)
                    this.textInput.current.setSelectionRange(0, filename.length)
                }}
                onBlur={() => {
                  if (filename === '') {
                    this.handleFileNameChange(
                      this.getFilenameFromCategory(selected, t)
                    )
                  }
                }}
                inputRef={this.textInput}
                id={id_filename_input}
              />
            </InputGroup>
          </>
        )}

        {title && <Title className="u-mv-1">{title}</Title>}
        <Grid container spacing={1}>
          <GridItem
            onClick={() => this.onSelect({ categoryLabel: null, itemId: null })}
          >
            <CategoryGridItem
              isSelected={selected.categoryLabel === null}
              label={t(`Scan.themes.undefined`)}
            />
          </GridItem>

          {themes.map((category, i) => {
            return (
              <DocumentCategory
                onSelect={item => this.onSelect(item)}
                category={category}
                items={getItemsByCategory(category)}
                key={i}
                isSelected={selected.categoryLabel === category.label}
                selectedItem={
                  selected.itemId ? getItemById(selected.itemId) : {}
                }
                t={t}
              />
            )
          })}
        </Grid>
      </MuiCozyTheme>
    )
  }
}

DocumentQualification.defaultProps = {
  editFileName: false
}
DocumentQualification.propTypes = {
  /**
   * This callback is called after a select.
   *
   */
  onQualified: PropTypes.func,
  onFileNameChanged: PropTypes.func,
  title: PropTypes.string,
  initialSelected: PropTypes.shape({
    itemId: PropTypes.string,
    categoryLabel: PropTypes.string
  }),
  editFileName: PropTypes.bool
}
export default translate()(DocumentQualification)
