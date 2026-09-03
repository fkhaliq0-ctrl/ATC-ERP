import React, { useState } from 'react';

const AccountsPayments = () => {
  const [payments, setPayments] = useState([
    {
      id: 'PAY-2026-001',
      partyName: 'Delhi Fresh Retailers',
      partyType: 'Customer',
      refDoc: 'INV-2026-001',
      amountPaid: 25960,
      paymentMode: 'UPI / HDFC Bank',
      paymentDate: '2026-08-04',
      status: 'Received'
    },
    {
      id: 'PAY-2026-002',
      partyName: 'Apex Feed Suppliers',
      partyType: 'Vendor',
      refDoc: 'PO-2026-001',
      amountPaid: 15000,
      paymentMode: 'Bank NEFT',
      paymentDate: '2026-08-03',
      status: 'Paid Out'
    }
  ]);

  const [formData, setFormData] = useState({
    partyName: '',
    partyType: 'Customer',
    refDoc: '',
    amountPaid: '',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.partyName || !formData.amountPaid) {
      return alert('Party Name and Amount Paid are required.');
    }

    const amt = parseFloat(formData.amountPaid) || 0;

    setPayments([
      ...payments,
      {
        ...formData,
        id: 'PAY-2026-' + String(payments.length + 1).padStart(3, '0'),
        amountPaid: amt,
        status: formData.partyType === 'Customer' ? 'Received' : 'Paid Out'
      }
    ]);

    setFormData({
      partyName: '',
      partyType: 'Customer',
      refDoc: '',
      amountPaid: '',
      paymentMode: 'Bank Transfer (NEFT/RTGS)',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    });

    alert('Payment Voucher recorded successfully!');
  };

  const totalReceived = payments
    .filter((p) => p.partyType === 'Customer')
    .reduce((sum, p) => sum + p.amountPaid, 0);

  const totalPaidOut = payments
    .filter((p) => p.partyType === 'Vendor')
    .reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>💰 Accounts & Payment Vouchers</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#28a745', color: '#fff', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Total Collections (Customer Inflow)</span>
          <h2 style={{ margin: '5px 0 0 0' }}>₹{totalReceived.toLocaleString('en-IN')}</h2>
        </div>
        <div style={{ background: '#dc3545', color: '#fff', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Total Vendor Payouts (Outflow)</span>
          <h2 style={{ margin: '5px 0 0 0' }}>₹{totalPaidOut.toLocaleString('en-IN')}</h2>
        </div>
        <div style={{ background: '#007bff', color: '#fff', padding: '15px 20px', borderRadius: '8px', flex: '1' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>Net Cashflow Balance</span>
          <h2 style={{ margin: '5px 0 0 0' }}>₹{(totalReceived - totalPaidOut).toLocaleString('en-IN')}</h2>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #dee2e6' }}>
        <h3>💳 Record Payment / Receipt Voucher</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Party Type *</label>
              <select name='partyType' value={formData.partyType} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value='Customer'>Customer (Receipt Inflow)</option>
                <option value='Vendor'>Vendor (Payment Outflow)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Party Name *</label>
              <input type='text' name='partyName' value={formData.partyName} onChange={handleChange} required placeholder='e.g. Delhi Fresh Retailers' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Reference Document No.</label>
              <input type='text' name='refDoc' value={formData.refDoc} onChange={handleChange} placeholder='e.g. INV-2026-001 or PO-2026-001' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Payment Date *</label>
              <input type='date' name='paymentDate' value={formData.paymentDate} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Amount (₹) *</label>
              <input type='number' name='amountPaid' value={formData.amountPaid} onChange={handleChange} required placeholder='e.g. 25000' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Payment Mode</label>
              <select name='paymentMode' value={formData.paymentMode} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value='Bank Transfer (NEFT/RTGS)'>Bank Transfer (NEFT/RTGS)</option>
                <option value='UPI / GPay'>UPI / GPay</option>
                <option value='Cash'>Cash</option>
                <option value='Cheque'>Cheque</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Remarks / Transaction Ref</label>
              <input type='text' name='notes' value={formData.notes} onChange={handleChange} placeholder='e.g. UTR / Cheque No. 123456' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <button type='submit' style={{ padding: '10px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Save Voucher
          </button>
        </form>
      </div>

      <h3>Payment & Receipt History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#343a40', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Voucher No.</th>
            <th style={{ padding: '10px' }}>Party Name</th>
            <th style={{ padding: '10px' }}>Type</th>
            <th style={{ padding: '10px' }}>Ref Doc</th>
            <th style={{ padding: '10px' }}>Payment Mode</th>
            <th style={{ padding: '10px' }}>Date</th>
            <th style={{ padding: '10px' }}>Amount</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.id}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.partyName}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: p.partyType === 'Customer' ? '#e2e3e5' : '#fff3cd',
                  padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                }}>
                  {p.partyType}
                </span>
              </td>
              <td style={{ padding: '10px', fontFamily: 'monospace' }}>{p.refDoc || '—'}</td>
              <td style={{ padding: '10px' }}>{p.paymentMode}</td>
              <td style={{ padding: '10px' }}>{p.paymentDate}</td>
              <td style={{ padding: '10px', fontWeight: 'bold', color: p.partyType === 'Customer' ? '#28a745' : '#dc3545' }}>
                {p.partyType === 'Customer' ? '+' : '-'}₹{p.amountPaid.toLocaleString('en-IN')}
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: p.status === 'Received' ? '#d4edda' : '#f8d7da',
                  color: p.status === 'Received' ? '#155724' : '#721c24',
                  padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px'
                }}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsPayments;
