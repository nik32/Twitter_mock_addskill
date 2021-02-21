import {BrowserRouter, Route, Redirect, useHistory} from 'react-router-dom';
import {useState} from 'react';

import './App.css';
import Home from './containers/Home';
import UserTweets from './containers/UserTweets';
import People from './containers/People';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import Navbar from './containers/Navbar';

/*
  1. No need for having a global state management of username and jwt because it is only needed one level down the compoment tree.
 */

function App() {
  const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
  const [user, setUser] = useState(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <div>
        <Navbar jwt={jwt}/>
        <Route exact path='/' render={() => <Home show_profile={true} username = {user ? JSON.parse(user).username : null}/>} />
        <Route path='/userTweets' render={() => {
          if(jwt && user)
            return <UserTweets editable={true} logged={true} username = {JSON.parse(user).username}/> 
          else
            return <Redirect to="/signin" />
        }}/>
        <Route path='/people' render={() => {
          if(jwt && user)
            return <People username = {JSON.parse(user).username} loader_name="loader3" show_profile={true}/> 
          else
            return <Redirect to="/signin"/>
        }}/>
        <Route path='/signin' render={() => <Signin setJwt={setJwt} setUser={setUser}/>} />
        <Route path='/signup' component={Signup} />
        <Route path='/signout' render={() => {
          localStorage.clear();
          setJwt(null); 
          setUser(null);
          return <Redirect to = '/' />
        }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
