import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Spinner from './Spinner';
import secureLocalStorage from 'react-secure-storage';

function MainRoute() {
  const [spinner, setSpinner] = useState(true);
  const [specialist, setSpecialist] = useState(false);

  useEffect(() => {
    const specialistStatus = secureLocalStorage.getItem('specialist');
    if (specialistStatus) {
      setSpinner(false);
      setSpecialist(true);
    } else {
      setSpinner(false);
      setSpecialist(false);
    }
  }, []);

  if (spinner) {
    return <Spinner />;
  } else if (specialist) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default MainRoute;
