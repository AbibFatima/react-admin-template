import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Spinner from './Spinner';
import secureLocalStorage from 'react-secure-storage';

function AdminRoute() {
  const [spinner, setSpinner] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = secureLocalStorage.getItem('admin');
    if (adminStatus) {
      setSpinner(false);
      setAdmin(true);
    } else {
      setSpinner(false);
      setAdmin(false);
    }
  }, []);

  if (spinner) {
    return <Spinner />;
  } else if (admin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default AdminRoute;
