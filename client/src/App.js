import Signin from './component/auth/Signin.js'
import Signup from './component/auth/Signup.js'
import DeleteUser from './component/cruduser/deleteuser'
import UpdateUser from './component/cruduser/updateuser'
import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Switch>
     <Route path="/signin" component={Signin} />
     <Route path="/signup" component={Signup} />
     <Route path="/delete" component={DeleteUser} />
     <Route path="/update" component={UpdateUser} />
    </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
