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

import IconFileBlue from 'drive/assets/icons/icons-files-colored-bleu.svg'
import IconFileGray from 'drive/assets/icons/icons-files-colored-gray.svg'

const CategoryGridItem = ({ isSelected, icon, label }) => {
  return (
    <>
      <div className="u-pos-relative u-flex-self-center u-mt-1">
        <Icon icon={isSelected ? IconFileBlue : IconFileGray} size={'32'} />
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
class DocumentTypeItem extends Component {
  state = {
    displayed: false
  }

  toggleMenu() {
    this.setState({ displayed: !this.state.displayed })
  }

  onSelect = item => {
    const { onSelect } = this.props
    if (onSelect) onSelect(item)
  }
  render() {
    const { displayed } = this.state
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

        {displayed && (
          <ActionMenu onClose={() => this.toggleMenu()}>
            <ActionMenuHeader>
              <Media>
                <Img>
                  <div className="u-pos-relative u-w-2">
                    <Icon icon={IconFileBlue} size={'32'} />
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

DocumentTypeItem.propTypes = {
  onSelect: PropTypes.func
}
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
              <DocumentTypeItem
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
