import React from 'react';
import Auth from './Auth';

const LoginView = () => {
  // Just render the Auth component with isLogin initially set to true
  return <Auth initialView="login" />;
};

export default LoginView;