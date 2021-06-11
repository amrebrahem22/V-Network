import {useEffect} from 'react';
import{ BrowserRouter as Router, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import PageRender from './customRouter/PageRender';
import Alert from './components/alert/Alert'
import './App.css';
import Login from './pages/login';
import Home from './pages/home';
import {refreshToken} from './redux/actions/authActions'
import Header from './components/Header/Header'

function App() {
  const { auth } = useSelector(state => state);

  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(refreshToken())
  }, [dispatch])

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          {auth.token && <Header />}
          <Route exact path='/' component={auth.token ? Home : Login} />
          <Route exact path='/:page' component={PageRender} />
          <Route exact path='/:page/:id' component={PageRender} />
        </div>
      </div>
    </Router>
  );
}

export default App;
