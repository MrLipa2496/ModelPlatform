import React from 'react';
import SignupForm from '../../components/SignupForm';
import modelBg from '../../../img/formsFoto/signupModel.jpg';
import agencyBg from '../../../img/formsFoto/signupAgency.jpg';
import AuthLayout from '../../components/AuthLayout';

export default function SignupPage ({ role }) {
  const image = role === 'model' ? modelBg : agencyBg;

  return (
    <AuthLayout imageSrc={image}>
      <SignupForm preselectedRole={role} />
    </AuthLayout>
  );
}
