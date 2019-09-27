import React, { Component } from 'react'
import cx from 'classnames'
import { Title, Icon } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import ActionMenu, {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/react/ActionMenu'
import palette from 'cozy-ui/react/palette'

import { categories, getItemById, getItemsByCategory } from './DocumentTypeData'
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
    const { category, isSelected, selectedItem, items } = this.props
    return (
      <>
        <div
          className={cx(
            'u-bg-paleGrey u-w-4 u-h-4 u-mr-half u-mb-half u-ellipsis u-bdrs-3 u-flex u-flex-column u-flex-justify-around u-flex-items-center'
          )}
          onClick={() => this.toggleMenu()}
        >
          <Icon
            icon="file"
            color={isSelected ? palette.azure : palette.coolGrey}
            size={'32'}
          />
          <span>{isSelected ? selectedItem.label : category.label}</span>
        </div>
        {displayed && (
          <ActionMenu onClose={() => this.toggleMenu()}>
            <ActionMenuHeader>{category.label}</ActionMenuHeader>
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
                  {item.label}
                </ActionMenuItem>
              )
            })}
          </ActionMenu>
        )}
      </>
    )
  }
}
class DocumentType extends Component {
  state = {
    displayed: false,
    selected: {
      categoryLabel: null,
      itemId: null
    }
  }

  onSelect = item => {
    this.setState({ selected: item })
    const { onQualified } = this.props
    if (onQualified) onQualified(getItemById(item.itemId))
  }

  render() {
    const { t } = this.props
    const { selected } = this.state
    return (
      <>
        <Title>{t('scan.doc_type')}</Title>
        <div className="u-flex u-flex-wrap">
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
              />
            )
          })}
        </div>
      </>
    )
  }
}

export default translate()(DocumentType)
