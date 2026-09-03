import React, { useState, useMemo } from 'react';
import {
  formatINR,
  formatDate,
  statusBadge,
  inputStyle,
  labelStyle,
  cardStyle,
  tableHeaderStyle,
  generateId,
  todayISO
} from './purchaseData';

const SupplierPayments = ({ suppliers, purchaseInvoices, payments, setPayments }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');

  const [formData, setFormData] = useState({
    supplierId: '',
    purchaseInvoiceRef: '',
    paymentDate: todayISO(),
    amount: '',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    utrNo: '',
    notes: ''
  });

  // ─── Reset Form ────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      supplierId: '',
      purchaseInvoiceRef: '',
      paymentDate: todayISO(),
      amount: '',
      paymentMode: 'Bank Transfer (NEFT/RTGS)',
      utrNo: '',
      notes: ''
    });
  };

  // ─── Handle Change ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill amount from invoice
    if (name === 'purchaseInvoiceRef') {
      const inv = purchaseInvoices.find((i) => i.id === value);
      if (inv) {
        setFormData((prev) => ({
          ...prev,
          supplierId: inv.supplierId,
          amount: inv.grandTotal || 0
        }));
      }
    }
  };

  // ─── Handle Submit ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.supplierId) return alert('Please select a supplier.');
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return alert('Please enter a valid payment amount.');
    }

    const newId = generateId('SPAY', payments.filter((p) => p.partyType === 'Supplier').length + 1, 4, 1);
    const supplier = suppliers.find((s) => s.id === formData.supplierId);

    const newPayment = {
      id: newId,
      partyType: 'Supplier',
      supplierId: formData.supplierId,
      partyName: supplier ? supplier.companyName : '',
      refDoc: formData.purchaseInvoiceRef || '',
      amount: parseFloat(formData.amount),
      paymentMode: formData.paymentMode,
      utrNo: formData.utrNo,
      paymentDate: formData.paymentDate,
      notes: formData.notes,
      status: 'Paid'
    };

    setPayments([...payments, newPayment]);

    // Update invoice payment status if linked
    if (formData.purchaseInvoiceRef) {
      const inv = purchaseInvoices.find((i) => i.id === formData.purchaseInvoiceRef);
      if (inv) {
        const totalPaid = payments
          .filter((p) => p.refDoc === formData.purchaseInvoiceRef)
          .reduce((sum, p) => sum + p.amount, 0) + parseFloat(formData.amount);

        if (totalPaid >= inv.grandTotal) {
          // Mark as paid - this would need setPurchaseInvoices prop
          // For now, just alert
        }
      }
    }

    alert('Supplier payment recorded successfully! ID: ' + newId);
    resetForm();
    setShowForm(false);
  };

  // ─── Delete Payment ────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!confirm('Delete this payment record?')) return;
    setPayments(payments.filter((p) => p.id !== id));
    alert('Payment record deleted.');
  };

  // ─── Supplier Payments Only ────────────────────────────────────
  const supplierPayments = useMemo(() => {
    return payments.filter((p) => p.partyType === 'Supplier');
  }, [payments]);

  // ─── Filtered Payments ─────────────────────────────────────────
  const filteredPayments = supplierPayments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      (p.partyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.utrNo || '').toLowerCase().includes(search.toLowerCase());
    const matchesMode = filterMode === 'All' || p.paymentMode === filterMode;
    return matchesSearch && matchesMode;
  });

  // ─── Summary Stats ─────────────────────────────────────────────
  const totalPaid = supplierPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPayable = suppliers.reduce((sum, s) => sum + (s.openingBalance || 0), 0);
  const outstanding = totalPayable - totalPaid;

  // ─── Unpaid Invoices for Reference ─────────────────────────────
  const unpaidInvoices = purchaseInvoices.filter((inv) => inv.paymentStatus !== 'Paid');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>💳 Supplier Payments / Outflow</h2>
        <button
          onClick={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
          style={{ padding: '10px 20px', backgroundColor: showForm ? '#6c757d' : '#20c997', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {showForm ? '✕ Close Form' : '➕ New Payment'}
        </button>
      </div>

      {/* ─── Summary Cards ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#dc3545', color: '#fff', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Total Payables</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(totalPayable, 0)}</h2>
        </div>
        <div style={{ background: '#28a745', color: '#fff', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Total Paid</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(totalPaid, 0)}</h2>
        </div>
        <div style={{ background: '#ffc107', color: '#000', padding: '15px 22px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: '0.9' }}>Outstanding Balance</div>
          <h2 style={{ margin: '4px 0 0 0' }}>{formatINR(outstanding, 0)}</h2>
        </div>
      </div>

      {/* ─── Payment Form ───────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, border: '1px solid #dee2e6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#20c997' }}>➕ Record Supplier Payment</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Supplier *</label>
              <select name='supplierId' value={formData.supplierId} onChange={handleChange} required style={inputStyle}>
                <option value=''>-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Purchase Invoice Ref.</label>
              <select name='purchaseInvoiceRef' value={formData.purchaseInvoiceRef} onChange={handleChange} style={inputStyle}>
                <option value=''>-- Select Invoice (Optional) --</option>
                {unpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {formatINR(inv.grandTotal, 0)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Payment Date *</label>
              <input type='date' name='paymentDate' value={formData.paymentDate} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>Amount (₹) *</label>
              <input type='number' name='amount' value={formData.amount} onChange={handleChange} required placeholder='e.g. 25000' style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Payment Mode</label>
              <select name='paymentMode' value={formData.paymentMode} onChange={handleChange} style={inputStyle}>
                <option value='Bank Transfer (NEFT/RTGS)'>Bank Transfer (NEFT/RTGS)</option>
                <option value='UPI / GPay'>UPI / GPay</option>
                <option value='Cash'>Cash</option>
                <option value='Cheque'>Cheque</option>
                <option value='IMPS'>IMPS</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>UTR / Cheque / Ref No.</label>
              <input type='text' name='utrNo' value={formData.utrNo} onChange={handleChange} placeholder='Transaction reference' style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Notes / Remarks</label>
            <input type='text' name='notes' value={formData.notes} onChange={handleChange} placeholder='Additional notes...' style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#20c997', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Payment
            </button>
            <button type='button' onClick={() => { resetForm(); setShowForm(false); }} style={{ padding: '10px 25px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ─── Search & Filter ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
        <input
          type='text'
          placeholder='🔍 Search by payment no, supplier, or UTR...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1', maxWidth: '400px' }}
        />
        <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} style={{ ...inputStyle, maxWidth: '200px' }}>
          <option value='All'>All Modes</option>
          <option value='Bank Transfer (NEFT/RTGS)'>Bank Transfer</option>
          <option value='UPI / GPay'>UPI / GPay</option>
          <option value='Cash'>Cash</option>
          <option value='Cheque'>Cheque</option>
          <option value='IMPS'>IMPS</option>
        </select>
      </div>

      {/* ─── Payments Table ─────────────────────────────────────── */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: '10px' }}>Payment No.</th>
              <th style={{ padding: '10px' }}>Supplier</th>
              <th style={{ padding: '10px' }}>Invoice Ref</th>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Mode</th>
              <th style={{ padding: '10px' }}>UTR / Ref</th>
              <th style={{ padding: '10px' }}>Amount</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan='9' style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No supplier payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.id}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.partyName}</td>
                  <td style={{ padding: '10px' }}>{p.refDoc || '—'}</td>
                  <td style={{ padding: '10px' }}>{formatDate(p.paymentDate)}</td>
                  <td style={{ padding: '10px' }}>{p.paymentMode}</td>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>{p.utrNo || '—'}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#dc3545' }}>-{formatINR(p.amount, 0)}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={statusBadge(p.status)}>{p.status}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleDelete(p.id)} style={{ color: '#dc3545', border: '1px solid #dc3545', background: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPayments;