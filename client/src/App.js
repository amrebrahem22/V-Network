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
import GLOBAL_TYPES from './redux/actions/globalTypes'
import SocketClient from './SocketClient'

import io from 'socket.io-client'

function App() {
  const { auth, status, modal } = useSelector(state => state);

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
    }
  }, [dispatch, auth.token])

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
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
