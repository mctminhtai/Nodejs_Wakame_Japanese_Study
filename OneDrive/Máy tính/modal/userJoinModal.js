import React from 'react';
import Modal from 'react-modal';
import { FuncButton } from '../../common/Button.js';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const center = {
  display: 'table',
  marginLeft: 'auto',
  marginRight: 'auto',
};

export default function GuessJoinRoomModal() {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <FuncButton
        text="Play"
        bgcolor="#028a0f"
        name="esport"
        handleClick={openModal}
      ></FuncButton>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Join as guest</h2>
        <form>
          <label>Username</label>&emsp;
          <input />
        </form>
        <div style={center}>
          <FuncButton
            text="cancel"
            bgcolor="#ff5141"
            handleClick={closeModal}
          ></FuncButton>
          <FuncButton
            text="join"
            bgcolor="#0063cc"
            link="/room/:id"
          ></FuncButton>
        </div>
      </Modal>
    </div>
  );
}
