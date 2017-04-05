import styles from '../../styles/toolbar'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import confirm from '../../lib/confirm'
import classNames from 'classnames'

import Menu, { MenuButton, Item } from 'react-bosonic/lib/Menu'
import EmptyTrashConfirm from './components/EmptyTrashConfirm'
import Spinner from '../../components/Spinner'

import { emptyTrash } from './actions'

class DeleteButton extends Component {
  state = {
    working: false
  };
  toggleSpinner = () => {
    this.setState({ working: !this.state.working })
  }

  render () {
    const { children, onClick } = this.props
    return (
      <button onClick={onClick} className={classNames(
        'coz-btn', 'coz-btn--danger-outline', styles['fil-btn--delete'],
        { [styles['fil-btn--active']]: this.state.working }
      )}>
        {this.state.working && <Spinner />}
        {children}
      </button>
    )
  }
}

const Toolbar = ({ t, disabled, emptyTrash, onSelectItemsClick }) => (
  <div className={styles['fil-toolbar-trash']} role='toolbar'>
    <DeleteButton onClick={() => emptyTrash()}>
      {t('toolbar.delete_all')}
    </DeleteButton>
    <MenuButton>
      <button
        role='button'
        className={classNames('coz-btn', styles['fil-toolbar-more-btn'])
        }
        disabled={disabled}
      >
        <span className='coz-hidden'>{ t('toolbar.item_more') }</span>
      </button>
      <Menu className={styles['fil-toolbar-menu']}>
      <Item>
        <a
          className={styles['fil-action-delete']}
          onClick={() => emptyTrash()}
        >
          {t('toolbar.delete_all')}
        </a>
      </Item>
      <hr />
        <Item>
          <a className={styles['fil-action-select']} onClick={onSelectItemsClick}>
            {t('toolbar.menu_select')}
          </a>
        </Item>
      </Menu>
    </MenuButton>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  emptyTrash: () =>
    confirm(<EmptyTrashConfirm t={ownProps.t} />)
      .then(() => dispatch(emptyTrash()))
      .catch(() => {})
})

export default translate()(connect(null, mapDispatchToProps)(Toolbar))
