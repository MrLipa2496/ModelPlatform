import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import BasePage from './pages/BasePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoleRoute from './components/RoleRoute/RoleRoute';
import DashboardPage from './pages/ModelPages/DashboardPage';
import OfferPage from './pages/ModelPages/OfferPage';
import CastingPage from './pages/ModelPages/CastingPage';
import ProfilePage from './pages/ModelPages/ProfilePage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route path='/' element={<BasePage />}>
          <Route element={<RoleRoute allowedRoles={['model']} />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/offers' element={<OfferPage />} />
            <Route path='/castings' element={<CastingPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
