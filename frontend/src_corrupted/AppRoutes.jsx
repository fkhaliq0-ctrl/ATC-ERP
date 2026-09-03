import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import AgentPage from './pages/AgentPage';
import SalesInvoice from './pages/sales/SalesInvoice';
import PurchaseInvoice from './pages/purchase/PurchaseInvoice';
import Reports from './pages/Reports';
import MenuSelection from './pages/MenuSelection';
import CustomerMaster from './pages/masters/CustomerMaster';
import VendorMaster from './pages/masters/VendorMaster';
import ItemMaster from './pages/masters/ItemMaster';
import UnitMaster from './pages/masters/UnitMaster';
import TaxMaster from './pages/masters/TaxMaster';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/sales/invoice" element={<SalesInvoice />} />
      <Route path="/purchase/invoice" element={<PurchaseInvoice />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/menu-selection" element={<MenuSelection />} />
      <Route path="/masters/customer" element={<CustomerMaster />} />
      <Route path="/masters/vendor" element={<VendorMaster />} />
      <Route path="/masters/item" element={<ItemMaster />} />
      <Route path="/masters/unit" element={<UnitMaster />} />
      <Route path="/masters/tax" element={<TaxMaster />} />
    </Routes>
  );
};

export default AppRoutes;
