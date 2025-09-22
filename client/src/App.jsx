import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import BasePage from './pages/BasePage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<BasePage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
