import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';
import ZebaishLayout from './layouts/ZebaishLayout';
import AgentPage from './pages/ChannelPartner';
import './App.css';

function App() {
  // Detect Capacitor environment
  const isCapacitor = Capacitor.isNativePlatform() || 
                       window.Capacitor?.isNativePlatform() || 
                       window.location.protocol === 'capacitor:' ||
                       Capacitor.getPlatform() !== 'web';

  return (
    <BrowserRouter>
      {isCapacitor ? (
        // APK: Show only AgentPage with ZebaishLayout (no sidebar)
        <ZebaishLayout>
          <AgentPage />
        </ZebaishLayout>
      ) : (
        // Desktop: Show MainLayout with Dashboard and sidebar
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      )}
    </BrowserRouter>
  );
}

export default App;
