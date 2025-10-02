import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { LOGIN_FORM_VALIDATION } from '../../utils/validationSchema';
import ValidatedField from '../ValidatedField';
import styles from './LoginForm.module.sass';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const initialValues = {
    email: '',
    password: '',
    agreed: false,
  };

  const handleSubmit = (values, { resetForm }) => {
    resetForm();
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Log In</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LOGIN_FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        {() => (
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

            <button type='submit' className={styles.formButton}>
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
    </div>
  );
};

export default LoginForm;
