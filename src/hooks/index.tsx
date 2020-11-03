import React from 'react';

import { AuthProvider } from './auth';

// Modularizando os Hooks que vão ficar no App
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
