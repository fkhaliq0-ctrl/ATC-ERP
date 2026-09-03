import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

// Capacitor is only needed for mobile (APK) builds
// For web, we use a dummy object
const Capacitor = (() => {
  if (typeof window !== 'undefined' && window.Capacitor) {
    return window.Capacitor;
  }
  return {
    isNativePlatform: () => false,
    getPlatform: () => 'web',
    registerPlugin: () => {},
    Plugin: class {}
  };
})();

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
