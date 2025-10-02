import React from 'react';
import SignupForm from '../../components/SignupForm';
import signupImage from '../../../img/formsFoto/signupImage.jpg';
import AuthLayout from '../../components/AuthLayout';

export default function SignupPage () {
  return (
    <AuthLayout imageSrc={signupImage}>
      <SignupForm />
    </AuthLayout>
  );
}
