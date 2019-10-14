import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Icon, Media, Bd, Img, Bold } from 'cozy-ui/react'

import ActionMenu, {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/react/ActionMenu'
import palette from 'cozy-ui/react/palette'

import CategoryGridItem from './Grid/CategoryGridItem'

import styles from './styles.styl'
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
            theme={t(`Scan.themes.${category.label}`)}
            label={
              isSelected ? t(`Scan.items.${selectedItem.label}`) : undefined
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

export default DocumentCategory
