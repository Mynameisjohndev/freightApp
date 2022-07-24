import React from 'react';

import { AuthProvider } from './useAuth';
import { PermissionsProvider } from './usePermissions';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <PermissionsProvider>{children}</PermissionsProvider>
  </AuthProvider>
);

export default AppProvider;
