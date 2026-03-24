import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff, IoMdArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ValidatedField from '../ValidatedField';
import { SIGNUP_VALIDATION_SCHEMA } from '../../utils/validationSchema';
import { authenticateUser, clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../utils/constants';
import styles from './SignupForm.module.sass';

const { ROLE_OPTIONS, MODEL_FIELDS, AGENCY_FIELDS } = CONSTANTS;

const SignupForm = ({ preselectedRole }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    ...CONSTANTS.INITIAL_SIGNUP_VALUES,
    role: preselectedRole,
  };

  const togglePasswordVisibility = () => setShowPassword(v => !v);

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
            }
          : {
              agencyName: values.agencyName,
              phone: values.phone,
              location: values.location,
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
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            {fieldsToShow.map(f => (
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
            ))}

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
                  I agree to the <a href='/terms'>Terms & Conditions</a>
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
