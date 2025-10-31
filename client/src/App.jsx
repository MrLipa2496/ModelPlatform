import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import BasePage from './pages/BasePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/GuestPages/HomePage';
import ModelsPage from './pages/GuestPages/ModelsPage';
import ModelDetailsPage from './pages/GuestPages/ModelDetailsPage';
import CastingsPage from './pages/GuestPages/CastingsPage';
import AboutPage from './pages/GuestPages/AboutPage';
import ContactsPage from './pages/GuestPages/ContactsPage';
import RoleRoute from './components/RoleRoute';
import DashboardPage from './pages/ModelPages/DashboardPage';
import OfferPage from './pages/ModelPages/OfferPage';
import CastingPage from './pages/ModelPages/CastingPage';
import ProfilePage from './pages/ModelPages/ProfilePage';
import AgenciesPage from './pages/GuestPages/AgenciesPage';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route path='/' element={<BasePage />}>
          <Route index element={<HomePage />} />
          <Route path='/agencies' element={<AgenciesPage />} />
          <Route path='/models' element={<ModelsPage />} />
          <Route path='/castings' element={<CastingsPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contacts' element={<ContactsPage />} />

          <Route element={<RoleRoute allowedRoles={['model']} />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/offers' element={<OfferPage />} />
            <Route path='/my-castings' element={<CastingPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['agency']} />}>
            <Route path='/model/:id' element={<ModelDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
