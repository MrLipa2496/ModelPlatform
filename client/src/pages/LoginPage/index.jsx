import React from 'react';
import LoginForm from '../../components/LoginForm';
import loginImage from '../../../img/formsFoto/loginImage.jpg';
import AuthLayout from '../../components/AuthLayout';

export default function LoginPage () {
  return (
    <AuthLayout imageSrc={loginImage}>
      <LoginForm />
    </AuthLayout>
  );
}
