import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/Shared.css';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [mastersOpen, setMastersOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);

  return (
    <div className="atc-container">
      <div className="atc-main page-container">
        {children || <Outlet />}
      </div>

      <div className="atc-sidebar">
        <div className="atc-brand">
          <span className="atc-logo">🏢</span>
          <span className="atc-name">ATC</span>
          <span className="atc-sub">Allied Trading Corp</span>
        </div>
        <ul className="atc-menu">
          <li><Link to="/dashboard">📊 Dashboard</Link></li>
          <li>
            <span className="menu-toggle" onClick={() => setPurchaseOpen(!purchaseOpen)}>
              🛒 Purchase {purchaseOpen ? '▼' : '▶'}
            </span>
            {purchaseOpen && (
              <ul className="atc-submenu">
                <li><Link to="/purchase/order">Purchase Order</Link></li>
                <li><Link to="/purchase/receipt">Goods Receipt</Link></li>
                <li><Link to="/purchase/invoice">Purchase Invoice</Link></li>
              </ul>
            )}
          </li>
          <li>
            <span className="menu-toggle" onClick={() => setSalesOpen(!salesOpen)}>
              📦 Sales {salesOpen ? '▼' : '▶'}
            </span>
            {salesOpen && (
              <ul className="atc-submenu">
                <li><Link to="/sales/order">Sales Order</Link></li>
                <li><Link to="/sales/invoice">Sales Invoice</Link></li>
                <li><Link to="/sales/challan">Delivery Challan</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/inventory">📦 Inventory</Link></li>
          <li><Link to="/accounts">💰 Accounts</Link></li>
          <li>
            <span className="menu-toggle" onClick={() => setMastersOpen(!mastersOpen)}>
              🗂️ Masters {mastersOpen ? '▼' : '▶'}
            </span>
            {mastersOpen && (
              <ul className="atc-submenu">
                <li><Link to="/masters/customer">Customer</Link></li>
                <li><Link to="/masters/vendor">Vendor</Link></li>
                <li><Link to="/masters/item">Item</Link></li>
                <li><Link to="/masters/tax">Tax</Link></li>
                <li><Link to="/masters/unit">Unit</Link></li>
                <li><Link to="/masters/warehouse">Warehouse</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainLayout;
