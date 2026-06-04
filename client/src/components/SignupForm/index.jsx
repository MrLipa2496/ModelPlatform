import React, { useState, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff, IoMdArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import ValidatedField from '../ValidatedField';
import { SIGNUP_VALIDATION_SCHEMA } from '../../utils/validationSchema';
import { authenticateUser, clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../utils/constants';
import styles from './SignupForm.module.sass';

const { MODEL_FIELDS, AGENCY_FIELDS } = CONSTANTS;

const SignupForm = ({ preselectedRole }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    ...CONSTANTS.INITIAL_SIGNUP_VALUES,
    role: preselectedRole,
  };

  const togglePasswordVisibility = () => setShowPassword(v => !v);

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  const cityOptions = useMemo(() => {
    if (!selectedCountryCode) return [];
    return City.getCitiesOfCountry(selectedCountryCode).map(city => ({
      value: city.name,
      label: city.name,
    }));
  }, [selectedCountryCode]);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      borderRadius: '30px',
      borderColor: state.isFocused ? '#333' : '#b3b3b3',
      boxShadow: state.isFocused ? '0 0 0 1px #333' : 'none',
      padding: '0 6px',
      cursor: 'text',
      backgroundColor: '#fff',
      '&:hover': {
        borderColor: '#333',
      },
    }),
    valueContainer: provided => ({
      ...provided,
      padding: '0 12px',
    }),
    input: provided => ({
      ...provided,
      margin: '0px',
      color: '#333',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: '#666',
      padding: '0 12px',
      '&:hover': {
        color: '#333',
      },
    }),
    placeholder: provided => ({
      ...provided,
      color: '#999',
      fontWeight: '400',
    }),
    singleValue: provided => ({
      ...provided,
      color: '#333',
    }),
    menu: provided => ({
      ...provided,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '6px',
      zIndex: 100,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#333'
        : state.isFocused
        ? '#f0f0f0'
        : 'transparent',
      color: state.isSelected ? '#fff' : '#333',
      cursor: 'pointer',
      padding: '12px 16px',
      '&:active': {
        backgroundColor: '#555',
      },
    }),
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const authInfo = {
        email: values.email,
        password: values.password,
        ...(values.role === 'model'
          ? {
              firstName: values.firstName,
              lastName: values.lastName,
              gender: values.gender,
              birthDate: values.birthDate,
              country: values.country,
              city: values.city,
            }
          : {
              agencyName: values.agencyName,
              phone: values.phone,
              country: values.country,
              city: values.city,
            }),
      };

      await dispatch(
        authenticateUser({
          authInfo,
          authMode:
            values.role === 'model'
              ? CONSTANTS.AUTH_MODE.SIGNUP_MODEL
              : CONSTANTS.AUTH_MODE.SIGNUP_AGENCY,
        })
      ).unwrap();

      resetForm();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err || 'Signup failed');
      dispatch(clearAuthError());
    } finally {
      setSubmitting(false);
    }
  };

  const fieldsToShow =
    preselectedRole === 'model' ? MODEL_FIELDS : AGENCY_FIELDS;
  const pageTitle =
    preselectedRole === 'model' ? 'Model Sign Up' : 'Agency Sign Up';

  return (
    <div className={styles.formWrapper}>
      <Link to='/signup' className={styles.backLink}>
        <IoMdArrowBack /> Change Role
      </Link>

      <h2 className={styles.formTitle}>{pageTitle}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={SIGNUP_VALIDATION_SCHEMA}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, setFieldTouched, values }) => (
          <Form className={styles.form}>
            {fieldsToShow.map(f => {
              if (f.name === 'country' || f.name === 'city') {
                const isCountry = f.name === 'country';
                return (
                  <div
                    key={f.name}
                    className={styles.fieldRow}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      marginBottom: '15px',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: '#555',
                      }}
                    >
                      {f.label}
                    </label>
                    <Select
                      options={isCountry ? countryOptions : cityOptions}
                      styles={customSelectStyles}
                      placeholder={`Search ${f.label.toLowerCase()}...`}
                      isDisabled={!isCountry && !selectedCountryCode}
                      value={
                        isCountry
                          ? countryOptions.find(
                              c => c.label === values.country
                            ) || null
                          : cityOptions.find(c => c.value === values.city) ||
                            null
                      }
                      onChange={option => {
                        if (isCountry) {
                          setFieldValue('country', option.label);
                          setSelectedCountryCode(option.value);
                          setFieldValue('city', '');
                        } else {
                          setFieldValue('city', option.value);
                        }
                      }}
                      onBlur={() => setFieldTouched(f.name, true)}
                    />
                    <ErrorMessage
                      name={f.name}
                      component='div'
                      style={{
                        color: '#d32f2f',
                        fontSize: '0.8rem',
                        marginTop: '4px',
                      }}
                    />
                  </div>
                );
              }

              return (
                <div key={f.name} className={styles.fieldRow}>
                  {f.as === 'select' ? (
                    <ValidatedField name={f.name} as='select' label={f.label}>
                      {f.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === ''
                            ? 'Select...'
                            : opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </ValidatedField>
                  ) : (
                    <ValidatedField
                      name={f.name}
                      type={f.type}
                      label={f.label}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              );
            })}

            <ValidatedField
              name='email'
              type='email'
              label='Email'
              placeholder='your@mail.com'
            />

            <div className={styles.inputWrapper}>
              <ValidatedField
                name='password'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                placeholder='Create a strong password'
              />
              <button
                type='button'
                className={styles.eyeBtn}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </button>
            </div>

            <label className={styles.formCheckBox}>
              <div className={styles.checkContainer}>
                <Field
                  type='checkbox'
                  name='agreed'
                  className={styles.inputCheckBox}
                />
                <span className={styles.formSpan}>
                  I agree to the <Link to='/terms'>Terms & Conditions</Link>
                </span>
              </div>
              <ErrorMessage
                name='agreed'
                component='div'
                className={styles.errorMessage}
              />
            </label>

            <button
              type='submit'
              className={styles.formButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Create Account'}
            </button>

            <div className={styles.toggleLink}>
              Already have an account?{' '}
              <Link to='/login' className={styles.linkText}>
                Log In
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;
