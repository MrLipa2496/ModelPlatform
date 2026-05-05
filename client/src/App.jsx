import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './reset.css';
import BasePage from './pages/BasePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ModelsPage from './pages/GuestPages/ModelsPage';
import CastingsPage from './pages/GuestPages/CastingsPage';
import AboutPage from './pages/GuestPages/AboutPage';
import ContactsPage from './pages/GuestPages/ContactsPage';
import AgenciesPage from './pages/GuestPages/AgenciesPage';
import CastingDetailsPage from './pages/GuestPages/CastingsPage/CastingDetailsPage';
import ModelOffersPage from './pages/ModelPages/ModelOffersPage';
import ModelDetailsPage from './pages/ModelPages/ModelDetailsPage';
import MyApplications from './pages/ModelPages/MyApplicationsPage';
import MyCastings from './pages/AgencyPages/MyCastings';
import Applicants from './pages/AgencyPages/Applicants';
import AgencyDetailsPage from './pages/AgencyPages/AgencyDetailsPage';
import RoleRoute from './components/RoleRoute';
import SignupRoleSelection from './components/SignupRoleSelection';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';
import AdminCastingsPage from './pages/AdminPages/AdminCastingsPage';
import AdminVerifyPage from './pages/AdminPages/AdminVerifyPage';
import AdminOffersPage from './pages/AdminPages/AdminOffersPage';
import AdminPaymentsPage from './pages/AdminPages/AdminPaymentsPage';
import AdminReportsPage from './pages/AdminPages/AdminReportsPage';
import AdminStatisticsPage from './pages/AdminPages/AdminStatisticsPage';

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

          <Route element={<RoleRoute allowedRoles={['model', 'admin']} />}>
            <Route path='/myApplications' element={<MyApplications />} />
            <Route path='/castings/:id' element={<CastingDetailsPage />} />
            <Route path='/agency/:id' element={<AgencyDetailsPage />} />
            <Route path='/offers' element={<ModelOffersPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['agency', 'admin']} />}>
            <Route path='/model/:id' element={<ModelDetailsPage />} />
            <Route path='/myCastings/:id' element={<CastingDetailsPage />} />
            <Route path='/myCastings' element={<MyCastings />} />
            <Route path='/applicants' element={<Applicants />} />
          </Route>

          <Route path='/admin' element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path='users' element={<AdminUsersPage />} />
            <Route path='castings' element={<AdminCastingsPage />} />
            <Route path='verify' element={<AdminVerifyPage />} />
            <Route path='offers' element={<AdminOffersPage />} />
            <Route path='payments' element={<AdminPaymentsPage />} />
            <Route path='reports' element={<AdminReportsPage />} />
            <Route path='statistics' element={<AdminStatisticsPage />} />
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
