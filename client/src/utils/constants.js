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
};

export default CONSTANTS;
