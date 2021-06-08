import{ BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';

function App() {
  return (
    <Router>
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          Hello Dev
        </div>
      </div>
    </Router>
  );
}

export default App;
