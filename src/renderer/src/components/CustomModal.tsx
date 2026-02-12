/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from '@mui/material'

type Props = {
  children: any
  showModal: string | boolean
  setShowModal: (value: boolean | string) => void
}

function CustomModal({ children, showModal, setShowModal }: Props): JSX.Element {
  return (
    <Modal
      className="StyledModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={showModal != false}
      onClose={() => setShowModal(false)}
      closeAfterTransition
    >
      {children}
    </Modal>
  )
}

export default CustomModal
