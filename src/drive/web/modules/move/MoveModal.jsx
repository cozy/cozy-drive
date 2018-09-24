import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  ModalDescription,
  ModalHeader,
  ModalFooter,
  Button
} from 'cozy-ui/react'

class MoveModal extends React.Component {
  render() {
    return (
      <Modal>
        <ModalDescription>Actual content goes here</ModalDescription>
        <ModalFooter>
          <Button>Déplacer</Button>
          <Button theme="secondary">Annuler</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default MoveModal
