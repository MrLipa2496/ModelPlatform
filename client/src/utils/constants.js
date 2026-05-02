import styles from './../pages/BasePage/Header/Header.module.sass';
const serverIP = 'localhost';
const serverPort = 5001;

const CONSTANTS = {
  BASE_URL: `http://${serverIP}:${serverPort}`,
  PAGINATION_LIMIT: 12,
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
      { to: '/castings', label: 'Castings' },
      { to: '/myApplications', label: 'My Applications' },
      { to: '/agencies', label: 'Agencies' },
      { to: '/about', label: 'About' },
      { to: '/contacts', label: 'Contacts' },
      { to: '/profile', label: 'Profile' },
    ],
    agency: [
      { to: '/models', label: 'Models' },
      { to: '/myCastings', label: 'My Castings' },
      { to: '/applicants', label: 'Applicants' },
      { to: '/about', label: 'About' },
      { to: '/contacts', label: 'Contacts' },
      { to: '/profile', label: 'Profile' },
    ],
    admin: [
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/offers', label: 'Offers' },
      { to: '/admin/verify', label: 'Verify' },
      { to: '/admin/reports', label: 'Reports' },
      { to: '/admin/castings', label: 'Castings' },
      { to: '/admin/payments', label: 'Payments' },
      { to: '/admin/statistics', label: 'Statistics' },
    ],
  },

  PROFILE_FIELDS: [
    { name: 'MOD_FirstName', label: 'First Name' },
    { name: 'MOD_LastName', label: 'Last Name' },
    {
      name: 'MOD_Gender',
      label: 'Gender',
      as: 'select',
      options: ['', 'Male', 'Female', 'Non-binary', 'Other'],
    },
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

  DEFAULT_ADMIN_STATS: {
    totalModels: 0,
    totalAgencies: 0,
    activeCastings: 0,
    pendingUsers: 0,
  },

  DEFAULT_ADMIN_RECENT: {
    pending: [],
    users: [],
    castings: [],
  },

  ADMIN_DASHBOARD_MODULES: [
    {
      id: 'verify',
      path: '/verify',
      title: 'Verification',
      subtitle: 'KYC & Approvals',
      description:
        'Review and approve pending registrations for new models and agencies.',
    },
    {
      id: 'users',
      path: '/users',
      title: 'Users',
      subtitle: 'Manage Accounts',
      description: 'Search, manage, and block active users on the platform.',
    },
    {
      id: 'castings',
      path: '/castings',
      title: 'Castings',
      subtitle: 'Content Control',
      description:
        'Monitor all active job postings and remove inappropriate content.',
    },
    {
      id: 'offers',
      path: '/offers',
      title: 'Offers',
      subtitle: 'Direct Collaborations',
      description:
        'Audit direct collaboration offers between agencies and models.',
    },
    {
      id: 'reports',
      path: '/reports',
      title: 'Reports',
      subtitle: 'User Complaints',
      description:
        'Handle user-submitted reports regarding inappropriate behavior.',
    },
    {
      id: 'statistics',
      path: '/statistics',
      title: 'Statistics',
      subtitle: 'Platform Analytics',
      description:
        'View detailed analytics on platform growth and user engagement.',
    },
  ],

  REJECTION_REASONS: [
    'Incomplete profile: Please fill in all required fields and parameters.',
    'Low-quality or heavily edited photos. Please upload natural digitals/polaroids.',
    'Inappropriate or explicit content violating platform guidelines.',
    'Unable to verify identity or agency credentials.',
    'Suspicious activity or suspected fake profile.',
    'Age requirement not met or missing parental consent.',
  ],
};

export default CONSTANTS;
