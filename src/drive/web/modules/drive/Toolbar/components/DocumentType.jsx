import React, { Component } from 'react'
import classNames from 'classnames'

import { Title, Icon, Media, Bd, Img, Bold } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import ActionMenu, {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/react/ActionMenu'
import palette from 'cozy-ui/react/palette'
import styles from './styles.styl'
import { categories, getItemById, getItemsByCategory } from './DocumentTypeData'

import IconFileBlue from 'drive/assets/icons/icons-files-colored-bleu.svg'
import IconFileGray from 'drive/assets/icons/icons-files-colored-gray.svg'
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
        <div
          className={classNames(
            'u-bg-paleGrey u-mr-half u-mb-half u-bxz u-bdrs-3 u-flex u-flex-column u-flex-justify-around',
            styles['grid-item'],
            { [styles['border-selected']]: isSelected }
          )}
          onClick={() => this.toggleMenu()}
        >
          <div className="u-pos-relative u-flex-self-center u-mt-1">
            <Icon icon={isSelected ? IconFileBlue : IconFileGray} size={'32'} />
            <Icon
              icon={category.icon}
              color={isSelected ? palette.dodgerBlue : palette.coolGrey}
              size={'16'}
              className={classNames(styles['icon-absolute-centered'])}
            />
          </div>
          <span className="u-ph-half u-fz-tiny u-ta-center u-ellipsis">
            {isSelected
              ? t(`Scan.items.${selectedItem.label}`)
              : t(`Scan.categories.${category.label}`)}
          </span>
        </div>
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
        <Title className="u-mv-1">{t('Scan.doc_type')}</Title>
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
                t={t}
              />
            )
          })}
        </div>
      </>
    )
  }
}

export default translate()(DocumentType)
