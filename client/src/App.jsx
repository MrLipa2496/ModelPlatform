import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import BasePage from './pages/BasePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/' element={<BasePage />} />
      </Routes>
    </Router>
  );
}

export default App;
