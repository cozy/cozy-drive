import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Title, Icon, Media, Bd, Img, Bold } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import ActionMenu, {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/react/ActionMenu'
import palette from 'cozy-ui/react/palette'
import MuiCozyTheme from 'cozy-ui/react/MuiCozyTheme'
import Grid from 'cozy-ui/react/MuiCozyTheme/Grid'

import CategoryGridItem from './Grid/CategoryGridItem'

import styles from './styles.styl'
import { themes, getItemById, getItemsByCategory } from './DocumentTypeData'
import GridItem from './Grid/GridItem'

/**
 * DocumentCategory component
 *
 * The goal of this component is to display a
 * category / type of document and also manage
 * its associated ActionMenu since a category has
 * several associated items.
 *
 * If an item from a category is selected, we display
 * its label instead of the label from the category
 *
 */
class DocumentCategory extends Component {
  state = {
    isMenuDisplayed: false
  }

  toggleMenu() {
    this.setState(prevState => {
      return {
        isMenuDisplayed: !prevState.isMenuDisplayed
      }
    })
  }

  onSelect = item => {
    const { onSelect } = this.props
    if (onSelect) onSelect(item)
  }
  render() {
    const { isMenuDisplayed } = this.state
    const { category, isSelected, selectedItem, items, t } = this.props
    return (
      <>
        <GridItem onClick={() => this.toggleMenu()}>
          <CategoryGridItem
            isSelected={isSelected}
            icon={category.icon}
            label={
              isSelected
                ? t(`Scan.items.${selectedItem.label}`)
                : t(`Scan.themes.${category.label}`)
            }
          />
        </GridItem>

        {isMenuDisplayed && (
          <ActionMenu onClose={() => this.toggleMenu()}>
            <ActionMenuHeader>
              <Media>
                <Img>
                  <div className="u-pos-relative u-w-2">
                    <Icon
                      icon={'file-duotone'}
                      size={'32'}
                      color={palette.dodgerBlue}
                    />
                    <Icon
                      icon={category.icon}
                      color={palette.dodgerBlue}
                      size={'16'}
                      className={classNames(styles['icon-absolute-centered'])}
                    />
                  </div>
                </Img>
                <Bd className={'u-ml-1'}>
                  <Bold tag="span" ellipsis>
                    {t(`Scan.themes.${category.label}`)}
                  </Bold>
                </Bd>
              </Media>
            </ActionMenuHeader>
            {items.map(item => {
              return (
                <ActionMenuItem
                  onClick={() => {
                    this.onSelect({
                      categoryLabel: category.label,
                      itemId: item.id
                    })
                    this.toggleMenu()
                  }}
                  key={item.id}
                >
                  {t(`Scan.items.${item.label}`)}
                </ActionMenuItem>
              )
            })}
          </ActionMenu>
        )}
      </>
    )
  }
}

DocumentCategory.propTypes = {
  onSelect: PropTypes.func,
  category: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  selectedItem: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
}

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
class DocumentQualification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: {
        categoryLabel:
          props.selected && props.selected.categoryLabel
            ? props.selected.categoryLabel
            : null,
        itemId:
          props.selected && props.selected.itemId ? props.selected.itemId : null
      }
    }
  }
  onSelect = item => {
    this.setState({ selected: item })
    const { onQualified } = this.props
    if (onQualified) {
      const realItem = getItemById(item.itemId)
      //We only call the callback if a "real" item is selected
      //not if `Scan.categories.undefined` is
      if (realItem) onQualified(realItem)
    }
  }

  render() {
    const { t, title } = this.props
    const { selected } = this.state
    return (
      <MuiCozyTheme>
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

DocumentQualification.propTypes = {
  /**
   * This callback is called after a select.
   *
   */
  onQualified: PropTypes.func,
  title: PropTypes.string,
  selected: PropTypes.shape({
    itemId: PropTypes.string,
    categoryLabel: PropTypes.string
  })
}
export default translate()(DocumentQualification)
