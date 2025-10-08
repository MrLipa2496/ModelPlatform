import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import ValidatedField from '../ValidatedField';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_VALIDATION_SCHEMA } from '../../utils/validationSchema';
import { authenticateUser, clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../utils/constants';
import styles from './SignupForm.module.sass';

const { INITIAL_SIGNUP_VALUES, ROLE_OPTIONS, MODEL_FIELDS, AGENCY_FIELDS } =
  CONSTANTS;

const EyeButton = ({ show, onClick }) => (
  <button type='button' className={styles.eyeBtn} onClick={onClick}>
    {show ? <IoMdEye /> : <IoMdEyeOff />}
  </button>
);

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(v => !v);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err || 'Signup failed');
      dispatch(clearAuthError());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Sign Up</h2>
      <Formik
        initialValues={INITIAL_SIGNUP_VALUES}
        validationSchema={SIGNUP_VALIDATION_SCHEMA}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => {
          const roleFields =
            values.role === 'model' ? MODEL_FIELDS : AGENCY_FIELDS;

          return (
            <Form className={styles.form}>
              <div className={styles.roleSelect}>
                {ROLE_OPTIONS.map(opt => (
                  <label key={opt.value} className={styles.roleOption}>
                    <ValidatedField
                      type='radio'
                      name='role'
                      value={opt.value}
                    />
                    <span className={styles.roleLabelText}>{opt.label}</span>
                  </label>
                ))}
              </div>

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
                  placeholder='Password'
                />
                <EyeButton
                  show={showPassword}
                  onClick={togglePasswordVisibility}
                />
              </div>

              {roleFields.map(f => {
                if (f.as === 'select') {
                  return (
                    <ValidatedField
                      key={f.name}
                      name={f.name}
                      as='select'
                      label={f.label}
                    >
                      {f.options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt === ''
                            ? 'Select...'
                            : opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </ValidatedField>
                  );
                }
                return (
                  <ValidatedField
                    key={f.name}
                    name={f.name}
                    type={f.type}
                    label={f.label}
                    placeholder={f.placeholder}
                  />
                );
              })}

              <label className={styles.formCheckBox}>
                <div>
                  <Field
                    type='checkbox'
                    name='agreed'
                    className={styles.inputCheckBox}
                  />
                  <span className={styles.formSpan}>
                    I agree to the terms and conditions
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
                Sign Up
              </button>

              <div className={styles.toggleLink}>
                Already have an account?{' '}
                <a href='/login' className={styles.linkText}>
                  Log In
                </a>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SignupForm;
