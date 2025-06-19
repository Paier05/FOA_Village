import React from 'react';

const DashboardLayout = ({ Sidebar, children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '30px', background: '#f5f7ff' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;