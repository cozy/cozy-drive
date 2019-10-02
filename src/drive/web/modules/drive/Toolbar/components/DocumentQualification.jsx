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
import styles from './styles.styl'
import { categories, getItemById, getItemsByCategory } from './DocumentTypeData'

import GridItem from './Grid/GridItem'

import IconFile from 'drive/assets/icons/icons-files-bi-color.svg'

const CategoryGridItem = ({ isSelected, icon, label }) => {
  return (
    <>
      <div className="u-pos-relative u-flex-self-center u-mt-1">
        <Icon
          icon={IconFile}
          size={'32'}
          color={isSelected ? palette.dodgerBlue : palette.coolGrey}
        />
        {icon && (
          <Icon
            icon={icon}
            color={isSelected ? palette.dodgerBlue : palette.coolGrey}
            size={'16'}
            className={classNames(styles['icon-absolute-centered'])}
          />
        )}
      </div>
      <span className="u-ph-half u-pb-half u-fz-tiny u-ta-center u-ellipsis">
        {label}
      </span>
    </>
  )
}
CategoryGridItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired
}

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
 * @TODO this component should use a Grid system from UI
 */
class DocumentCategory extends Component {
  state = {
    isMenuDisplayed: false
  }

  toggleMenu() {
    this.setState({ isMenuDisplayed: !this.state.isMenuDisplayed })
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
        <GridItem onClick={() => this.toggleMenu()} isSelected={isSelected}>
          <CategoryGridItem
            isSelected={isSelected}
            icon={category.icon}
            label={
              isSelected
                ? t(`Scan.items.${selectedItem.label}`)
                : t(`Scan.categories.${category.label}`)
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
                      icon={IconFile}
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
                    {t(`Scan.categories.${category.label}`)}
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
 * @Todo this component should use a Grid system from UI
 */
class DocumentQualification extends Component {
  state = {
    selected: {
      categoryLabel: null,
      itemId: null
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
    const { t } = this.props
    const { selected } = this.state
    return (
      <>
        <Title className="u-mv-1">{t('Scan.doc_type')}</Title>
        <div className="u-flex u-flex-wrap">
          <GridItem
            onClick={() => this.onSelect({ categoryLabel: null, itemId: null })}
            isSelected={selected.categoryLabel === null}
          >
            <CategoryGridItem
              isSelected={selected.categoryLabel === null}
              label={t(`Scan.categories.undefined`)}
            />
          </GridItem>
          {categories.map((category, i) => {
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
        </div>
      </>
    )
  }
}

DocumentQualification.propTypes = {
  /**
   * This callback is called after a select.
   *
   */
  onQualified: PropTypes.func
}
export default translate()(DocumentQualification)
