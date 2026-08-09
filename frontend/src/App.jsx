import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './layouts/MainLayout';
import MenuSelection from './pages/MenuSelection';
import AgentPage from './pages/AgentPage';
import MastersModule from './pages/masters/MastersModule';
import PurchaseModule from './pages/purchase/PurchaseModule';
import SalesModule from './pages/sales/SalesModule';
import StockInventory from './pages/inventory/StockInventory';
import AccountsPayments from './pages/accounts/AccountsPayments';
import CustomerMaster from './pages/masters/CustomerMaster';
import VendorMaster from './pages/masters/VendorMaster';
import ItemMaster from './pages/masters/ItemMaster';
import TaxMaster from './pages/masters/TaxMaster';
import UnitMaster from './pages/masters/UnitMaster';
import WarehouseMaster from './pages/masters/WarehouseMaster';
import PurchaseOrder from './pages/purchase/PurchaseOrder';
import GoodsReceipt from './pages/purchase/GoodsReceipt';
import PurchaseInvoice from './pages/purchase/PurchaseInvoice';
import SalesOrder from './pages/sales/SalesOrder';
import SalesInvoice from './pages/sales/SalesInvoice';
import DeliveryChallan from './pages/sales/DeliveryChallan';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/menu" element={<MenuSelection />} />
      <Route path="/agent" element={<AgentPage />} />
      
      {/* Masters */}
      <Route path="/masters" element={<MainLayout><MastersModule /></MainLayout>} />
      <Route path="/masters/customer" element={<MainLayout><CustomerMaster /></MainLayout>} />
      <Route path="/masters/vendor" element={<MainLayout><VendorMaster /></MainLayout>} />
      <Route path="/masters/item" element={<MainLayout><ItemMaster /></MainLayout>} />
      <Route path="/masters/tax" element={<MainLayout><TaxMaster /></MainLayout>} />
      <Route path="/masters/unit" element={<MainLayout><UnitMaster /></MainLayout>} />
      <Route path="/masters/warehouse" element={<MainLayout><WarehouseMaster /></MainLayout>} />
      
      {/* Purchase */}
      <Route path="/purchase" element={<MainLayout><PurchaseModule /></MainLayout>} />
      <Route path="/purchase/order" element={<MainLayout><PurchaseOrder /></MainLayout>} />
      <Route path="/purchase/receipt" element={<MainLayout><GoodsReceipt /></MainLayout>} />
      <Route path="/purchase/invoice" element={<MainLayout><PurchaseInvoice /></MainLayout>} />
      
      {/* Sales */}
      <Route path="/sales" element={<MainLayout><SalesModule /></MainLayout>} />
      <Route path="/sales/order" element={<MainLayout><SalesOrder /></MainLayout>} />
      <Route path="/sales/invoice" element={<MainLayout><SalesInvoice /></MainLayout>} />
      <Route path="/sales/challan" element={<MainLayout><DeliveryChallan /></MainLayout>} />
      
      <Route path="/inventory" element={<MainLayout><StockInventory /></MainLayout>} />
      <Route path="/accounts" element={<MainLayout><AccountsPayments /></MainLayout>} />
    </Routes>
  );
}

export default App;
