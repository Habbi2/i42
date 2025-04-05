import React from 'react';
import Auth from './Auth';

const RegisterView = () => {
  // Just render the Auth component with isLogin initially set to false
  return <Auth initialView="register" />;
};

export default RegisterView;