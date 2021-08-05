import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Navbar />

      <Route path="/" exact>
        <Home />
      </Route>
      
      <Route path="/signup">
        <SignUp />
      </Route>
      
      <Route path="/login">
        <LogIn />
      </Route>
    </Router>
  );
}

export default App;