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

export const profileValidationSchema = yup.object({
  MOD_FirstName: yup
    .string()
    .required('First name is required')
    .matches(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ\s-]+$/, 'Only letters are allowed')
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Too long'),

  MOD_LastName: yup
    .string()
    .required('Last name is required')
    .matches(/^[A-Za-zА-Яа-яёЁЇїІіЄєҐґ\s-]+$/, 'Only letters are allowed')
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Too long'),

  MOD_Gender: yup
    .string()
    .required('Gender is required')
    .oneOf(
      ['male', 'female', 'non-binary', 'other', 'Male', 'Female', 'Other'],
      'Invalid gender'
    ),

  MOD_BirthDate: yup
    .date()
    .typeError('Please enter a valid date')
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future')
    .min(
      new Date(new Date().setFullYear(new Date().getFullYear() - 120)),
      'Are you really that old?'
    ),

  MOD_Height: yup
    .number()
    .typeError('Height must be a number')
    .required('Height is required')
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height cannot exceed 300 cm'),

  MOD_Weight: yup
    .number()
    .typeError('Weight must be a number')
    .required('Weight is required')
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight cannot exceed 300 kg'),

  MOD_EyeColor: yup.string().min(2, 'Too short').max(20, 'Too long'),

  MOD_HairColor: yup.string().min(2, 'Too short').max(20, 'Too long'),

  MOD_Experience: yup
    .number()
    .typeError('Experience must be a number')
    .required('Experience is required')
    .min(0, 'Cannot be negative')
    .max(100, 'Too much experience'),

  MOD_Bio: yup
    .string()
    .required('Bio is required')
    .min(10, 'Please write at least a few words about yourself') // Добавил минимальную длину для солидности
    .max(1000, 'Bio is too long'),
});

export const agencyProfileValidationSchema = yup.object({
  AGN_Name: yup
    .string()
    .min(2, 'Must be 2 characters or more')
    .required('Agency name is required'),
  AGN_Country: yup.string(),
  AGN_City: yup.string(),
  AGN_Website: yup
    .string()
    .url('Must be a valid URL (e.g., https://example.com)'),
  AGN_Phone: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      'Phone number is not valid'
    ),
  AGN_Description: yup.string().max(1000, 'Must be 1000 characters or less'),
});
