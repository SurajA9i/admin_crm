import React from 'react';

function Guard({ children }) {
  let accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken || +accessToken < Date.now()) {
    console.log('logging ... out');
    window.location.href = '/admin/login';
  }
  return <>{children}</>;
}

export default Guard;
