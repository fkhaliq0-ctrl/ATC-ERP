import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import AgentPage from '../pages/AgentPage';
import SalesInvoice from '../pages/sales/SalesInvoice';
import PurchaseInvoice from '../pages/purchase/PurchaseInvoice';
import MenuSelection from '../pages/MenuSelection';
import MenuCalculator from '../pages/MenuCalculator';
import CustomerMaster from '../pages/masters/CustomerMaster';
import VendorMaster from '../pages/masters/VendorMaster';
import ItemMaster from '../pages/masters/ItemMaster';
import UnitMaster from '../pages/masters/UnitMaster';
import TaxMaster from '../pages/masters/TaxMaster';
import ApkDownload from '../pages/ApkDownload';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/sales/invoice" element={<SalesInvoice />} />
      <Route path="/purchase/invoice" element={<PurchaseInvoice />} />
      <Route path="/menu-selection" element={<MenuSelection />} />
      <Route path="/menu-calculator" element={<MenuCalculator />} />
      <Route path="/masters/customer" element={<CustomerMaster />} />
      <Route path="/masters/vendor" element={<VendorMaster />} />
      <Route path="/masters/item" element={<ItemMaster />} />
      <Route path="/masters/unit" element={<UnitMaster />} />
      <Route path="/masters/tax" element={<TaxMaster />} />
      <Route path="/apk-download" element={<ApkDownload />} />
    </Routes>
  );
};

export default AppRoutes;
