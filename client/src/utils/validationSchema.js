import * as yup from 'yup';

export const LOGIN_FORM_VALIDATION = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[!@#$%^&*])/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
  agreed: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const MIN_AGE = 16;
const minBirthDate = new Date();
minBirthDate.setFullYear(minBirthDate.getFullYear() - MIN_AGE);

export const SIGNUP_VALIDATION_SCHEMA = yup.object().shape({
  role: yup
    .string()
    .oneOf(['model', 'agency'], 'Invalid role')
    .required('Role is required'),

  email: yup
    .string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be at most 32 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include uppercase, lowercase, number and special character'
    ),

  agreed: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),

  firstName: yup.string().when('role', {
    is: 'model',
    then: schema =>
      schema
        .trim()
        .matches(
          /^[A-Za-zА-Яа-яЁёЇїІіЄє'\- ]+$/,
          'First name contains invalid characters'
        )
        .min(2, 'First name is too short')
        .max(50, 'First name is too long')
        .matches(
          /^[A-ZА-ЯЁЇІЄ][A-Za-zА-Яа-яЁёЇїІіЄє'\- ]+$/,
          'First name must start with a capital letter and contain only valid characters'
        )
        .required('First name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  lastName: yup.string().when('role', {
    is: 'model',
    then: schema =>
      schema
        .trim()
        .matches(
          /^[A-Za-zА-Яа-яЁёЇїІіЄє'\- ]+$/,
          'Last name contains invalid characters'
        )
        .min(2, 'Last name is too short')
        .max(50, 'Last name is too long')
        .matches(
          /^[A-ZА-ЯЁЇІЄ][A-Za-zА-Яа-яЁёЇїІіЄє'\- ]+$/,
          'Last name must start with a capital letter and contain only valid characters'
        )
        .required('Last name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  gender: yup.string().when('role', {
    is: 'model',
    then: schema =>
      schema
        .oneOf(['male', 'female', 'other'], 'Select a valid gender')
        .required('Gender is required'),
    otherwise: schema => schema.notRequired(),
  }),

  birthDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .when('role', {
      is: 'model',
      then: schema =>
        schema
          .required('Birth date is required')
          .max(minBirthDate, `You must be at least ${MIN_AGE} years old`),
      otherwise: schema => schema.nullable().notRequired(),
    }),

  agencyName: yup.string().when('role', {
    is: 'agency',
    then: schema =>
      schema
        .trim()
        .min(2, 'Agency name is too short')
        .max(100, 'Agency name is too long')
        .required('Agency name is required'),
    otherwise: schema => schema.notRequired(),
  }),

  phone: yup.string().when('role', {
    is: 'agency',
    then: schema =>
      schema
        .trim()
        .matches(
          /^[0-9+\-\s()]{6,30}$/,
          'Phone is invalid (only digits, spaces, +, -, parentheses allowed)'
        )
        .required('Phone is required'),
    otherwise: schema => schema.notRequired(),
  }),

  location: yup.string().when('role', {
    is: 'agency',
    then: schema =>
      schema
        .trim()
        .min(2, 'Location is too short')
        .max(100, 'Location is too long')
        .required('Location is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
