import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import EmojiNatureIcon from '@material-ui/icons/EmojiNature';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navbarTitle: {
    marginRight: theme.spacing(2),
    textDecoration: 'none',
    color: 'white',
  }
}));

function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <EmojiNatureIcon className={classes.menuButton} />
          <Typography variant="h6" className={classes.title}>
            Draw&amp;Guess
          </Typography>
          <Typography><Link to="/" className={classes.navbarTitle}>Home</Link></Typography>
          <Typography><Link to="/signup" className={classes.navbarTitle}>Sign up</Link></Typography>
          <Typography><Link to="/login" className={classes.navbarTitle}>Log in</Link></Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;