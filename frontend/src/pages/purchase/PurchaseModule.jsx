import React, { useState } from 'react';
import { SEED_SUPPLIERS } from './purchaseData';
import SupplierDashboard from './SupplierDashboard';
import SupplierMaster from './SupplierMaster';
import PurchaseOrder from './PurchaseOrder';
import GoodsReceipt from './GoodsReceipt';
import PurchaseInvoice from './PurchaseInvoice';
import PurchaseReturns from './PurchaseReturns';
import SupplierPayments from './SupplierPayments';

const PurchaseModule = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ─── Shared State (Module-Level Data) ──────────────────────────
  const [suppliers, setSuppliers] = useState(SEED_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [grns, setGrns] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [returns, setReturns] = useState([]);
  const [payments, setPayments] = useState([]);

  // ─── Tab Configuration ─────────────────────────────────────────
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#007bff' },
    { id: 'suppliers', label: 'Supplier Master', icon: '🏭', color: '#28a745' },
    { id: 'po', label: 'Purchase Orders', icon: '📝', color: '#17a2b8' },
    { id: 'grn', label: 'Goods Receipt (GRN)', icon: '🚛', color: '#6f42c1' },
    { id: 'invoice', label: 'Purchase Invoice', icon: '🧾', color: '#fd7e14' },
    { id: 'returns', label: 'Purchase Returns', icon: '↩️', color: '#dc3545' },
    { id: 'payments', label: 'Supplier Payments', icon: '💳', color: '#20c997' }
  ];

  const tabBtnStyle = (tab) => ({
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: activeTab === tab.id ? '#fff' : '#495057',
    backgroundColor: activeTab === tab.id ? tab.color : '#e9ecef',
    border: 'none',
    cursor: 'pointer',
    borderBottom: activeTab === tab.id ? `3px solid ${tab.color}` : 'none',
    borderRadius: '4px 4px 0 0',
    marginRight: '4px',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      {/* ─── Tab Navigation Bar ─────────────────────────────────── */}
      <div style={{ background: '#fff', padding: '10px 20px 0 20px', borderBottom: '2px solid #dee2e6', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {tabs.map((tab) => (
          <button key={tab.id} style={tabBtnStyle(tab)} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ────────────────────────────────────────── */}
      <div>
        {activeTab === 'dashboard' && (
          <SupplierDashboard
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            purchaseInvoices={purchaseInvoices}
            grns={grns}
            payments={payments}
            returns={returns}
          />
        )}
        {activeTab === 'suppliers' && (
          <SupplierMaster suppliers={suppliers} setSuppliers={setSuppliers} />
        )}
        {activeTab === 'po' && (
          <PurchaseOrder
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            setPurchaseOrders={setPurchaseOrders}
          />
        )}
        {activeTab === 'grn' && (
          <GoodsReceipt
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            grns={grns}
            setGrns={setGrns}
          />
        )}
        {activeTab === 'invoice' && (
          <PurchaseInvoice
            suppliers={suppliers}
            purchaseOrders={purchaseOrders}
            grns={grns}
            purchaseInvoices={purchaseInvoices}
            setPurchaseInvoices={setPurchaseInvoices}
          />
        )}
        {activeTab === 'returns' && (
          <PurchaseReturns
            suppliers={suppliers}
            purchaseInvoices={purchaseInvoices}
            grns={grns}
            returns={returns}
            setReturns={setReturns}
          />
        )}
        {activeTab === 'payments' && (
          <SupplierPayments
            suppliers={suppliers}
            purchaseInvoices={purchaseInvoices}
            payments={payments}
            setPayments={setPayments}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseModule;