import React, { Component } from 'react'

import Modal, {
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalButtons
} from 'cozy-ui/react/Modal'
import { Button, Icon } from 'cozy-ui/react'
import { translate } from 'cozy-ui/react/I18n'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import classNames from 'classnames'
import styles from './styles.styl'

class NewModal extends Component {
  render() {
    const {
      title,
      dismissAction,
      primaryAction,
      primaryText,
      t,
      secondaryText,
      secondaryAction,
      description,
      breakpoints: { isMobile }
    } = this.props
    //!TODO Move this new kind of Modal to UI
    return (
      <Modal
        mobileFullscreen
        closable={isMobile ? false : true}
        size="large"
        title={isMobile ? '' : title}
        dismissAction={dismissAction}
      >
        {isMobile && (
          <ModalHeader className={classNames(styles['modal-header'])}>
            <h2>{title}</h2>

            <Button
              icon={<Icon icon={'cross'} size={'16'} />}
              onClick={() => dismissAction()}
              iconOnly
              label={t('close')}
              subtle
              theme={'secondary'}
            />
          </ModalHeader>
        )}
        <ModalContent
          className={classNames({
            ['u-flex-grow-1 u-ph-1']: isMobile
          })}
        >
          {description}
        </ModalContent>
        <ModalFooter
          className={classNames({
            [styles['modal-footer']]: isMobile
          })}
        >
          <ModalButtons
            primaryText={primaryText}
            primaryAction={primaryAction}
            primaryType={'regular'}
            secondaryText={secondaryText}
            secondaryAction={secondaryAction}
            secondaryType={'secondary'}
          />
        </ModalFooter>
      </Modal>
    )
  }
}

export default withBreakpoints()(translate()(NewModal))
