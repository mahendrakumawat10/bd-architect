import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { MainContext } from '../../Context';

const PrivateRoute = ({ children }) => {
  const { adminToken } = useContext(MainContext);

  return adminToken ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
