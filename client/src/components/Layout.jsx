// src/components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/auth';

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}
      <div className={`flex-1 ${hideSidebar ? '' : 'p-6'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
