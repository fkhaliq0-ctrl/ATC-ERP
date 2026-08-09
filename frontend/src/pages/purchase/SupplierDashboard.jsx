import React, { useMemo } from 'react';
import { formatINR, formatDate, statusBadge, cardStyle } from './purchaseData';

const SupplierDashboard = ({ suppliers, purchaseOrders, purchaseInvoices, grns, payments, returns }) => {
  // ─── Analytics Calculations ─────────────────────────────────────
  const stats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter((s) => s.status === 'Active').length;

    const totalPurchaseValue = purchaseInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const totalGstInput = purchaseInvoices.reduce((sum, inv) => sum + (inv.totalGST || 0), 0);

    const pendingPOs = purchaseOrders.filter((po) => po.status === 'Pending' || po.status === 'Partially Received').length;
    const completedPOs = purchaseOrders.filter((po) => po.status === 'Received' || po.status === 'Completed').length;

    const totalPayables = suppliers.reduce((sum, s) => sum + (s.openingBalance || 0), 0);
    const totalPaid = payments.filter((p) => p.partyType === 'Supplier').reduce((sum, p) => sum + p.amount, 0);
    const totalReturns = returns.reduce((sum, r) => sum + (r.returnAmount || 0), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthPurchases = purchaseInvoices
      .filter((inv) => {
        const d = new Date(inv.invoiceDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    return {
      totalSuppliers,
      activeSuppliers,
      totalPurchaseValue,
      totalGstInput,
      pendingPOs,
      completedPOs,
      totalPayables,
      totalPaid,
      totalReturns,
      monthPurchases,
      outstandingPayables: totalPayables - totalPaid
    };
  }, [suppliers, purchaseOrders, purchaseInvoices, payments, returns]);

  // ─── Top Suppliers by Purchase Value ───────────────────────────
  const topSuppliers = useMemo(() => {
    const supplierTotals = {};
    purchaseInvoices.forEach((inv) => {
      supplierTotals[inv.supplierId] = (supplierTotals[inv.supplierId] || 0) + (inv.grandTotal || 0);
    });
    return Object.entries(supplierTotals)
      .map(([id, total]) => ({
        supplier: suppliers.find((s) => s.id === id),
        total
      }))
      .filter((item) => item.supplier)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [purchaseInvoices, suppliers]);

  // ─── Recent Purchase Invoices ──────────────────────────────────
  const recentInvoices = useMemo(() => {
    return [...purchaseInvoices].sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0, 5);
  }, [purchaseInvoices]);

  // ─── Stat Card Component ───────────────────────────────────────
  const StatCard = ({ label, value, sublabel, color, icon }) => (
    <div
      style={{
        background: color,
        color: '#fff',
        padding: '18px 22px',
        borderRadius: '8px',
        flex: '1',
        minWidth: '200px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>{label}</div>
      <h2 style={{ margin: '4px 0 0 0', fontSize: '22px' }}>{value}</h2>
      {sublabel && <div style={{ fontSize: '11px', marginTop: '4px', opacity: '0.85' }}>{sublabel}</div>}
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📊 Purchase & Supplier Dashboard</h2>

      {/* ─── Top Stat Cards ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <StatCard
          label="Total Suppliers"
          value={stats.totalSuppliers}
          sublabel={`${stats.activeSuppliers} Active`}
          color="#007bff"
          icon="🏭"
        />
        <StatCard
          label="Total Purchase Value"
          value={formatINR(stats.totalPurchaseValue, 0)}
          sublabel={`This Month: ${formatINR(stats.monthPurchases, 0)}`}
          color="#28a745"
          icon="🛒"
        />
        <StatCard
          label="GST Input Credit"
          value={formatINR(stats.totalGstInput, 0)}
          sublabel="Available to Claim"
          color="#17a2b8"
          icon="🧾"
        />
        <StatCard
          label="Outstanding Payables"
          value={formatINR(stats.outstandingPayables, 0)}
          sublabel={`Paid: ${formatINR(stats.totalPaid, 0)}`}
          color="#dc3545"
          icon="💰"
        />
      </div>

      {/* ─── Secondary Stat Cards ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <StatCard
          label="Pending POs"
          value={stats.pendingPOs}
          sublabel={`${stats.completedPOs} Completed`}
          color="#ffc107"
          icon="📝"
        />
        <StatCard
          label="Total GRNs"
          value={grns.length}
          sublabel="Goods Receipt Notes"
          color="#6f42c1"
          icon="🚛"
        />
        <StatCard
          label="Purchase Returns"
          value={returns.length}
          sublabel={`Value: ${formatINR(stats.totalReturns, 0)}`}
          color="#fd7e14"
          icon="↩️"
        />
        <StatCard
          label="Supplier Payments"
          value={payments.filter((p) => p.partyType === 'Supplier').length}
          sublabel={`Total: ${formatINR(stats.totalPaid, 0)}`}
          color="#20c997"
          icon="💳"
        />
      </div>

      {/* ─── Two Column Layout ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top Suppliers */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #007bff', paddingBottom: '8px', color: '#007bff' }}>
            🏆 Top Suppliers by Purchase Value
          </h3>
          {topSuppliers.length === 0 ? (
            <div style={{ color: '#6c757d', padding: '20px', textAlign: 'center' }}>No purchase data yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Supplier</th>
                  <th style={{ padding: '8px' }}>Category</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Total Purchases</th>
                </tr>
              </thead>
              <tbody>
                {topSuppliers.map((item, idx) => (
                  <tr key={item.supplier.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '8px' }}>
                      <strong>{idx + 1}.</strong> {item.supplier.companyName}
                    </td>
                    <td style={{ padding: '8px' }}>{item.supplier.category}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                      {formatINR(item.total, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Invoices */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #28a745', paddingBottom: '8px', color: '#28a745' }}>
            🧾 Recent Purchase Invoices
          </h3>
          {recentInvoices.length === 0 ? (
            <div style={{ color: '#6c757d', padding: '20px', textAlign: 'center' }}>No invoices recorded yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Invoice #</th>
                  <th style={{ padding: '8px' }}>Supplier</th>
                  <th style={{ padding: '8px' }}>Date</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => {
                  const supplier = suppliers.find((s) => s.id === inv.supplierId);
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{inv.id}</td>
                      <td style={{ padding: '8px' }}>{supplier ? supplier.companyName : '—'}</td>
                      <td style={{ padding: '8px' }}>{formatDate(inv.invoiceDate)}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatINR(inv.grandTotal, 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── Supplier Outstanding Summary ───────────────────────── */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #dc3545', paddingBottom: '8px', color: '#dc3545' }}>
          💰 Supplier Outstanding Summary
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Supplier ID</th>
              <th style={{ padding: '10px' }}>Company Name</th>
              <th style={{ padding: '10px' }}>Payment Terms</th>
              <th style={{ padding: '10px' }}>Opening Balance</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.companyName}</td>
                <td style={{ padding: '10px' }}>{s.paymentTerms}</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: s.openingBalance > 0 ? '#dc3545' : '#28a745' }}>
                  {formatINR(s.openingBalance, 0)}
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={statusBadge(s.status)}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierDashboard;