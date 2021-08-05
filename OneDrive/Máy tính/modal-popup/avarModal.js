import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, GridList, GridListTile } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { FuncButton } from '../../common/Button.js';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/User/userSlice.js';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ava: {
    cursor: 'pointer',
    borderRadius: '10px',
    padding: '2px',
    border: '2px solid #c1c1c1',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

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

export default function AvarModal() {
  const classes = useStyles();
  const User = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const avar = [
    'https://robohash.org/cat?set=set4&size=150x150',
    'https://robohash.org/64Q.png?set=set4&size=150x150',
    'https://robohash.org/kitten?set=set4&size=150x150',
    'https://robohash.org/0UA.png?set=set4&size=150x150',
    'https://robohash.org/sunny.png?set=set4&size=150x150',
    'https://robohash.org/z.png?set=set4&size=150x150',
    'https://robohash.org/1QZ.png?set=set4&size=150x150',
    'https://robohash.org/hoho.png?set=set4&size=150x150',
    'https://robohash.org/tcnxmnc.png?set=set4&size=150x150',
    'https://robohash.org/640.png?set=set4&size=150x150',
  ];

  const handleClick = (event, data) => {
    console.log(event.currentTarget.firstChild.currentSrc);

    let avar = event.currentTarget.firstChild.currentSrc;

    event.preventDefault();
    const action = () => {
      return {
        avatar: avar,
      };
    };
    dispatch(updateUser(action()));
    console.log(User.avatar);
    history.push('/profile');
  };

  return (
    <div>
      <FuncButton
        text="change"
        bgcolor="#09f"
        handleClick={openModal}
      ></FuncButton>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 id="transition-modal-title">Change avatar</h2>
        <GridList cols={5} cellHeight={50} spacing={10}>
          {avar.map((data) => {
            return (
              <GridListTile>
                <Avatar
                  src={data}
                  className={classes.ava}
                  onClick={handleClick}
                />
              </GridListTile>
            );
          })}
        </GridList>
      </Modal>
    </div>
  );
}
