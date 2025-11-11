import styles from './../pages/BasePage/Header/Header.module.sass';
const serverIP = 'localhost';
const serverPort = 5001;

const CONSTANTS = {
  BASE_URL: `http://${serverIP}:${serverPort}/`,
  AUTH_MODE: {
    REGISTER: 'REGISTER',
    SIGNUP_MODEL: 'SIGNUP_MODEL',
    SIGNUP_AGENCY: 'SIGNUP_AGENCY',
  },
  ACCESS_TOKEN: 'accessToken',
  INITIAL_SIGNUP_VALUES: {
    role: 'model',
    email: '',
    password: '',
    agreed: false,
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    agencyName: '',
    phone: '',
    location: '',
  },

  ROLE_OPTIONS: [
    { value: 'model', label: 'Model' },
    { value: 'agency', label: 'Agency' },
  ],

  MODEL_FIELDS: [
    {
      name: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      placeholder: 'Last Name',
      label: 'Last Name',
    },
    {
      name: 'gender',
      as: 'select',
      options: ['', 'male', 'female', 'other'],
      placeholder: 'Select Gender',
      label: 'Gender',
    },
    {
      name: 'birthDate',
      type: 'date',
      placeholder: 'Birth Date',
      label: 'Birth Date',
    },
  ],

  AGENCY_FIELDS: [
    {
      name: 'agencyName',
      type: 'text',
      placeholder: 'Agency Name',
      label: 'Agency Name',
    },
    { name: 'phone', type: 'text', placeholder: 'Phone', label: 'Phone' },
    {
      name: 'location',
      type: 'text',
      placeholder: 'Location',
      label: 'Location',
    },
  ],

  AGENCY_PROFILE_FIELDS: [
    { name: 'AGN_Name', label: 'Agency Name', type: 'text' },
    { name: 'AGN_Country', label: 'Country', type: 'text' },
    { name: 'AGN_City', label: 'City', type: 'text' },
    { name: 'AGN_Website', label: 'Website', type: 'text' },
    { name: 'AGN_Phone', label: 'Phone', type: 'text' },
    { name: 'AGN_Description', label: 'Description', type: 'textarea' },
  ],

  NAV_CONFIG: {
    guest: [
      { to: '/models', label: 'Models' },
      { to: '/agencies', label: 'Agencies' },
      { to: '/castings', label: 'Castings' },
      { to: '/about', label: 'About' },
      { to: '/contacts', label: 'Contacts' },
      {
        to: '/login',
        label: 'Login',
        isAuthBtn: true,
        className: styles.loginBtn,
      },
      {
        to: '/signup',
        label: 'SignUp',
        isAuthBtn: true,
        className: styles.signupBtn,
      },
    ],
    model: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/offers', label: 'Offers' },
      { to: '/castings', label: 'Castings' },
      { to: '/profile', label: 'Profile' },
    ],
    agency: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/models', label: 'Models' },
      { to: '/myCastings', label: 'My Castings' },
      { to: '/myCastings', label: 'Applications' },
      { to: '/profile', label: 'Profile' },
    ],
    admin: [
      { to: '/admin', label: 'Admin Panel' },
      { to: '/users', label: 'Users' },
      { to: '/offers', label: 'Offers' },
      { to: '/verify', label: 'Verify' },
      { to: '/reports', label: 'Reports' },
      { to: '/castings', label: 'Castings' },
      { to: '/payments', label: 'Payments' },
      { to: '/statistics', label: 'Statistics' },
    ],
  },

  PROFILE_FIELDS: [
    { name: 'MOD_FirstName', label: 'First Name' },
    { name: 'MOD_LastName', label: 'Last Name' },
    { name: 'MOD_Gender', label: 'Gender' },
    { name: 'MOD_BirthDate', label: 'Date of Birth', type: 'date' },
    { name: 'MOD_Height', label: 'Height (cm)', type: 'number' },
    { name: 'MOD_Weight', label: 'Weight (kg)', type: 'number' },
    { name: 'MOD_EyeColor', label: 'Eye Color' },
    { name: 'MOD_HairColor', label: 'Hair Color' },
    { name: 'MOD_Experience', label: 'Experience' },
    {
      name: 'MOD_Bio',
      label: 'About Me',
      as: 'textarea',
      placeholder: 'Tell something about yourself...',
    },
  ],
};

export default CONSTANTS;
