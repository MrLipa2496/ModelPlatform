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
import DashboardPage from './pages/ModelPages/DashboardPage';
import OfferPage from './pages/ModelPages/OfferPage';
import ProfilePage from './pages/ProfilePage';
import AgenciesPage from './pages/GuestPages/AgenciesPage';
import MyCastings from './pages/AgencyPages/MyCastings';
import CastingDetailsPage from './pages/GuestPages/CastingsPage/CastingDetailsPage';
import Applicants from './pages/AgencyPages/Applicants';
import MyApplications from './pages/ModelPages/MyApplicationsPage';
import RoleRoute from './components/RoleRoute';
import SignupRoleSelection from './components/SignupRoleSelection';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignupRoleSelection />} />
        <Route path='/signup/model' element={<SignupPage role='model' />} />
        <Route path='/signup/agency' element={<SignupPage role='agency' />} />

        <Route path='/login' element={<LoginPage />} />

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
            <Route path='/myApplications' element={<MyApplications />} />
            <Route path='/castings/:id' element={<CastingDetailsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['agency']} />}>
            <Route path='/model/:id' element={<ModelDetailsPage />} />
            <Route path='/myCastings/:id' element={<CastingDetailsPage />} />
            <Route path='/myCastings' element={<MyCastings />} />
            <Route path='/applicants' element={<Applicants />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['model', 'agency']} />}>
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
