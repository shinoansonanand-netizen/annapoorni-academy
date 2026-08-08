import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AppRoutes } from './routes/AppRoutes';

import './styles/main.css';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SiteSettingsProvider>
          <AdminAuthProvider>
            <AppRoutes />
          </AdminAuthProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
