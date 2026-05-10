import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOGIN_FORM_VALIDATION } from '../../utils/validationSchema';
import ValidatedField from '../ValidatedField';
import InfoModal from '../InfoModal';
import styles from './LoginForm.module.sass';
import { authenticateUser, clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../utils/constants';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const initialValues = {
    email: '',
    password: '',
    agreed: false,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { email, password } = values;

      await dispatch(
        authenticateUser({
          authInfo: { email, password },
          authMode: CONSTANTS.AUTH_MODE.LOGIN,
        })
      ).unwrap();

      resetForm();
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMessage(
        typeof err === 'string'
          ? err
          : err?.message || 'Invalid email or password. Please try again.'
      );
      setIsErrorModalOpen(true);
      dispatch(clearAuthError());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Log In</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LOGIN_FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.inputWrapper}>
              <ValidatedField
                name='email'
                type='email'
                label='Email'
                placeholder='yourmail@mail.com'
              />
            </div>

            <div className={styles.inputWrapper}>
              <ValidatedField
                name='password'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                placeholder='Enter your password'
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
              Log In
            </button>

            <div className={styles.toggleLink}>
              Don't have an account?{' '}
              <a href='/signup' className={styles.linkText}>
                Sign Up
              </a>
            </div>
          </Form>
        )}
      </Formik>

      <InfoModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title='Authentication Failed'
        showSignupBtn={false}
      >
        <p style={{ margin: 0, fontWeight: 500, color: '#dc2626' }}>
          {errorMessage}
        </p>
      </InfoModal>
    </div>
  );
};

export default LoginForm;
