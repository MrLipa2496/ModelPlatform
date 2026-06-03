import styles from './../pages/BasePage/Header/Header.module.sass';
import {
  Users,
  Building2,
  Briefcase,
  Globe,
  Shield,
  Sparkles,
  UserPlus,
  Link2,
  Rocket,
  Globe2,
  MessageSquare,
  Camera,
  BarChart3,
} from 'lucide-react';
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

  ABOUT_ITEMS: [
    {
      icon: Users,
      title: 'Empowering Models',
      text: 'Showcase your talent, grow your personal brand, and connect directly with verified agencies and clients worldwide.',
    },
    {
      icon: Building2,
      title: 'Tools for Agencies',
      text: 'Manage your portfolio, promote models, and collaborate with global brands and partners in one professional dashboard.',
    },
    {
      icon: Briefcase,
      title: 'Opportunities for Clients',
      text: 'Find the perfect face for your campaign. LipaX ensures transparent access to top-tier talents across the globe.',
    },
    {
      icon: Globe,
      title: 'Global Network',
      text: 'From Milan to Tokyo — LipaX connects the modeling world, fostering an inclusive and borderless environment.',
    },
    {
      icon: Shield,
      title: 'Safety & Verification',
      text: 'Every profile and agency is verified, ensuring absolute trust, safety, and professionalism within our community.',
    },
    {
      icon: Sparkles,
      title: 'Innovation & Growth',
      text: 'We combine technology and creativity to make talent discovery faster, smarter, and more inspiring than ever before.',
    },
  ],

  HOW_IT_WORKS_STEPS: [
    {
      icon: UserPlus,
      title: 'Create Profile',
      text: 'Build your personal modeling portfolio. Add your best shots, physical stats, and story to showcase your true potential.',
      link: '/signup',
      linkText: 'Start Building',
    },
    {
      icon: Link2,
      title: 'Connect & Apply',
      text: 'Explore exclusive opportunities. Send applications and get discovered by top-tier modeling agencies and global brands.',
      link: '/agencies',
      linkText: 'Explore Agencies',
    },
    {
      icon: Rocket,
      title: 'Collaborate & Grow',
      text: 'Sign verified offers, participate in real fashion campaigns, and scale your modeling career with professional guidance.',
      link: '/signup',
      linkText: 'Join Now',
    },
  ],

  FEATURES: [
    {
      icon: Shield,
      title: 'Secure Deals & Moderation',
      text: 'Every offer is reviewed and verified to protect both models and agencies. Absolute transparency and security.',
    },
    {
      icon: Globe2,
      title: 'Global Network',
      text: 'Connect with trusted international agencies and clients. Expand your professional reach far beyond borders.',
    },
    {
      icon: MessageSquare,
      title: 'Built-in Chat & Offers',
      text: 'Negotiate, sign, and collaborate directly inside the platform. A simple, fast, and intuitive workflow.',
    },
    {
      icon: Camera,
      title: 'Professional Portfolios',
      text: 'Showcase your work through elegant, high-resolution portfolio galleries that make your talent stand out.',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      text: 'Track your profile growth, engagement metrics, and performance insights in real time.',
    },
  ],
};

export default CONSTANTS;
