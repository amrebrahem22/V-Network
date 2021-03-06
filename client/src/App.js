import {useEffect} from 'react';
import{ BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import PageRender from './customRouter/PageRender';
import PrivateRouter from './customRouter/PrivateRouter';
import Alert from './components/alert/Alert'
import './styles/global.css';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import {refreshToken} from './redux/actions/authActions'
import Header from './components/Header/Header'
import StatusModal from './components/StatusModal'
import { getPosts } from './redux/actions/postAction'
import { getSuggestions } from './redux/actions/suggestionsAction'
import { getNotifies } from './redux/actions/notifyAction'
import GLOBAL_TYPES from './redux/actions/globalTypes'
import SocketClient from './SocketClient'
import CallModal from './components/message/CallModal'

import io from 'socket.io-client'
import Peer from 'peerjs'

function App() {
  const { auth, status, modal, call } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(refreshToken())

    const socket = io();
    dispatch({ type: GLOBAL_TYPES.SOCKET, payload: socket })

    return () => socket.close()
  }, [dispatch])

  useEffect(() => {
    if(auth.token) {
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }
  }, [dispatch, auth.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    
    dispatch({ type: GLOBAL_TYPES.PEER, payload: newPeer })
  },[dispatch])

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          <Route exact path='/' component={auth.token ? Home : Login} />
          <Route exact path='/register' component={Register} />
          <PrivateRouter exact path='/:page' component={PageRender} />
          <PrivateRouter exact path='/:page/:id' component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;
